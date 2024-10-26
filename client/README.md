
# Client - Next.js Authentication System

The frontend of the authentication system built with Next.js, TailwindCSS, and TypeScript, handling user registration, login, email verification, and profile management.


## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
## Prerequisites

- Node.js v18+
- Docker (for development using Docker Compose)
## Installation

1. **Install dependencies:**  
   Navigate to the client directory and install the dependencies.  
    ```bash
    cd client
    npm install
    ```

2. **Set up environment variables:**  
   Copy the sample environment variables file to create your own.  
    ```bash
    cp .env.sample .env
    ```

3. **Start the Next.js development server:**  
   Run the following command to start the server.  
    ```bash
    npm run dev
    ```

## Usage

Access the client at http://localhost:3000/user/login. It includes registration, login, password reset, and profile pages.

## Project Structure

```bash
src/  
 ├── api                # API interactions with backend  
 ├── app                # App routes and pages  
 ├── components         # Reusable UI components  
 ├── hooks              # Custom hooks (e.g., useBanner)  
 ├── interfaces         # TypeScript interfaces and types  
 ├── utils              # Utility functions  
.env.sample             # Environment variable template  
Dockerfile  
package.json  
```
## Error Handling

Errors display to the user via banners (e.g., form validation errors or network errors), utilizing the `useBanner` hook.

## Tech Stack

- **Next.js**: Server-rendered React framework
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Static typing for enhanced code quality


## Screenshots

