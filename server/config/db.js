// 数据库配置
const mongoose = require('mongoose');

// 连接到MongoDB数据库
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    } catch (err) {
        console.error(`MongoDB 连接错误: ${err.message}`);
        // 如果无法连接到数据库，则终止进程
        process.exit(1);
    }
};

module.exports = connectDB;