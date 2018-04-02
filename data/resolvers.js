import mysql from "./connectors";

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
    refs(repository, args) {
      return mysql.then(connection => {
        let sql = `SELECT name, hash FROM refs WHERE repository_id='${repository.id}'`;
        if (args.name) {
          sql += ` AND name='${args.name}'`;
        }

        return connection.query(sql).then(rows => {
          return rows.map(r => {
            return {
              name: r.name,
              hash: r.hash,
              repository_id: repository.id
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

        if (args.authorName){
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
            })
          }).catch(function(e) {
              return [];
            });;
      });
    }
  }
};

export default resolvers;
