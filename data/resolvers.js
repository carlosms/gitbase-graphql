import mysqlPool from './connectors';

const vm = require('vm');

const PROTO_PATH = `${__dirname}/../proto/generated.proto`;

const grpc = require('grpc');

const bblfshUAST = grpc.load(PROTO_PATH).gopkg.in.bblfsh.sdk.v1.uast;

function logErr(e) {
  if (e.sqlMessage) {
    console.debug(`Failure. Query: ${e.sql}; error message: ${e.sqlMessage}`);
  } else {
    console.debug(e);
  }
}

function arrayToElem(elemArr) {
  if (elemArr.length > 0) {
    return elemArr[0];
  }

  return null;
}

function treeEntriesQuery(sql) {
  return mysqlPool.getConnection().then(connection => connection
    .query(sql)
    .then(rows => rows.map(r => ({
      _repository_id: r.repository_id,
      hash: r.tree_hash,
      _blob_hash: r.blob_hash,
      mode: r.tree_entry_mode,
      name: r.tree_entry_name,
      language: r.language,
    })))
    .catch((e) => {
      logErr(e);
      return [];
    }));
}

function treeEntries(where, args) {
  let sql = `SELECT
        repository_id, tree_hash, blob_hash, tree_entry_mode, tree_entry_name,
        language(tree_entry_name) AS language
        FROM tree_entries
        WHERE ${where}`;

  if (args && args.name) {
    sql += ` AND tree_entry_name='${args.name}'`;
  }

  if (args && args.language) {
    sql += ` AND language(tree_entry_name)='${args.language}'`;
  }

  return treeEntriesQuery(sql);
}

function filesQuery(sql) {
  return mysqlPool.getConnection().then(connection => connection
    .query(sql)
    .then(rows => rows.map(r => ({
      _repository_id: r.repository_id,
      path: r.file_path,
      _blob_hash: r.blob_hash,
      rootTreeHash: r.tree_hash,
      mode: r.tree_entry_mode,
      content: r.blob_content,
      size: r.blob_size,
      language: r.language,
    })))
    .catch((e) => {
      logErr(e);
      return [];
    }));
}

function files(where, args) {
  let sql = `SELECT *, language(file_path) AS language
    FROM files
    WHERE ${where}`;

  if (args && args.path) {
    sql += ` AND file_path='${args.path}'`;
  }

  if (args && args.language) {
    sql += ` AND language(file_path)='${args.language}'`;
  }

  return filesQuery(sql);
}


function commitsQuery(sql) {
  return mysqlPool.getConnection().then(connection => connection
    .query(sql)
    .then(rows => rows.map(r => ({
      _repository_id: r.repository_id,
      hash: r.commit_hash,
      authorName: r.commit_author_name,
      authorEmail: r.commit_author_email,
      authorWhen: r.commit_author_when,
      committerName: r.committer_name,
      committerEmail: r.committer_email,
      committerWhen: r.committer_when,
      message: r.commit_message,
      _tree_hash: r.tree_hash,
    })))
    .catch((e) => {
      logErr(e);
      return [];
    }));
}

function commits(where, args) {
  let sql = `SELECT * FROM commits WHERE ${where}`;

  if (args && args.authorName) {
    sql += ` AND commit_author_name='${args.authorName}'`;
  }

  if (args && args.authorEmail) {
    sql += ` AND commit_author_email='${args.authorEmail}'`;
  }

  return commitsQuery(sql);
}

function blobsQuery(sql) {
  return mysqlPool.getConnection().then(connection => connection
    .query(sql)
    .then(rows => rows.map(r => ({
      _repository_id: r.repository_id,
      hash: r.blob_hash,
      size: r.blob_size,
      content: r.blob_content,
    })))
    .catch((e) => {
      logErr(e);
      return [];
    }));
}

function blobs(where, args) {
  let sql = `SELECT * FROM blobs WHERE ${where}`;

  if (args && args.hash) {
    sql += ` AND blob_hash='${args.hash}'`;
  }

  return blobsQuery(sql);
}

function flattenUastArr(uast, args) {
  if (!args.flat) {
    return uast;
  }

  return uast.reduce(
    (acc, node) => acc.concat([node].concat(flattenUastArr(node.children, args))),
    [],
  );
}

