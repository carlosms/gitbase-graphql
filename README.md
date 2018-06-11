[![Build Status](https://travis-ci.org/carlosms/gitbase-graphql.svg)](https://travis-ci.org/carlosms/gitbase-graphql)

# gitbase-graphql

Query Git repositories using [GraphQL](http://graphql.org/). Built on top of [gitbase](https://github.com/src-d/gitbase).

This project is a proof of concept.

![Demo](./docs/demo.gif)

## Usage

First you will need a directory containing some Git repositories:

```bash
mkdir $HOME/repos
cd $HOME/repos
git clone https://github.com/src-d/gitbase.git
git clone https://github.com/src-d/engine.git
git clone https://github.com/src-d/ml.git
```

Then use [`docker-compose`](https://docs.docker.com/compose/install/) to automatically run gitbase-graphql, [gitbase](https://github.com/src-d/gitbase) and [bblfshd](https://github.com/bblfsh/bblfshd).

```bash
wget https://raw.githubusercontent.com/carlosms/gitbase-graphql/master/docker-compose.yml
docker-compose pull
GITBASE_GQL_REPOS_FOLDER=$HOME/repos docker-compose up --force-recreate
```

Now go to [http://localhost:3000/graphiql](http://localhost:3000/graphiql) and explore!

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
| `GITBASE_GQL_DB_USER` | `gitbase` | User name used for the gitbase server connection |
| `GITBASE_GQL_DB_PASSWORD` | ` ` | Password used for the gitbase server connection |

## Schema

In the following link you will find the [GraphQL schema definition](./data/schema.js).

### Examples

Some queries you can try:


```
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

```
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

```
{
  allRepositories {
    id
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
```


```
{
  allRepositories {
    id
    files(language: "Go") {
      path
      size
      blob {
        content
        uastRaw(language: "Go")
      }
    }
  }
}
```
```
{
  allRepositories {
    id
    files(language: "Go") {
      path
      size
      blob {
        content
        uast(language: "Go") {
          internal_type
          token
          roles
          children {
            internal_type
            token
            roles
            children {
              internal_type
              token
              roles
              children {
                internal_type
                token
                roles
              }
            }
          }
        }
      }
    }
  }
}
```