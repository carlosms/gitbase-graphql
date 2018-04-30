import mysql from "./connectors";

const PROTO_PATH = __dirname + "/../proto/generated.proto";

const grpc = require("grpc");
const bblfshUAST = grpc.load(PROTO_PATH).gopkg.in.bblfsh.sdk.v1.uast;


function logErr(e) {
  if (e.sqlMessage) {
    console.debug(`Failure. Query: ${e.sql}; error message: ${e.sqlMessage}`);
  } else {
    console.debug(e);
  }
}

const resolvers = {
  Query: {
    repository(root, args) {
      return mysql.then(connection => {
        return connection
          .query(`SELECT id FROM repositories WHERE id='${args.id}'`)
          .then(rows => {
            return { id: rows[0].id };
          });
      });
    },

    allRepositories() {
      return mysql.then(connection => {
        return connection.query(`SELECT id FROM repositories`).then(rows => {
          return rows.map(r => {
            return { id: r.id };
          });
        });
      });
    }
  },

  Repository: {
    refs(repository, args, context, info) {
      return mysql.then(connection => {
        let sql = `
        SELECT name, hash,
        is_remote(name) AS is_remote,
        is_tag(name) AS is_tag
        FROM refs WHERE repository_id='${repository.id}'`;

        if (args.name !== undefined) {
          sql += ` AND name='${args.name}'`;
        }
        if (args.isRemote !== undefined) {
          sql += ` AND is_remote(name)=${args.isRemote}`;
        }
        if (args.isTag !== undefined) {
          sql += ` AND is_tag(name)=${args.isTag}`;
        }

        return connection.query(sql).then(rows => {
          return rows.map(r => {
            return {
              name: r.name,
              hash: r.hash,
              repository_id: repository.id,
              isRemote: r.is_remote.toString() === "1", // type Buffer
              isTag: r.is_tag.toString() === "1" // type Buffer
            };
          });
        });
      });
    },
    remotes(repository, args, context, info) {
      return mysql.then(connection => {
        let sql = `
        SELECT name, push_url, fetch_url, push_refspec, fetch_refspec
        FROM remotes WHERE repository_id='${repository.id}'`;

        if (args.name !== undefined) {
          sql += ` AND name='${args.name}'`;
        }

        return connection.query(sql).then(rows => {
          return rows.map(r => {
            return {
              repository_id: repository.id,
              name: r.name,
              pushUrl: r.push_url,
              fetchUrl: r.fetch_url,
              pushRefspec: r.push_refspec,
              fetchRefspec: r.fetch_refspec
            };
          });
        });
      });
    }
  },

  Ref: {
    repository(ref) {
      return { id: ref.repository_id };
    },
    commits(ref, args) {
      return mysql.then(connection => {
        let sql = `SELECT * FROM commits WHERE hash='${ref.hash}'`;

        if (args.authorName) {
          sql += ` AND author_name='${args.authorName}'`;
        }

        if (args.authorEmail) {
          sql += ` AND author_email='${args.authorEmail}'`;
        }

        return connection
          .query(sql)
          .then(rows => {
            return rows.map(r => {
              return {
                hash: r.hash,
                authorName: r.author_name,
                authorEmail: r.author_email,
                authorWhen: r.author_when,
                committerName: r.committer_name,
                committerEmail: r.committer_email,
                committerWhen: r.committer_when,
                message: r.message,
                treeHash: r.tree_hash
              };
            });
          })
          .catch(function(e) {
            logErr(e);
            return [];
          });
      });
    }
  },

  Remote: {
    repository(remote) {
      return { id: remote.repository_id };
    }
  },

  Commit: {
    blobs(commit, args) {
      return mysql.then(connection => {
        let sql = `SELECT * FROM blobs WHERE commit_has_blob('${commit.hash}', hash)`;

        if (args.hash) {
          sql += ` AND hash='${args.hash}'`;
        }

        return connection
          .query(sql)
          .then(rows => {
            return rows.map(r => {
              return {
                hash: r.hash,
                size: r.size,
                content: r.content
              };
            });
          })
          .catch(function(e) {
            logErr(e);
            return [];
          });
      });
    }
  },

  Blob: {
    treeEntries(blob) {
      return mysql.then(connection => {
        let sql = `SELECT
        tree_hash, entry_hash, mode, name, language(name) AS language
        FROM tree_entries
        WHERE entry_hash='${blob.hash}'`;

        return connection
          .query(sql)
          .then(rows => {
            return rows.map(r => {
              return {
                treeHash: r.tree_hash,
                entryHash: r.entry_hash,
                mode: r.mode,
                name: r.name,
                language: r.language
              };
            });
          })
          .catch(function(e) {
            logErr(e);
            return [];
          });
      });
    },
    uast(blob, args) {
      return mysql.then(connection => {
        let uastArgs = `blobs.content`;

        if (args.language || args.xpath) {
          if (args.language) {
            uastArgs += `, '${args.language}'`
          } else {
            uastArgs += `, ''`
          }
        }
        if (args.xpath) {
          uastArgs += `, '${args.xpath}'`;
        }

        let sql = `SELECT uast(${uastArgs}) as uast FROM blobs WHERE hash='${blob.hash}'`;

        return connection
          .query(sql)
          .then(rows => {
            // This should be only one row
            if (rows.length > 0) {
              const arr = JSON.parse(rows[0].uast);

              return arr.map(e => {
                const decoded = bblfshUAST.Node.decode(e);

                // graphql-type-json will try to stringify, and it will fail
                // because of circular references

                const st = JSON.stringify(decoded, function(key, value) {
                  // skip properties, it contains circular references (builder, parent)
                  if (key === "properties") {
                    return;
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
          .catch(function(e) {
            logErr(e);
            return [];
          });
      });
    }
  }
};

export default resolvers;
