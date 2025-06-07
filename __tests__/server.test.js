const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// 连接到测试数据库
beforeAll(async() => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracing_test';
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// 测试完成后关闭数据库连接
afterAll(async() => {
    await mongoose.connection.close();
});

describe('Server API Routes', () => {
    // 测试API路由是否可以访问
    it('should access the industries API endpoint', async() => {
        const res = await request(app).get('/api/industries');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should access the companies API endpoint', async() => {
        const res = await request(app).get('/api/companies');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should access the positions API endpoint', async() => {
        const res = await request(app).get('/api/positions');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});