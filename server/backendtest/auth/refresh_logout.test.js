const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, generateTokens } = require('../../index');

jest.mock('jsonwebtoken');

// Test suite for the refreshToken endpoint
describe('POST /refreshToken', () => {
    const userId = '1';
    const accessTokenSecret = 'access_secret';
    const refreshTokenSecret = 'refresh_secret';
    const mockRefreshToken = 'mockRefreshToken';
    const mockAccessToken = 'mockAccessToken';

    beforeAll(() => {
        process.env.ACCESS_TOKEN_SECRET = accessTokenSecret;
        process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret;
    });

    test('should refresh the access token when provided with a valid refresh token', async () => {
        jwt.verify.mockImplementation((token, secret) => {
            if (token === mockRefreshToken && secret === refreshTokenSecret) {
                return { id: userId };
            }
        });

        jwt.sign.mockImplementation((payload, secret, options) => {
            if (secret === process.env.ACCESS_TOKEN_SECRET) {
                return mockAccessToken;
            } else if (secret === process.env.REFRESH_TOKEN_SECRET) {
                return mockRefreshToken;
            }
        });

        const response = await request(app)
            .post('/refreshToken')
            .set('Cookie', [`refreshToken=${mockRefreshToken}`])
            .send();
    
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('accessToken', mockAccessToken);
    });

    test('should return 401 error if refresh token is missing/not provided', async () => {
        const res = await request(app)
            .post('/refreshToken')
            .send();

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Refresh Token is required.');
    });

    test('should return 403 error if the refresh token is invalid or expired', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid or expired token');
        });

        const res = await request(app)
            .post('/refreshToken')
            .set('Cookie', `refreshToken=${refreshTokenSecret}`)
            .send();

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'Invalid or expired refresh token');
    });
});

// Test suite for the logout endpoint
describe('POST /logout', () => {
    test('should logout by clearing the refresh token cookie and returning a 204 status code', async () => {
        const res = await request(app)
            .post('/logout')
            .send();

        expect(res.statusCode).toEqual(204);
        expect(res.headers['set-cookie']).toBeDefined();
        
        const cookies = res.headers['set-cookie'][0];
        expect(cookies).toMatch(/refreshToken=;/);
        expect(cookies).toMatch(/Max-Age=0/);
        expect(cookies).toMatch(/HttpOnly/);
        expect(cookies).toMatch(/SameSite=Strict/);
    });
});