# JobTracing Quick Start Guide

This guide will help you get started with the JobTracing application for development.

## Prerequisites

- Node.js 14.x or later
- MongoDB Atlas account (for database)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobtracing.git
cd jobtracing
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

4. Set up environment variables:
```bash
npm run setup-env
```
Follow the prompts to enter your MongoDB Atlas connection string and other required information.

## Development

1. Start the development server:
```bash
npm run dev
```
This will start both the backend server and frontend React application.

- Backend API will be available at http://localhost:5000
- Frontend will be available at http://localhost:3000

2. Create a test account by registering in the application.

## Project Structure

- `/server` - Express.js backend
  - `/config` - Configuration files
  - `/middleware` - Express middleware
  - `/models` - MongoDB models
  - `/routes` - API routes

- `/client` - React frontend
  - `/public` - Static assets
  - `/src` - React components and logic
    - `/components` - Reusable components
    - `/context` - React context providers
    - `/hooks` - Custom React hooks
    - `/pages` - Page components
    - `/utils` - Utility functions

- `/app_config` - MongoDB Atlas App Services configuration
  - `/auth` - Authentication providers
  - `/functions` - Backend functions
  - `/sync` - Data sync rules

## Development Workflow

1. Make changes to the backend:
   - Update models in `/server/models/`
   - Add routes in `/server/routes/`
   - Test API endpoints using Postman or similar tool

2. Make changes to the frontend:
   - Update pages in `/client/src/pages/`
   - Add components to `/client/src/components/`
   - Use context API for state management

3. Use the Git Feature Branch Workflow:
   - Create a branch for each feature: `git checkout -b feature-name`
   - Make changes and commit: `git commit -am "Description of changes"`
   - Push to your fork: `git push origin feature-name`
   - Create a pull request to the main repository

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

Build the React frontend for production:
```bash
cd client
npm run build
cd ..
```

Start the production server:
```bash
npm start
```

For full deployment instructions, see [Deployment Guide](deployment-guide.md). 