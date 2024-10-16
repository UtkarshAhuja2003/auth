const commonResponseFields = `
    success: Boolean
    message: String
    errors: [String]
    stack: String
`;

const typeDefs = `
    type User {
        _id: ID
        email: String
        name: String
    }

    type UserResponse {
        ${commonResponseFields}
        data: User
    }
    
    type MessageResponse {
        ${commonResponseFields}
    }

    input RegisterInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }
    
    input RefreshTokenInput {
        incomingRefreshToken: String!
    }
    
    type Query {
        getCurrentUser: UserResponse!
    }

    type Mutation {
        registerUser(input: RegisterInput!): UserResponse!
        loginUser(input: LoginInput!): UserResponse!
        logoutUser: MessageResponse!
        refreshAccessToken(input: RefreshTokenInput!): MessageResponse!
    }
`;

module.exports = typeDefs;
