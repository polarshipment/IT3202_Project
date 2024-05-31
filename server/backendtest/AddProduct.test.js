const request = require('supertest');
const {app} = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');


describe('POST /add', () => {
    test('should add a product successfully and return 201 status', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app)
            .post('/add')
            .send({
                product_name: 'Test Product',
                stock: 10,
                price: 100
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Product Added Successfully!');
    });

    test('should return 500 status if the product cannot be added', async () => {
        db.query.mockImplementation((sql, values, callback) => {
        callback(new Error('Database error'), null);
        });

        const res = await request(app)
        .post('/add')
        .send({
            product_name: 'Test Product',
            stock: 10,
            price: 100
        });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error creating the product. ');
    });

});