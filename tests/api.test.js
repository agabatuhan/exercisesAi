const request = require('supertest');
const app = require('../server');
const { redisClient } = require('../config/redis');

describe('To-Do API', () => {
    beforeAll(async () => {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    });

    afterAll(async () => {
        await redisClient.quit();
    });

    it('should show the health check message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('ok');
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: `test_${Date.now()}@example.com`,
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toBe('success');
    });

    it('should fail registration with invalid input', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'te',
                email: 'not-an-email',
                password: '123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.status).toBe('fail');
    });
});