function uastFilter(node, args) {
  let good =
    (!args.token || node.token === args.token) &&
    (!args.internal_type || node.internal_type === args.internal_type);

  if (good && args.filter_func !== undefined) {
    // This is experimental, nodejs does not claim vm to be secure to execute
    // untrusted code
    const sandbox = { node, result: false };
    vm.createContext(sandbox);
    vm.runInContext(args.filter_func, sandbox);

    good = sandbox.result;
  }

  return good;
}

function uastQuery(sql, args) {
  return mysqlPool.getConnection().then(connection => connection
    .query(sql)
    .then((rows) => {
      // This should be only one row
      if (rows.length > 0) {
        const arr = JSON.parse(rows[0].uast);

        const parsed = arr
          .map((e) => {
            const decoded = bblfshUAST.Node.decode(e);

            // graphql-type-json will try to stringify, and it will fail
            // because of circular references

            const st = JSON.stringify(decoded, (key, value) => {
            // skip properties, it contains circular references (builder, parent)
              if (key === 'properties') {
                return undefined;
              }

              return value;
            });

            // Parse back to json, otherwise graphql-type-json will return
            // a string
            return JSON.parse(st);
          });


        const flattened = flattenUastArr(parsed, args);
        return flattened.filter(node => uastFilter(node, args));
      }

      return [];
    })
    .catch((e) => {
      logErr(e);
      return [];
    }));
}

function uastUDF(column, args) {
  let uastArgs = column;

  if (args.language || args.xpath) {
    if (args.language) {
      uastArgs += `, '${args.language}'`;
    } else {
      uastArgs += ", ''";
    }
  }
  if (args.xpath) {
    uastArgs += `, '${args.xpath}'`;
  }

  return `uast(${uastArgs})`;
}

