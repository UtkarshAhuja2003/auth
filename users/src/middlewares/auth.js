const jwt = require("jsonwebtoken");
const { GraphQLResponse } = require("../utils/GraphQLResponse");
const User = require("../models/user");

/**
 * Middleware to verify JWT token in GraphQL context.
 * @param {Object} context - GraphQL context object
 * @returns {Promise<GraphQLResponse>} - GraphQLResponse object
 */
const verifyJWT = async (context) => {
    let token;
    if (!context.req.headers && !context.token) {
      return new GraphQLResponse(null, false, "Unauthorized request", ["Token missing"], new Error().stack);
    }
    else if(context.req.headers) {
      token = context.req.headers.authorization?.replace("Bearer ", "");
    }
    else {
      token = context.token;
    }
    
    if (!token) {
      return new GraphQLResponse(null, false, "Unauthorized request", ["Token missing"], new Error().stack);
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id);
  
      if (!user) {
        return new GraphQLResponse(null, false, "Invalid access token", ["User not found"], new Error().stack);
      }
      
      context.user = user;
      return new GraphQLResponse(user, true, "User authenticated successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, "Invalid access token", ["User not found"], new Error().stack);
    }
};

module.exports = verifyJWT;