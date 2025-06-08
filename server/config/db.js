// 数据库配置
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// 连接到MongoDB数据库
const connectDB = async() => {
    try {
        // 常规MongoDB连接
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB 连接成功: ${conn.connection.host}`);

        // 如果设置了REALM_APP_ID，则初始化Atlas App Services连接
        if (process.env.REALM_APP_ID) {
            console.log(`MongoDB Atlas App Services 应用ID: ${process.env.REALM_APP_ID}`);

            // 可以在这里添加Atlas App Services的初始化代码
            // 例如使用Realm Web SDK等
        }
    } catch (err) {
        console.error(`MongoDB 连接错误: ${err.message}`);
        // 如果无法连接到数据库，则终止进程
        process.exit(1);
    }
};

module.exports = connectDB;