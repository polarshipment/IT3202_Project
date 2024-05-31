const request = require('supertest');
const bcrypt = require('bcrypt');
const {app} = require('../../index'); 
const db = require('../../db/dbConfig');

jest.mock('../../db/dbConfig');
jest.mock('bcrypt');


// Test suite for the register endpoint
describe('POST /register', () => {
    test('should create an account successfully and return 201 status', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, []); 
            } else if (sql.includes('INSERT')) {
                callback(null, { affectedRows: 1 }); 
            }
        });

        bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedpassword'); 
        });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Account created successfully.');
    });

    test('should return 409 error if the email already exists', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, [{ id: 1, email: 'test@example.com' }]); 
            }
        });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'Email already exists.');
    });

    test('should return 500 error if there is a database error during user check', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(new Error('Database error'), null);
            }
        });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Database error. ');
    });

    test('should return 500 error if there is an error hashing the password', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, []); 
            }
        });

        bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
            callback(new Error('Hashing error'), null);
        });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error hashing password. ');
    });

    test('should return 500 error if there is a database error during user account creation', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.includes('SELECT')) {
                callback(null, []); 
            } else if (sql.includes('INSERT')) {
                callback(new Error('Database error'), null);
            }
        });

        bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedpassword'); 
        });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                pass: 'password123'
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Database error. ');
    });
});