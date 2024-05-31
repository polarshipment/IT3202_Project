const request = require('supertest');
const {app} = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');

describe("PUT /", () => {
    test("should update product stock successfully and return 200 status", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app)
            .put('/')
            .send({
                id: 1,
                stock: 20
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product stock updated successfully');
    });

    test("should return 400 status if required data is missing", async () => {
        const res = await request(app)
            .put('/')
            .send({
                stock: 20
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Missing required data (id or stock)');
    });

    test("should update product stock successfully even if there is an error in db query", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const res = await request(app)
            .put('/')
            .send({
                id: 1,
                stock: 20
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product stock updated successfully');
    });
});