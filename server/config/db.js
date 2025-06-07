// 数据库配置
const mongoose = require('mongoose');

// 连接到MongoDB数据库
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    } catch (error) {
        console.error(`错误: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;