require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require('./db/dbConfig.js');

const app = express();
app.use(express.json());
app.use(cors());


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

app.listen(7000, () => {
    console.log("listening");
})