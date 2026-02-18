const request = require('supertest');
const { app } = require('../server');
const { connectDB, sequelize } = require('../config/database');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    const testEmail = `test-${Date.now()}@supnum.mr`;

    const { User } = require('../models');

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullName: 'Test User', // Backend expects fullName
                email: testEmail,
                password: 'password123',
                role: 'student',
                supnumId: 'TEST001'
            });

        if (res.statusCode !== 201) {
            console.error('Registration Failed:', res.body);
        }
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message'); // No token on register
        expect(res.body.user.status).toBe('Pending');
    });

    it('should login the user', async () => {
        // Manually approve user
        await User.update({ status: 'Verified' }, { where: { email: testEmail } });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'password123'
            });

        if (res.statusCode !== 200) {
            console.error('Login Failed:', res.body);
        }
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
