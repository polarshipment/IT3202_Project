const request = require('supertest');
const app = require('../index'); 

jest.mock('mysql', () => ({
    createConnection: jest.fn(() => ({
      query: jest.fn((sql, values, callback) => {
        if (sql.startsWith('INSERT INTO products')) {
          callback(null, { insertId: 1 });
        } else {
          callback(new Error('Database error'), null);
        }
      }),
    })),
}));

describe('POST /add', () => {
    test('should add a product successfully', async () => {
        const newFood = {
            product_name: 'Pizza',
            stock: 10,
            price: 90.99,
        };
    
        const response = await request(app)
            .post('/addFood')
            .send(newFood);
    
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Product Added Successfully!');
        expect(response.body.addedFoodId).toBe(1);
    });
});