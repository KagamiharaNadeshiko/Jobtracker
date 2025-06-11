module.exports = {
    development: {
        username: 'youruser',
        password: 'yourpass',
        database: 'jobtracker',
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
    },
    test: {
        username: 'youruser',
        password: 'yourpass',
        database: 'jobtracker_test',
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: false,
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};