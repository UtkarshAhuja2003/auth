const { ApolloServer } = require("@apollo/server");
const typeDefs = require("./schemas/userSchema");
const { registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken } = require("./resolvers/user");

const createApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        getCurrentUser,
      },
      Mutation: {
        registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken
      },
    },
  });
  
  await server.start();
  return server;
};

module.exports = createApolloServer;
