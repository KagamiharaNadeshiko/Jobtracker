const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test database connection
describe('Database Connection', () => {
    it('should connect to MongoDB', async() => {
        // This test doesn't actually test anything, but will fail if the connection fails
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });
});

// Test the root route
describe('Root Route', () => {
    it('should return welcome message', async() => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toEqual('Welcome to Jobtracing API');
    });
});

// Test auth routes without authentication
describe('Auth Routes', () => {
    it('should return 401 for protected route without token', async() => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toEqual('No token, authorization denied');
    });
});

// Close database connection after all tests
afterAll(async() => {
    await mongoose.connection.close();
});