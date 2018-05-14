import mysqlPool from './connectors';

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

function treeEntries(where, args) {
  return mysqlPool.getConnection().then((connection) => {
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

    return connection
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
      });
  });
}

function commits(where, args) {
  return mysqlPool.getConnection().then((connection) => {
    let sql = `SELECT * FROM commits WHERE ${where}`;

    if (args && args.authorName) {
      sql += ` AND commit_author_name='${args.authorName}'`;
    }

    if (args && args.authorEmail) {
      sql += ` AND commit_author_email='${args.authorEmail}'`;
    }

    return connection
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
      });
  });
}

function blobs(where, args) {
  return mysqlPool.getConnection().then((connection) => {
    let sql = `SELECT * FROM blobs WHERE ${where}`;

    if (args && args.hash) {
      sql += ` AND blob_hash='${args.hash}'`;
    }

    return connection
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
      });
  });
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
    commits(repository, args) {
      return commits(`repository_id='${repository.id}'`, args);
    },
    blobs(repository, args) {
      return blobs(`repository_id='${repository.id}'`, args);
    },
    treeEntries(repository, args) {
      return treeEntries(`repository_id='${repository.id}'`, args);
    },
  },

  Ref: {
    repository(ref) {
      return { id: ref._repository_id };
    },
    commit(ref) {
      return commits(`commit_hash='${ref.commitHash}'`)
        .then((commitsArr) => {
          if (commitsArr.length > 0) {
            return commitsArr[0];
          }
        });
    },
  },

  Remote: {
    repository(remote) {
      return { id: remote._repository_id };
    },
  },

  Commit: {
    blobs(commit, args) {
      return blobs(`commit_has_blob('${commit.hash}', blob_hash)`, args);
    },
    repository(commit) {
      return { id: commit._repository_id };
    },
    treeEntries(commit, args) {
      return treeEntries(`tree_hash='${commit._tree_hash}'`, args);
    },
  },

  Blob: {
    treeEntries(blob, args) {
      return treeEntries(`blob_hash='${blob.hash}'`, args);
    },
    repository(blob) {
      return { id: blob._repository_id };
    },
    uastRaw(blob, args) {
      return resolvers.Blob.uast(blob, args);
    },
    uast(blob, args) {
      return mysqlPool.getConnection().then((connection) => {
        let uastArgs = 'blobs.blob_content';

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

        const sql = `SELECT uast(${uastArgs}) as uast FROM blobs WHERE blob_hash='${blob.hash}'`;

        return connection
          .query(sql)
          .then((rows) => {
            // This should be only one row
            if (rows.length > 0) {
              const arr = JSON.parse(rows[0].uast);

              return arr.map((e) => {
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
            }

            return [];
          })
          .catch((e) => {
            logErr(e);
            return [];
          });
      });
    },
  },

  UASTNode: {
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
        .then((blobsArr) => {
          if (blobsArr.length > 0) {
            return blobsArr[0];
          }
        });
    },
  },
};


export default resolvers;
