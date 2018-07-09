[![Build Status](https://travis-ci.org/carlosms/gitbase-graphql.svg)](https://travis-ci.org/carlosms/gitbase-graphql)

# gitbase-graphql

Query Git repositories using [GraphQL](http://graphql.org/), and explore the source code using [Babelfish Universal Abstract Syntax Tree (UAST)](https://doc.bblf.sh/uast/uast-specification.html).
Built on top of [gitbase](https://github.com/src-d/gitbase).

This project is a proof of concept.

![Demo](./docs/demo.gif)

## Usage

First you will need a directory containing some Git repositories:

```bash
mkdir $HOME/repos
cd $HOME/repos
git clone https://github.com/src-d/gitbase.git
git clone https://github.com/src-d/gitbase-playground.git
git clone https://github.com/src-d/engine.git
```

Then use [`docker-compose`](https://docs.docker.com/compose/install/) to automatically run gitbase-graphql, [gitbase](https://github.com/src-d/gitbase) and [bblfshd](https://github.com/bblfsh/bblfshd).

```bash
wget https://raw.githubusercontent.com/carlosms/gitbase-graphql/master/docker-compose.yml
docker-compose pull
GITBASE_GQL_REPOS_FOLDER=$HOME/repos docker-compose up --force-recreate
```

Now go to [http://localhost:3000/graphiql](http://localhost:3000/graphiql) and explore!

## Schema

In the following link you will find the [GraphQL schema definition](./data/schema.js).

### Git Examples

Some queries you can try:

```graphql
{
  allRepositories {
    id
    refs {
      name
      isTag
      isRemote
    }
    remotes{
      name
      fetchUrl
    }
  }
}
```

```graphql
{
  allRepositories {
    id
    refs(name: "HEAD") {
      name
      commits {
        authorName
        message
        hash
      }
    }
  }
}
```

```graphql
{
  allRepositories {
    id
    refs(name: "HEAD") {
      commit {
        jsFiles: files(language: "JavaScript") {
          path
          size
        }
        goFiles: files(language: "Go") {
          path
          size
        }
      }
    }
  }
}
```

### UAST Examples

#### Raw UAST

You can use the raw functionality offered by Babelfish using `uastRaw`. Continue to the [Babelfish documentation](https://doc.bblf.sh/using-babelfish/uast-querying.html) to learn about the available xpath querying.

```graphql
{
  repository(id: "/opt/repos/gitbase-playground") {
    id
    refs(name: "HEAD") {
      commit {
        treeEntries(name: "App.js") {
          name
          blob {
            uastRaw(language: "JavaScript")
          }
        }
      }
    }
  }
}
```

```graphql
{
  repository(id: "/opt/repos/gitbase-playground") {
    id
    refs(name: "HEAD") {
      commit {
        treeEntries(name: "App.js") {
          name
          blob {
            uastRaw(language: "JavaScript", xpath:"//*[@roleNumber and @roleLiteral]")
          }
        }
      }
    }
  }
}
```

#### UAST as a Graph

Using `uast` you can query each tree node with GraphQL, selecting which fields to include in the response.

_Note_: each children level has to be queried explicitly. Although you cannot query all the tree nodes recursively, you can use `childrenRaw` to filter some nodes with GraphQL, and retrieving the complete tree dangling from that node.

```graphql
{
  repository(id: "/opt/repos/gitbase-playground") {
    id
    refs(name: "HEAD") {
      commit {
        treeEntries(language: "JavaScript") {
          name
          blob {
            uast(language: "JavaScript") {
              internal_type
              token
              roles
              children {
                internal_type
                token
                roles
                start_position {
                  offset
                  line
                  col
                }
                end_position {
                  offset
                  line
                  col
                }
                children {
                  internal_type
                  token
                  children {
                    internal_type
                    token
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

The fields `uast` and `children` accept filter arguments, for now limited to exact string matching on `internal_type` or `token`.

Instead of setting a filter for each level of the query, you can use the `flat` argument. This will flatten the tree, so you filter nodes ignoring the tree level they are at.

```graphql
# All the imports done in App.js
{
  repository(id: "/opt/repos/gitbase-playground") {
    id
    refs(name: "HEAD") {
      commit {
        treeEntries(name: "App.js") {
          name
          blob {
            uast(language: "JavaScript", flat: true, internal_type: "ImportDeclaration") {
              children(internal_type: "StringLiteral") {
                token
              }
            }
          }
        }
      }
    }
  }
}
```

```graphql
{
  repository(id: "/opt/repos/gitbase-playground") {
    id
    refs(name: "HEAD") {
      commit {
        treeEntries(name: "App.js") {
          name
          blob {
            uast(language: "JavaScript", flat: true, internal_type: "CallExpression") {
              children(flat: true, internal_type: "Identifier") {
                token
                start_position {
                  offset
                  line
                  col
                }
                end_position {
                  offset
                  line
                  col
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Advanced Usage

### Run from Sources

To run the project from sources execute:

```bash
yarn install
yarn start
```

### Environment Variables

The following environment variables can be set:

| Variable | Default | Description |
| --- | --- | --- |
| `GITBASE_GQL_PORT` | `3000` | Port where the GraphQL server server will listen |
| `GITBASE_GQL_DB_HOST` | `localhost` | Host where the gitbase server is listening |
| `GITBASE_GQL_DB_PORT` | `3306` | Port where the gitbase server is listening |
| `GITBASE_GQL_DB_USER` | `root` | User name used for the gitbase server connection |
| `GITBASE_GQL_DB_PASSWORD` | ` ` | Password used for the gitbase server connection |
