const request = require('supertest');
const app = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');

app.put("/update/:id", (req, res) => {
    const sql = "UPDATE products SET product_name = ?, stock = ?, price = ? WHERE id = ?";
    const values = [
        req.body.product_name,
        req.body.stock,
        req.body.price
    ];
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.status(500).json({ message: "Error updating the product. ", err });
        if (data.affectedRows === 0) return res.status(404).json({ message: "Product not found." });
        return res.status(200).json({ message: "Product Updated Successfully!" });
    });
});

describe("PUT /update/:id", () => {
    test("should update a product successfully and return 200 status", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app)
            .put('/update/1')
            .send({
                product_name: 'Updated Product',
                stock: 20,
                price: 200
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product Updated Successfully!');
    });

    test("should return 404 if product is not found", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const res = await request(app)
            .put('/update/1')
            .send({
                product_name: 'Updated Product',
                stock: 20,
                price: 200
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Product not found.');
    });

    test("should return 500 status if there is an error updating the product", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const res = await request(app)
            .put('/update/1')
            .send({
                product_name: 'Updated Product',
                stock: 20,
                price: 200
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error updating the product. ');
    });
});