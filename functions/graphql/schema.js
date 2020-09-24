const graphqlTools = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
input FolderCreateInput {
  name: String
}
input FolderInput {
  id: String!
  name: String
}
input FolderDeleteInput {
  id: String!
}
type Folder {
  id: String!
  name: String
}
type Query {
  folders: [Folder]
}
type Mutation {
  createFolder(input: FolderCreateInput!): Folder
  updateFolder(input: FolderInput): Folder
  deleteFolder(input: FolderDeleteInput): Folder
}
`;
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
