import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
scalar JSON

type Query {
  repository(id: String!): Repository
  allRepositories: [Repository]
}

type Repository {
  id: String!
  refs(name: String, isRemote: Boolean, isTag: Boolean): [Ref]!
  remotes(name: String): [Remote]!
  commits(authorName: String, authorEmail: String): [Commit]!
  blobs(hash: String): [Blob]!
  treeEntries(name: String, language: String): [TreeEntry]!
}

type Ref {
  repository: Repository!
  name: String!
  commit: Commit!
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
  uast(language: String, xpath: String): [JSON]!
}

type TreeEntry {
  repository: Repository!
  hash: String!
  mode: String!
  name: String!
  language: String!
  blob: Blob!
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
