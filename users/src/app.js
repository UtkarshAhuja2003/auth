const express = require("express");
const { connectDB } = require("./config/db");
const createApolloServer = require("./apollo");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");

const app = express();
app.use(express.json());
connectDB();

const startServer = async () => {
  const server = await createApolloServer();
  app.use("/user",
    cors({ origin: "http://localhost:3000", credentials: true }),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res })
    })
  );
}

startServer();

module.exports = app;
