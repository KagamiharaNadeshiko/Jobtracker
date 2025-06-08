const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Environment variables template
const envTemplate = `# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jobtracing?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=
JWT_EXPIRE=24h

# MongoDB Atlas App Services
REALM_APP_ID=

# MongoDB Atlas API Keys
ATLAS_API_PUBLIC_KEY=
ATLAS_API_PRIVATE_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development
`;

console.log('JobTracing Environment Setup');
console.log('============================');
console.log('This script will help you set up your environment variables.');
console.log('You will need the following information:');
console.log('1. MongoDB Atlas connection string');
console.log('2. MongoDB Atlas App Services application ID');
console.log('3. MongoDB Atlas API keys');
console.log('');

// Check if .env already exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    console.log('A .env file already exists. Do you want to overwrite it? (y/n)');
    rl.question('> ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Setup cancelled. Your .env file was not modified.');
            rl.close();
            return;
        }
        createEnvFile();
    });
} else {
    createEnvFile();
}

function createEnvFile() {
    let envContent = envTemplate;

    rl.question('MongoDB Atlas connection string: ', (mongoUri) => {
        envContent = envContent.replace('mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jobtracing?retryWrites=true&w=majority', mongoUri || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jobtracing?retryWrites=true&w=majority');

        rl.question('JWT Secret (leave blank for a generated one): ', (jwtSecret) => {
            const generatedSecret = jwtSecret || require('crypto').randomBytes(32).toString('hex');
            envContent = envContent.replace('JWT_SECRET=', `JWT_SECRET=${generatedSecret}`);

            rl.question('MongoDB Atlas App Services ID: ', (realmAppId) => {
                envContent = envContent.replace('REALM_APP_ID=', `REALM_APP_ID=${realmAppId}`);

                rl.question('MongoDB Atlas API Public Key: ', (publicKey) => {
                    envContent = envContent.replace('ATLAS_API_PUBLIC_KEY=', `ATLAS_API_PUBLIC_KEY=${publicKey}`);

                    rl.question('MongoDB Atlas API Private Key: ', (privateKey) => {
                        envContent = envContent.replace('ATLAS_API_PRIVATE_KEY=', `ATLAS_API_PRIVATE_KEY=${privateKey}`);

                        // Write the .env file
                        fs.writeFileSync(envPath, envContent);
                        console.log('.env file created successfully!');
                        console.log('You can now run "npm run dev" to start the application.');
                        rl.close();
                    });
                });
            });
        });
    });
}