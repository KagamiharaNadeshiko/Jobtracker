const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectDB = require('./server/config/db');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// 定义API路由
app.use('/api/industries', require('./server/routes/industries'));
app.use('/api/companies', require('./server/routes/companies'));
app.use('/api/jobs', require('./server/routes/jobs'));
app.use('/api/applications', require('./server/routes/applications'));
app.use('/api/essays', require('./server/routes/essays'));
app.use('/api/online-tests', require('./server/routes/onlineTests'));
app.use('/api/interviews', require('./server/routes/interviews'));
app.use('/api/users', require('./server/routes/users'));
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/upload', require('./server/routes/upload'));

// 在生产环境下提供静态资产
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// 定义端口
const PORT = process.env.PORT || 5000;

// 启动服务器
const server = app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));

// 为了测试，导出server
module.exports = server;