const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

let token;
let industryId;
let companyId;
let positionId;

beforeAll(async() => {
    // 清理测试数据库
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Tests should only run in test environment');
    }

    // 注册测试用户并获取token
    const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
    };

    const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData);

    token = registerRes.body.token;
});

afterAll(async() => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    test('should login with valid credentials', async() => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
    });

    test('should get current user profile', async() => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('username', 'testuser');
    });
});

describe('Industry API', () => {
    test('should create a new industry', async() => {
        const industryData = {
            name: 'Test Industry',
            description: 'Industry for testing'
        };

        const res = await request(app)
            .post('/api/industries')
            .set('Authorization', `Bearer ${token}`)
            .send(industryData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(industryData.name);

        industryId = res.body._id;
    });

    test('should get all industries', async() => {
        const res = await request(app)
            .get('/api/industries')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('Company API', () => {
    test('should create a new company', async() => {
        const companyData = {
            name: 'Test Company',
            industry: industryId,
            description: 'Company for testing',
            location: 'Test Location',
            website: 'https://example.com'
        };

        const res = await request(app)
            .post('/api/companies')
            .set('Authorization', `Bearer ${token}`)
            .send(companyData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(companyData.name);

        companyId = res.body._id;
    });

    test('should get companies by industry', async() => {
        const res = await request(app)
            .get(`/api/companies/industry/${industryId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('Position API', () => {
    test('should create a new position', async() => {
        const positionData = {
            title: 'Test Position',
            company: companyId,
            description: 'Position for testing',
            location: 'Test Location',
            status: '准备中'
        };

        const res = await request(app)
            .post('/api/positions')
            .set('Authorization', `Bearer ${token}`)
            .send(positionData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe(positionData.title);

        positionId = res.body._id;
    });

    test('should get positions by company', async() => {
        const res = await request(app)
            .get(`/api/positions/company/${companyId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});