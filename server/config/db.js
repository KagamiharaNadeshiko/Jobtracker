// 数据库配置
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// 连接到MongoDB数据库
const connectDB = async() => {
    try {
        // 设置默认的本地数据库URI，便于开发和测试
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing';

        // 常规MongoDB连接
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB 连接成功: ${conn.connection.host}`);

        // 如果设置了REALM_APP_ID，则初始化Atlas App Services连接
        if (process.env.REALM_APP_ID) {
            console.log(`MongoDB Atlas App Services 应用ID: ${process.env.REALM_APP_ID}`);
        }

        return conn;
    } catch (err) {
        console.error(`MongoDB 连接错误: ${err.message}`);

        // 如果是DNS解析错误，提供更明确的错误信息
        if (err.code === 'ENOTFOUND') {
            console.error('无法解析MongoDB服务器地址，请检查连接字符串或网络连接');
        }

        // 在开发环境下，如果无法连接到Atlas，尝试连接本地MongoDB
        if (process.env.NODE_ENV === 'development' && err.message.includes('Atlas')) {
            console.log('尝试连接本地MongoDB实例...');
            try {
                const localConn = await mongoose.connect('mongodb://localhost:27017/jobtracing', {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log(`已连接到本地MongoDB: ${localConn.connection.host}`);
                return localConn;
            } catch (localErr) {
                console.error(`无法连接到本地MongoDB: ${localErr.message}`);
                process.exit(1);
            }
        } else {
            // 如果无法连接到数据库，则终止进程
            process.exit(1);
        }
    }
};

module.exports = connectDB;