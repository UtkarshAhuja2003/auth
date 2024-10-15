const { ApolloServer } = require("@apollo/server");

const typeDefs = `
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  }
};

const createApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  await server.start();
  return server;
};

module.exports = createApolloServer;
