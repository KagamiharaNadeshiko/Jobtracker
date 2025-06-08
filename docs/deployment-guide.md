# JobTracing Deployment Guide

This guide will help you deploy the JobTracing application to a production environment using MongoDB Atlas and App Services.

## Prerequisites

Before deploying, you need:

1. A MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
2. A GitHub account for CI/CD integration

## Step 1: Set Up MongoDB Atlas

1. Create a new MongoDB Atlas cluster if you don't have one already
   - Sign in to MongoDB Atlas at https://cloud.mongodb.com
   - Create a new project if necessary
   - Deploy a new cluster (the free tier is sufficient for testing)

2. Configure network access:
   - Go to Network Access in Atlas
   - Add your IP address or set to allow access from anywhere for testing

3. Create a database user:
   - Go to Database Access
   - Add a new user with read/write permissions

4. Get your connection string:
   - Go to Clusters
   - Click "Connect"
   - Select "Connect your application"
   - Copy the connection string

## Step 2: Set Up MongoDB Atlas App Services

1. Go to App Services in your Atlas dashboard
2. Create a new App Services app
3. Note down your Realm App ID (you'll need this later)
4. Configure authentication:
   - Go to Authentication
   - Enable API Key and Email/Password authentication
   - Configure the reset password function

5. Configure functions:
   - Upload the functions from the `app_config/functions` directory
   - Set up sync rules from the `app_config/sync` directory

6. Create API keys:
   - Go to API Keys in Atlas
   - Create new keys with Project Owner permissions
   - Note down your public and private keys

## Step 3: Configure Environment Variables

1. Run the setup script to create your .env file:
   ```
   npm run setup-env
   ```

2. Enter your MongoDB connection string, Realm App ID, and API keys when prompted.

3. For production deployment, set the environment variables in your hosting provider:
   - MONGO_URI: Your MongoDB Atlas connection string
   - JWT_SECRET: A secure random string for JWT signing
   - REALM_APP_ID: Your MongoDB Realm App ID
   - ATLAS_API_PUBLIC_KEY: Your Atlas API public key
   - ATLAS_API_PRIVATE_KEY: Your Atlas API private key
   - NODE_ENV: Set to "production"
   - PORT: Usually 80 or as specified by your hosting provider

## Step 4: Set Up GitHub Actions

1. Fork the JobTracing repository to your GitHub account
2. Go to your repository Settings > Secrets
3. Add the following secrets:
   - MONGO_URI
   - JWT_SECRET
   - REALM_APP_ID
   - ATLAS_API_PUBLIC_KEY
   - ATLAS_API_PRIVATE_KEY

4. Push to the main branch to trigger your first deployment

## Step 5: Deploy to a Hosting Provider

### Option 1: Heroku

1. Create a new app on Heroku
2. Connect your GitHub repository to Heroku
3. Configure environment variables in Heroku settings
4. Enable automatic deployments

### Option 2: Vercel

1. Import your GitHub repository to Vercel
2. Configure environment variables in Vercel settings
3. Deploy with the default settings

### Option 3: AWS/Azure/GCP

Follow the respective cloud provider's documentation for deploying Node.js applications.

## Step 6: Verify Deployment

1. Visit your deployed application URL
2. Register a new account
3. Test creating industries, companies, and positions
4. Verify that data is being stored in your MongoDB Atlas cluster

## Troubleshooting

If you encounter issues during deployment:

1. Check your MongoDB Atlas connection string and network access settings
2. Verify that all environment variables are correctly set
3. Look at the logs in your hosting provider's dashboard
4. Check the GitHub Actions workflow logs for CI/CD errors

For more help, please open an issue on the GitHub repository. 