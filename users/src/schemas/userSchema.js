const commonResponseFields = `
    success: Boolean!
    message: String!
    errors: [String]
    stack: String
`;

const typeDefs = `
    type Response {
        ${commonResponseFields}
        data: String
    }

    type Query {
        hello: Response
    }
`;

module.exports = typeDefs;
