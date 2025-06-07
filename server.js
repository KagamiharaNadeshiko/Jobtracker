const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./server/config/db');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 定义路由
app.use('/api/industries', require('./server/routes/industries'));
app.use('/api/companies', require('./server/routes/companies'));
app.use('/api/positions', require('./server/routes/positions'));
app.use('/api/essays', require('./server/routes/essays'));
app.use('/api/onlinetests', require('./server/routes/onlinetests'));
app.use('/api/interviews', require('./server/routes/interviews'));

// 在生产环境中提供静态文件
if (process.env.NODE_ENV === 'production') {
    // 设置静态文件夹
    app.use(express.static(path.join(__dirname, '/client/build')));

    // 所有未匹配的路由都返回主页
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API 运行中...');
    });
}

// 设置端口
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;