const { ApolloServer } = require("@apollo/server");
const typeDefs = require("./schemas/userSchema");
const { registerUser, loginUser, getCurrentUser, verifyEmail, resendVerificationEmail, logoutUser,forgotPasswordRequest, resetForgottenPassword, refreshAccessToken } = require("./resolvers/user");
const { updateProfile, updatePassword } = require("./resolvers/profile");

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
        verifyEmail,
        resendVerificationEmail,
        logoutUser,
        forgotPasswordRequest,
        resetForgottenPassword,
        refreshAccessToken,
        updateProfile,
        updatePassword
      },
    },
  });
  
  await server.start();
  return server;
};

module.exports = createApolloServer;
