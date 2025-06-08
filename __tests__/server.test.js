const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('服务器基础测试', () => {
    // 连接到测试数据库
    beforeAll(async() => {
        const url = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing_test';
        try {
            await mongoose.connect(url);
            console.log('测试数据库连接成功');
        } catch (err) {
            console.error('测试数据库连接失败:', err.message);
        }
    });

    // 测试完成后关闭数据库连接
    afterAll(async() => {
        await mongoose.connection.close();
        console.log('测试数据库连接已关闭');
    });

    // 测试服务器是否运行
    it('服务器应当正常启动并响应', async() => {
        const res = await request(app).get('/');
        expect(res.status).not.toBe(500);
    });
});