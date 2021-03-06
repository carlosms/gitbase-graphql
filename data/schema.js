import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
scalar JSON

type Query {
  repository(
    """
    The path to the repository folder.
    In case of [siva files](https://github.com/src-d/go-siva/), the id is the path + the siva file name.
    """
    id: String!): Repository
  allRepositories: [Repository]
}

type Repository {
  """
  The path to the repository folder.
  In case of [siva files](https://github.com/src-d/go-siva/), the id is the path + the siva file name.
  """
  id: String!
  refs(name: String, isRemote: Boolean, isTag: Boolean): [Ref]!
  remotes(name: String): [Remote]!
}

type Ref {
  repository: Repository!
  name: String!
  commit: Commit!
  commits(authorName: String, authorEmail: String): [Commit]!
  isRemote: Boolean!
  isTag: Boolean!
}

type Commit {
  repository: Repository!
  hash: String!
  authorName: String!
  authorEmail: String!
  authorWhen: String!     # TODO: type TIMESTAMP in the DB
  committerName: String!
  committerEmail: String!
  committerWhen: String!   # TODO: type TIMESTAMP in the DB
  message: String!
  treeEntries(name: String, language: String): [TreeEntry]!
  blobs(hash: String): [Blob]!
  files(path: String, language: String): [File]!
  # TODO: relation with Ref
}

type Remote {
  repository: Repository!
  name: String!
  pushUrl: String!
  fetchUrl: String!
  pushRefspec: String!
  fetchRefspec: String!
}

type Blob {
  repository: Repository!
  hash: String!
  size: Int! # Note: the graphql Int type is int32, but size is int64 in mysql
  content: String! # Note: mysql BLOB type
  treeEntries(name: String, language: String): [TreeEntry]!
  file: File!

  """
  Babelfish UAST Node with fields that you can query.
  Each children level has to be queried explicitly.
  """
  uast(
    language: String!,
    internal_type: String,
    token: String,
    """
    **EXPERIMENTAL**

    A string with JS code. 'node' and 'result' are global variables.

    e.g. "result = node.token.length > 15;"
    """
    filter_func: String,
    """
    Flatten the tree allowing you filter nodes ignoring the tree level they are at.
    """
    flat: Boolean): [UASTNode]!

  """
  Babelfish UAST Node, complete JSON
  """
  uastRaw(language: String!, xpath: String): [JSON]!
}

type TreeEntry {
  repository: Repository!
  hash: String!
  mode: String!
  name: String!
  language: String!
  blob: Blob
}

type File {
  repository: Repository!
  path: String!
  blob: Blob!
  rootTreeHash: String!
  mode: String!
  content: String! # Note: mysql BLOB type
  size: Int! # Note: the graphql Int type is int32, but size is int64 in mysql
  language: String!

  """
  Babelfish UAST Node with fields that you can query.
  Each children level has to be queried explicitly.
  """
  uast(
    language: String!,
    internal_type: String,
    token: String,
    """
    **EXPERIMENTAL**

    A string with JS code. 'node' and 'result' are global variables.

    e.g. "result = node.token.length > 15;"
    """
    filter_func: String,
    """
    Flatten the tree allowing you filter nodes ignoring the tree level they are at.
    """
    flat: Boolean): [UASTNode]!

  """
  Babelfish UAST Node, complete JSON
  """
  uastRaw(language: String!, xpath: String): [JSON]!
}

type UASTNode {
  internal_type: String

  # Properties map[string]string
  # properties: JSON

  """
  Babelfish UAST Nodes with fields that you can query.
  Each children level has to be queried explicitly.
  """
  children(
    internal_type: String,
    token: String,
    """
    **EXPERIMENTAL**

    A string with JS code. 'node' and 'result' are global variables.

    e.g. "result = node.token.length > 15;"
    """
    filter_func: String,
    """
    Flatten the tree allowing you filter nodes ignoring the tree level they are at.
    """
    flat: Boolean): [UASTNode]!

  """
  Babelfish UAST Nodes, complete JSON
  """
  childrenRaw: [JSON]!
  token: String
  start_position: UASTPosition
  end_position: UASTPosition

  # TODO: can be transformed to string https://godoc.org/github.com/bblfsh/sdk/uast#Role
  roles: [Int]
}

type UASTPosition {
  offset: Int
  line: Int
  col: Int
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { typeDefs };
export default schema;
