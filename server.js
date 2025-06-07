const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./server/config/db');

// 加载环境变量
dotenv.config();

// 初始化应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API路由配置
app.use('/api/industries', require('./server/routes/industries'));
app.use('/api/companies', require('./server/routes/companies'));
app.use('/api/positions', require('./server/routes/positions'));
app.use('/api/essays', require('./server/routes/essays'));
app.use('/api/onlinetests', require('./server/routes/onlinetests'));
app.use('/api/interviews', require('./server/routes/interviews'));

// 判断环境是否为生产环境
if (process.env.NODE_ENV === 'production') {
    // 设置React构建后的静态文件目录
    app.use(express.static(path.join(__dirname, 'client/build')));

    // 对所有非API请求返回React的index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    // 在开发环境下，使用原始的public目录
    app.use(express.static(path.join(__dirname, 'public')));

    // 前端路由处理
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });
}

// 仅当直接运行时（非测试模式）才连接数据库并启动服务器
if (process.env.NODE_ENV !== 'test') {
    // 连接数据库
    connectDB();

    // 启动服务器
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));
}

module.exports = app;