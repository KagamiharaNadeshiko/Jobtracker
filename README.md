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

## Quick Start

### Prerequisites
- Node.js 14.x or later
- MongoDB Atlas account (for database)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/jobtracing.git
cd jobtracing
```

2. Install server dependencies
```bash
npm install
```

3. Install client dependencies
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jobtracing?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# MongoDB Atlas App Services
REALM_APP_ID=your_realm_app_id_here

# MongoDB Atlas API Keys
ATLAS_API_PUBLIC_KEY=your_atlas_public_key_here
ATLAS_API_PRIVATE_KEY=your_atlas_private_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

5. Start the development server
```bash
npm run dev
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and configure network access
3. Get your connection string and update the `.env` file

## MongoDB Atlas App Services

The project uses MongoDB Atlas App Services for:
- Authentication providers (API Key and Email/Password)
- Backend functions for dashboard statistics and password reset
- Data synchronization rules for security

### Configuration
1. Create an App Services app in MongoDB Atlas
2. Upload the configuration files from the `app_config` directory
3. Configure authentication providers from `app_config/auth/providers.json`
4. Set up sync rules from `app_config/sync/config.json`
5. Deploy backend functions from `app_config/functions/*`

## Remote Deployment

Deployment is handled automatically through GitHub Actions when changes are pushed to the main branch:

1. Add the required secrets to your GitHub repository:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Secret for JWT token generation
   - `REALM_APP_ID` - Atlas App Services application ID
   - `ATLAS_API_PUBLIC_KEY` - MongoDB Atlas public key
   - `ATLAS_API_PRIVATE_KEY` - MongoDB Atlas private key

2. Push to the main branch to trigger deployment

For detailed deployment instructions, see the [Deployment Guide](docs/deployment-guide.md).

## Development

- Backend API is available at http://localhost:5000
- Frontend React application is available at http://localhost:3000 

## Testing

Run tests with:
```bash
npm test
```

## License

MIT 