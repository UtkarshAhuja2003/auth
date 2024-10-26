# Auth System

A scalable authentication system using Next.js, Nodejs, TypeScript, GraphQL, JWT, MongoDB, and Docker, complete with email verification, password reset, and CI/CD integration.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/new/?autostart=false#https://github.com/UtkarshAhuja2003/auth)

![example workflow](https://github.com/UtkarshAhuja2003/auth/actions/workflows/docker-image.yml/badge.svg)
[![License](https://img.shields.io/github/license/UtkarshAhuja2003/auth)](LICENSE)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Key Dependencies](#key-dependencies)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
## Features

- **User Registration**: Register new users with email verification.
- **Login**: Secure login process with JWT.
- **Forgot Password**: Recover access to account if user they forget their password.
- **Email Verification**: Verify user email addresses during registration to enhance security and prevent fake accounts.
- **Profile Management**: Enable users to view and update their profile information.
- **Password Reset**: Allow users to easily reset their passwords.
- **JWT Authentication**: Use JSON Web Tokens for secure authentication, including support for access and refresh tokens.


## Prerequisites

- [Docker](https://www.docker.com/)
- Node.js v18+
- Git
## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/UtkarshAhuja2003/auth.git
   cd auth
   ```

2. Create environment files:  
   ```bash
   cp client/.env.sample client/.env
   cp users/.env.sample users/.env
    ```

3. Start the services using Docker Compose:  
   ```bash
   docker-compose up --build -d
   ```

## Usage

After starting, navigate to http://localhost/user/register to access the client. APIs are accessible at http://localhost/users for the users microservice.

For local development, refer to the individual READMEs in each service directory:

- [Client README](./client/README.md) - Next.js frontend setup and usage instructions.
- [Users Service README](./users/README.md) - Backend API setup and documentation for user management.

Each README provides step-by-step instructions for environment configuration, running the service locally, and troubleshooting common issues.

## Project Structure

   ```bash
   auth/
    ├── .github/workflows     # GitHub Actions CI/CD
    ├── client                # Next.js client with authentication flows
    ├── proxy                 # Nginx reverse proxy configurations
    ├── users                 # Backend microservice for user management
    ├── docker-compose.yml
    ├── gitpod.yml
    ├── LICENSE
    └── README.md
   ```
## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Node.js, GraphQL, JWT, MongoDB
- **Infrastructure**: Docker, Docker Compose, Nginx
- **CI/CD**: GitHub Actions


## Key Dependencies

- `next`, `react`
- `express`, `graphql`, `@apollo/server`, `jsonwebtoken`
- `mongoose`, `bcrypt`, `nodemailer`
## Screenshots



## Contributing

1. **Fork the repository**  
2. **Create your branch:**  
   `git checkout -b feature/YourFeature`
3. **Commit your changes:**  
   `git commit -m 'Add YourFeature'`
4. **Push to the branch:**  
   `git push origin feature/YourFeature`
5. **Open a pull request**


## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.


