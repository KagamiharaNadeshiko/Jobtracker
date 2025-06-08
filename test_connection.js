/**
 * MongoDB 连接测试脚本
 * 用于快速测试MongoDB连接
 * 用法: node test_connection.js [连接字符串]
 */
require('dotenv').config();
const mongoose = require('mongoose');

// 获取连接字符串
const uri = process.argv[2] || process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing';

// 屏蔽连接字符串中的敏感信息
const maskedUri = uri.replace(/mongodb(\+srv)?:\/\/(.*?):(.*?)@/, 'mongodb$1://*****:*****@');
console.log(`尝试连接到: ${maskedUri}`);

// 尝试连接
mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    })
    .then(() => {
        console.log('✅ 连接成功!');
        console.log(`- 主机: ${mongoose.connection.host}`);
        console.log(`- 数据库名称: ${mongoose.connection.name}`);
        console.log(`- 连接状态: ${mongoose.connection.readyState === 1 ? '已连接' : '未连接'}`);

        // 列出所有集合
        return mongoose.connection.db.listCollections().toArray();
    })
    .then(collections => {
        if (collections && collections.length) {
            console.log(`- 可用集合: ${collections.map(c => c.name).join(', ')}`);
        } else {
            console.log('- 数据库中没有集合');
        }

        // 关闭连接
        return mongoose.disconnect();
    })
    .catch(err => {
        console.error(`❌ 连接失败: ${err.message}`);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('无法连接到MongoDB服务器，请检查服务器是否运行以及网络设置');
        } else if (err.name === 'MongoParseError') {
            console.error('MongoDB连接字符串格式错误');
        } else if (err.message.includes('authentication failed')) {
            console.error('MongoDB身份验证失败，请检查用户名和密码');
        } else if (err.message.includes('ENOTFOUND') || err.message.includes('could not be reached')) {
            console.error('找不到MongoDB主机，DNS解析问题或主机名错误');
        }
        process.exit(1);
    })
    .finally(() => {
        console.log('连接测试完成');
    });