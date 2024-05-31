const request = require('supertest');
const app = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');

app.get("/products", (req, res) => {
        const sql = "SELECT * FROM products";
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ message: "Error retrieving the products. ", err });
            return res.status(200).json(data);
        });
    });
    
    describe("GET /products", () => {
        test("should retrieve all products successfully and return 200 status", async () => {
            const mockProducts = [
                { id: 1, product_name: 'Product 1', stock: 10, price: 100 },
                { id: 2, product_name: 'Product 2', stock: 20, price: 200 },
            ];
    
            db.query.mockImplementation((sql, callback) => {
                callback(null, mockProducts);
            });
    
            const res = await request(app).get('/products');
    
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockProducts);
        });
    
        test("should return 500 status if there is an error retrieving the products", async () => {
            db.query.mockImplementation((sql, callback) => {
                callback(new Error('Database error'), null);
            });
    
            const res = await request(app).get('/products');
    
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Error retrieving the products. '); // Including the trailing space
        });
    });