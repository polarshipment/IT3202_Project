require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
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
    const sql = "UPDATE products SET product_name = ?, stock = ?, price = ? WHERE id = ?";
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


// DASHBOARD
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
app.post("/register", (req, res) => {

    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserSql, [req.body.email], (err, data) => {
        if(err) return res.json("Error: ", err.message);
        if(data.length > 0 ) {
            return res.json({ status: 400, message: "Email already exist." });
        }

        const pass = req.body.pass.toString();
        bcrypt.hash(pass, 10, (err, hash) => {
            if (err) {
                return res.json("Error hashing password", err.message);
            }

            const insertUserSql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
            const values = [
                req.body.name, 
                req.body.email, 
                hash
            ]
            db.query(insertUserSql, [values], (err, data) => {
                if(err) return res.json("Error: ", err.message);
                return res.json({ status: 200, message: "Account created successfully." });
            })
        })
        
    })
})

app.post("/login", (req, res) => {

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json("Error: ", err.message);

        if(data.length > 0 ) {
            const pass = req.body.pass.toString();
            bcrypt.compare(pass, data[0].password, (err, response) => {
                if(err) return res.json("Error: ", err.message);
                if(response) {
                    return res.json({ status: 200, message: "Success" });
                }
                return res.json({ status: 400, message: "Invalid credentials." });
            })
        } else {
            return res.json({ status: 400, message: "Invalid credentials." });
        }
    })
})



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})