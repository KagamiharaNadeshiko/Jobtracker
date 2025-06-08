# JobTracing

A job application tracking system built with the MERN stack (MongoDB, Express, React, Node.js) and MongoDB Atlas App Services.

## Project Overview

JobTracing helps users track their job applications, including:
- Industries
- Companies
- Positions
- Application essays
- Online tests
- Interviews

## Remote Development Environment

This project is designed for remote development and deployment:
- MongoDB Atlas for database
- Atlas App Services for backend functions and hosting
- GitHub Actions for CI/CD

## Environment Variables

The following environment variables are required:
- `MONGO_URI` - MongoDB Atlas connection string
- `REALM_APP_ID` - Atlas App Services application ID
- `JWT_SECRET` - Secret for JWT token generation
- `ATLAS_API_PUBLIC_KEY` - MongoDB Atlas public key
- `ATLAS_API_PRIVATE_KEY` - MongoDB Atlas private key

## Installation

1. Clone the repository
2. Install server dependencies: `npm install`
3. Install client dependencies: `cd client && npm install`
4. Create a `.env` file with the required environment variables
5. Run the development server: `npm run dev`

## Deployment

Deployment is handled automatically through GitHub Actions when changes are pushed to the main branch.

## License

MIT 