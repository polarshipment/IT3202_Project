require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require('./db/dbConfig.js');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 7000;


// CRUD
app.get("/", (req, res) => {
    // res.json("Hello");
    const sql = "SELECT * FROM products";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.post("/add", (req, res) => {
    const sql = "INSERT INTO products (`product_name`,`stock`,`price`) VALUES (?)";
    const values = [
        req.body.product_name, 
        req.body.stock, 
        req.body.price
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
})


app.put("/update/:id", (req, res) => {
    const sql = "update products set product_name = ?, stock = ?, price = ? where id = ?";
    const values = [
        req.body.product_name, 
        req.body.stock, 
        req.body.price
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.delete("/products/:id", (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.put("/", (req, res) => {
    if (req.method === 'PUT') {
        const updateData = req.body;
        if (!updateData.id || !updateData.stock) {
            return res.status(400).json({ message: "Missing required data (id or stock)" });
        }

        const sql = "UPDATE products SET stock = ? WHERE id = ?";
        const values = [updateData.stock, updateData.id];

        db.query(sql, values, (err, data) => {
            return res.json({ message: "Product stock updated successfully" });
        });
    }
})


// AUTHENTICATION
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    
    db.query(sql, [req.body.email, req.body.pass], (err, data) => {
        if(err) return res.json("Error: ", err.sqlMessage);
        if(data.length > 0 ) {
            return res.json("Login Successful.");
        } else{
            return res.json("No matching record.");
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})