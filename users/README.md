
# Users Microservice - User Management and Authentication

The backend microservice handling user authentication, email verification, and profile management using Node.js, GraphQL, JWT, and MongoDB.


## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
## Prerequisites

- Node.js v18+
- Docker (for development using Docker Compose)
## Installation

1. **Install dependencies:**  
   Navigate to the users directory and install the dependencies.  
   ```bash
   cd users 
   npm install
   ```

2. **Create environment variables:**  
   Copy the sample environment variables file to create your own.  
   ```bash
   cp .env.sample .env
   ```

3. **Start the server:**  
   Run the following command to start the server.  
   ```bash
   npm run dev
   ```

## Usage

Access the API at http://localhost:8000/user with GraphQL playground enabled.
## Project Structure
```bash
src/  
 ├── config             # Configuration files (e.g., MongoDB connection)  
 ├── middlewares        # Authentication and validation middlewares  
 ├── models             # MongoDB models  
 ├── resolvers          # GraphQL resolvers  
 ├── schemas            # GraphQL schemas  
 ├── utils              # Helper functions (e.g., JWT and hashing)  
 ├── validators         # Input validation logic  
.env.sample             # Environment variable template  
Dockerfile  
package.json  
```
## Error Handling

Errors are handled via GraphQL error responses, using custom messages and error codes where applicable.

## Tech Stack

- **Node.js & Express**: Server framework
- **GraphQL**: API query language
- **JWT**: Authentication and session management
- **MongoDB**: NoSQL database

## API Reference

### Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Authenticate user and return tokens.
- **GET /profile**: Fetch user profile.
- **POST /verify-email**: Verify user email.
- **POST /reset-password**: Initiate password reset.

### GraphQL Schema Overview

```bash
type User {  
  _id: ID!  
  name: String!  
  email: String!  
  emailVerified: Boolean!  
}  

type Query {  
  user(id: ID!): User  
}  

type Mutation {  
  registerUser(input: RegisterInput): AuthPayload  
  loginUser(input: LoginInput): AuthPayload  
  verifyEmail(token: String!): Boolean  
  resetPassword(input: ResetPasswordInput): Boolean  
}
```
