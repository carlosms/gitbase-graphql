import { makeExecutableSchema } from 'graphql-tools';
import resolvers from "./resolvers";

const typeDefs = `
type Query {
  repository(id: String!): Repository
  allRepositories: [Repository]
}

type Repository {
  id: String!
  refs(name: String, isRemote: Boolean, isTag: Boolean): [Ref]!
  remotes(name: String): [Remote]!
}

type Ref {
  repository: Repository!
  name: String!
  hash: String!
  commits(authorName: String, authorEmail: String): [Commit]!
  isRemote: Boolean!
  isTag: Boolean!
}

type Commit {
  hash: String!
  authorName: String!
  authorEmail: String!
  authorWhen: String!     # TODO: type TIMESTAMP in the DB
  committerName: String!
  committerEmail: String!
  committerWhen: String!   # TODO: type TIMESTAMP in the DB
  message: String!
  treeHash: String
  blobs(hash: String): [Blob]!
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
  hash: String!
  size: Int! # Note: the graphql Int type is int32, but size is int64 in mysql
  content: String! # Note: mysql BLOB type
  treeEntries: [TreeEntry]!
  uast(language: String, xpath: String): [String]! # TODO: consider a JSON scalar type, e.g. https://github.com/taion/graphql-type-json
}

type TreeEntry {
  treeHash: String!
  entryHash: String!
  mode: String!
  name: String!
  language: String!
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
