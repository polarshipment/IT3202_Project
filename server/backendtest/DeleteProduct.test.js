const request = require('supertest');
const app = require('../index'); 
const db = require('../db/dbConfig');

jest.mock('../db/dbConfig');

app.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ message: "Error deleting the product. ", err }); 
        if (data.affectedRows === 0) return res.status(404).json({ message: "Product not found." });
        return res.status(200).json({ message: "Product Deleted Successfully!" });
    });
});

describe("DELETE /delete/:id", () => {
    test("should delete a product successfully and return 200 status", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete('/delete/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product Deleted Successfully!');
    });

    test("should return 404 if product is not found", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const res = await request(app).delete('/delete/1');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Product not found.');
    });

    test("should return 500 status if there is an error deleting the product", async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(new Error('Database error'), null);
        });

        const res = await request(app).delete('/delete/1');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error deleting the product. '); 
    });
});