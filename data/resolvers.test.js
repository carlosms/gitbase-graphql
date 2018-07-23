import { graphql } from 'graphql';

import schema from './schema';

const testCases = [
  {
    id: 'allRepositories',
    query: `{
      allRepositories {
        id
      }
    }`,
    variables: {},
    context: {},
  },
  {
    id: 'origin & HEAD',
    query: `{
      allRepositories {
        id
        refs(name: "HEAD") {
          name
        }
        remotes(name: "origin") {
        name
          pushUrl
          fetchUrl
        }
      }
    }`,
    variables: {},
    context: {},
  },
  {
    id: 'repo by id',
    query: `{
      repository(id: "gitbase-graphql") {
        id
      }
    }`,
  },
  {
    id: 'gitbase-graphql 0.0.2 commits',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.2") {
          name
          isTag
          isRemote
          commits {
            hash
            authorName
          }
        }
      }
    }`,
  },
  {
    id: 'gitbase-graphql 0.0.4 commit',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.4") {
          commit {
            hash
            authorName
            authorEmail
            committerName
            committerEmail
            message
          }
        }
      }
    }`,
  },
  {
    id: 'commit.treeEntries with language',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.4") {
          commit {
            treeEntries(name: "Dockerfile") {
              hash
              mode
              name
              language
            }
          }
        }
      }
    }`,
  },
  {
    id: 'commit.blobs.file',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.4") {
          commit {
            blobs(hash: "ffb252de4852456e2c2c7e2c0f1d8eca30ffb195") {
              hash
              size
              content
              file {
                path
                content
              }
            }
          }
        }
      }
    }`,
  },
  {
    id: 'commit, all files',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          commit {
            files {
              path
            }
          }
        }
      }
    }`,
  },
  {
    id: 'commit.files, all fields',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          commit {
            files(path: "server.js") {
              path
              blob {
                hash
                size
              }
              rootTreeHash
              mode
              content
              size
              language
            }
          }
        }
      }
    }`,
  },
  {
    id: 'files.uastRaw',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          name
          isTag
          commit {
            files(path: "server.js") {
              path
              uastRaw(language: "JavaScript")
            }
          }
        }
      }
    }`,
  },
  {
    id: 'files.uast, all fields',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          name
          isTag
          commit {
            files(path: "server.js") {
              path
              uast(language: "JavaScript") {
                internal_type
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
                roles
                children {
                  internal_type
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
                  roles
                  children {
                    internal_type
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
                    roles
                    childrenRaw
                  }
                }
              }
            }
          }
        }
      }
    }`,
  },
  {
    id: 'files.uast flat false',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          name
          isTag
          commit {
            files(path: "server.js") {
              path
              uast(language: "JavaScript", flat: false) {
                internal_type
                token
              }
            }
          }
        }
      }
    }`,
  },
  {
    id: 'files.uast flat true',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          name
          isTag
          commit {
            files(path: "server.js") {
              path
              uast(language: "JavaScript", flat: true) {
                internal_type
                token
              }
            }
          }
        }
      }
    }`,
  },
  {
    id: 'files.uast filter by token',
    query: `{
      repository(id: "gitbase-graphql") {
        id
        refs(name: "refs/tags/v0.0.1") {
          name
          isTag
          commit {
            files(path: "server.js") {
              path
              uast(language: "JavaScript", flat: true, token: "console") {
                internal_type
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
                roles
              }
            }
          }
        }
      }
    }`,
  },
];

beforeAll(() => {
  jest.setTimeout(120000);
});

describe('Integration Test Queries', () => {
  testCases.forEach((obj) => {
    const {
      id, query, variables, context: ctx,
    } = obj;

    test(`query: ${id}`, async () =>
      expect(graphql(schema, query, null, { ctx }, variables)).resolves.toMatchSnapshot());
  });
});
