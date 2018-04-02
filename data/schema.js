import { makeExecutableSchema } from 'graphql-tools';
import resolvers from "./resolvers";

const typeDefs = `
type Query {
  repository(id: String!): Repository
  allRepositories: [Repository]
}

type Repository {
  id: String!
  refs(name: String): [Ref]!
}

type Ref {
  repository: Repository!
  name: String!
  hash: String!
  commits(authorName: String, authorEmail: String): [Commit]!
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
  # TODO: relation with Ref
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
