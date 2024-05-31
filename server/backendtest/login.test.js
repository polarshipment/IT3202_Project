const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { app, generateTokens } = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');
jest.mock('bcrypt');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));


// Test suite for the login endpoint
describe('POST /login', () => {
    it('should login successfully and return 200 status', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, [{ 
                    id: 1, 
                    email: 'test@example.com', 
                    name: 'Test User', 
                    password: 'hashedpassword' 
                }]); 
            }
        });

        bcrypt.compare.mockImplementation((password, hash, callback) => {
            callback(null, true); 
        });

        jwt.sign.mockImplementation((payload, secret, options) => {
            if (secret === process.env.ACCESS_TOKEN_SECRET) {
                return 'accessToken';
            }
            if (secret === process.env.REFRESH_TOKEN_SECRET) {
                return 'refreshToken';
            }
        });

        const res = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Success');
        expect(res.body).toHaveProperty('accessToken', 'accessToken');
        expect(res.body.user).toMatchObject({ id: 1, name: 'Test User', email: 'test@example.com' });
    });

    test('should return 401 error if the email does not exist', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, []); 
            }
        });

        const res = await request(app)
            .post('/login')
            .send({
                email: 'nonexistentemail@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });

    test('should return 500 error if there is a problem in the database', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(new Error('Database error'), null);
            }
        });

        const res = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Database error. ');
    });

    test('should return 401 error if the password does not match', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, [{ 
                    id: 1, 
                    email: 'test@example.com', 
                    name: 'Test User', 
                    password: 'hashedpassword' 
                }]); 
            }
        });

        bcrypt.compare.mockImplementation((password, hash, callback) => {
            callback(null, false);
        });

        const res = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                pass: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });

    test('should return 500 error if there is an error hashing the password', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, [{ 
                    id: 1, 
                    email: 'test@example.com', 
                    name: 'Test User', 
                    password: 'hashedpassword' 
                }]);
            }
        });

        bcrypt.compare.mockImplementation((password, hash, callback) => {
            callback(new Error('Hashing error'), null);
        });

        const res = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error hashing password. ');
    });
});

// Test suite for generating tokens function
describe('generateTokens(id)', () => {
    beforeAll(() => {
        process.env.ACCESS_TOKEN_SECRET = 'access_key';
        process.env.REFRESH_TOKEN_SECRET = 'refresh_key';
    });

    test('should correcly generate the tokens', () => {
        jwt.sign.mockImplementation((payload, secret, options) => {
            if (secret === 'access_key') {
                return 'mockedAccessToken';
            } else if (secret === 'refresh_key') {
                return 'mockedRefreshToken';
            }
        });

        const { accessToken, refreshToken } = generateTokens(1);

        expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, 'access_key', { expiresIn: '15m' });
        expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, 'refresh_key', { expiresIn: '7d' });
        expect(accessToken).toBe('mockedAccessToken');
        expect(refreshToken).toBe('mockedRefreshToken');
    });
});