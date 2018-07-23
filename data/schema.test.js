import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mockServer,
} from 'graphql-tools';
import { graphql } from 'graphql';

import { typeDefs } from './schema';

const testCases = [
  {
    id: 'allRepositories',
    query: `{
      allRepositories {
        id
        refs {
          name
          isTag
          commit {
            hash
            authorName
            authorWhen
            files {
              path
              size
              language
              uast(language: "Java") {
                internal_type
                token
                roles
              }
            }
          }
        }
        remotes {
          name
        }
      }
    }`,
    variables: {},
    context: {},
  },
];

describe('Schema', () => {
  const mockSchema = makeExecutableSchema({ typeDefs });

  // Here we specify the return payloads of mocked types
  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: {
      Boolean: () => false,
      ID: () => '1',
      Int: () => 1,
      Float: () => 1.5,
      String: () => 'abcde',
    },
  });

  test('has valid type definitions', async () => {
    expect(() => {
      const MockServer = mockServer(typeDefs);

      MockServer.query('{ __schema { types { name } } }');
    }).not.toThrow();
  });

  testCases.forEach((obj) => {
    const {
      id, query, variables, context: ctx,
    } = obj;

    test(`query: ${id}`, () =>
      expect(graphql(mockSchema, query, null, { ctx }, variables)).resolves.toMatchSnapshot());
  });
});