const resolvers = {
  Query: {
    repository(root, args) {
      return mysqlPool.getConnection().then(connection =>
        connection
          .query(`SELECT repository_id FROM repositories WHERE repository_id='${args.id}'`)
          .then(rows => ({ id: rows[0].repository_id }))
          .catch((e) => {
            logErr(e);
          }));
    },

    allRepositories() {
      return mysqlPool.getConnection().then(connection =>
        connection
          .query('SELECT repository_id FROM repositories')
          .then(rows => rows.map(r => ({ id: r.repository_id }))));
    },
  },

  Repository: {
    refs(repository, args) {
      return mysqlPool.getConnection().then((connection) => {
        let sql = `
        SELECT ref_name, commit_hash,
        is_remote(ref_name) AS is_remote,
        is_tag(ref_name) AS is_tag
        FROM refs WHERE repository_id='${repository.id}'`;

        if (args.name !== undefined) {
          sql += ` AND ref_name='${args.name}'`;
        }
        if (args.isRemote !== undefined) {
          sql += ` AND is_remote(ref_name)=${args.isRemote}`;
        }
        if (args.isTag !== undefined) {
          sql += ` AND is_tag(ref_name)=${args.isTag}`;
        }

        return connection.query(sql).then(rows =>
          rows.map(r => ({
            name: r.ref_name,
            commitHash: r.commit_hash,
            _repository_id: repository.id,
            isRemote: r.is_remote.toString() === '1', // type Buffer
            isTag: r.is_tag.toString() === '1', // type Buffer
          })));
      });
    },
    remotes(repository, args) {
      return mysqlPool.getConnection().then((connection) => {
        let sql = `
        SELECT remote_name, remote_push_url, remote_fetch_url,
        remote_push_refspec, remote_fetch_refspec
        FROM remotes WHERE repository_id='${repository.id}'`;

        if (args.name !== undefined) {
          sql += ` AND remote_name='${args.name}'`;
        }

        return connection.query(sql).then(rows =>
          rows.map(r => ({
            _repository_id: repository.id,
            name: r.remote_name,
            pushUrl: r.remote_push_url,
            fetchUrl: r.remote_fetch_url,
            pushRefspec: r.remote_push_refspec,
            fetchRefspec: r.remote_fetch_refspec,
          })));
      });
    },
  },

  Ref: {
    repository(ref) {
      return { id: ref._repository_id };
    },
    commit(ref) {
      return commits(`repository_id='${ref._repository_id}' AND commit_hash='${ref.commitHash}'`)
        .then(arrayToElem);
    },
    commits(ref, args) {
      let sql = `SELECT commits.*, ref_commits.index
      FROM ref_commits INNER JOIN commits
        ON ref_commits.repository_id=commits.repository_id
        AND ref_commits.commit_hash=commits.commit_hash
      WHERE ref_commits.repository_id='${ref._repository_id}'
        AND ref_commits.ref_name='${ref.name}'`;

      if (args && args.authorName) {
        sql += ` AND commits.commit_author_name='${args.authorName}'`;
      }

      if (args && args.authorEmail) {
        sql += ` AND commits.commit_author_email='${args.authorEmail}'`;
      }

      sql += ' ORDER BY ref_commits.index ASC';

      return commitsQuery(sql);
    },
  },

  Remote: {
    repository(remote) {
      return { id: remote._repository_id };
    },
  },

  Commit: {
    blobs(commit, args) {
      let sql = `SELECT blobs.*
      FROM blobs INNER JOIN commit_blobs
        ON blobs.repository_id=commit_blobs.repository_id
        AND blobs.blob_hash=commit_blobs.blob_hash
      WHERE commit_blobs.commit_hash='${commit.hash}'`;

      if (args && args.hash) {
        sql += ` AND blobs.blob_hash='${args.hash}'`;
      }

      return blobsQuery(sql);
    },
    repository(commit) {
      return { id: commit._repository_id };
    },
    treeEntries(commit, args) {
      let sql = `SELECT tree_entries.*,
        language(tree_entries.tree_entry_name) AS language
      FROM tree_entries INNER JOIN commit_trees
        ON tree_entries.repository_id=commit_trees.repository_id
        AND tree_entries.tree_hash=commit_trees.tree_hash
      WHERE tree_entries.repository_id='${commit._repository_id}'
        AND commit_trees.commit_hash='${commit.hash}'`;

      if (args && args.name) {
        sql += ` AND tree_entries.tree_entry_name='${args.name}'`;
      }

      if (args && args.language) {
        sql += ` AND language(tree_entries.tree_entry_name)='${args.language}'`;
      }

      return treeEntriesQuery(sql);
    },
    files(commit, args) {
      let sql = `SELECT files.*, language(files.file_path) AS language
        FROM files
        JOIN commit_files ON
          files.repository_id=commit_files.repository_id AND
          files.file_path=commit_files.file_path AND
          files.blob_hash=commit_files.blob_hash AND
          files.tree_hash=commit_files.tree_hash
        WHERE
          files.repository_id='${commit._repository_id}' AND
          commit_hash='${commit.hash}'`;

      if (args && args.path) {
        sql += ` AND files.file_path='${args.path}'`;
      }

      if (args && args.language) {
        sql += ` AND language(files.file_path)='${args.language}'`;
      }

      return filesQuery(sql);
    },
  },

  Blob: {
    treeEntries(blob, args) {
      return treeEntries(`blob_hash='${blob.hash}'`, args);
    },
    repository(blob) {
      return { id: blob._repository_id };
    },
    file(blob, args) {
      return files(`repository_id='${blob._repository_id}' AND blob_hash='${blob.hash}'`, args)
        .then(arrayToElem);
    },
    uastRaw(blob, args) {
      return resolvers.Blob.uast(blob, args);
    },
    uast(blob, args) {
      const sql = `SELECT ${uastUDF('blobs.blob_content', args)} as uast
        FROM blobs WHERE blob_hash='${blob.hash}'`;

      return uastQuery(sql, args);
    },
  },

  UASTNode: {
    children(uast, args) {
      const { children } = uast;
      const flattened = flattenUastArr(children, args);
      return flattened.filter(node => uastFilter(node, args));
    },
    childrenRaw(uast) {
      return uast.children;
    },
  },

  TreeEntry: {
    repository(entry) {
      return { id: entry._repository_id };
    },
    blob(entry) {
      return blobs(`blob_hash='${entry._blob_hash}'`)
        .then(arrayToElem);
    },
  },

  File: {
    blob(file) {
      return blobs(`repository_id='${file._repository_id}' AND blob_hash='${file._blob_hash}'`)
        .then(arrayToElem);
    },
    uastRaw(file, args) {
      return resolvers.File.uast(file, args);
    },
    uast(file, args) {
      const sql = `SELECT ${uastUDF('files.blob_content', args)} as uast
        FROM files WHERE blob_hash='${file._blob_hash}'`;

      return uastQuery(sql, args);
    },
  },
};


export default resolvers;
