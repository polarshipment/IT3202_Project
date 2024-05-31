require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./db/dbConfig.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.json({
        status: "successful",
        is_connected: true,
        message: "Hello World!",
        data:[1,2,3]
    });
});

////////////////////////////////////////////////////////////////////////////////////
///// CRUD /////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Read Products
app.get("/products", (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json({ message:"Error retrieving the products. ", err });
        return res.status(200).json(data);
    })
})

// Add Product
app.post("/add", (req, res) => {
    const sql = "INSERT INTO products (`product_name`,`stock`,`price`) VALUES (?)";
    const values = [
        req.body.product_name, 
        req.body.stock, 
        req.body.price
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.status(500).json({ message:"Error creating the product. ", err });
        return res.status(201).json({ message: "Product Added Successfully!"});
    })
})

// Update Product
app.put("/update/:id", (req, res) => {
    const sql = "UPDATE products SET product_name = ?, stock = ?, price = ? WHERE id = ?";
    const values = [
        req.body.product_name, 
        req.body.stock, 
        req.body.price
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if(err) return res.status(500).json({ message:"Error updating the product. ", err });
        if(data.affectedRows === 0) return res.status(404).json({ message: "Product not found."});
        return res.status(200).json({ message: "Product Updated Successfully!"});
    })
})

// Delete Product
app.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if(err) return res.status(500).json({ message:"Error deleting the product. ", err });
        if(data.affectedRows === 0) return res.status(404).json({ message: "Product not found."});
        return res.status(200).json({ message: "Product Deleted Successfully!"});
    })
})


////////////////////////////////////////////////////////////////////////////////////
///// DASHBOARD ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Order Processing
app.put("/", (req, res) => {
    if (req.method === 'PUT') {
        const updateData = req.body;
        if (!updateData.id || !updateData.stock) {
            return res.status(400).json({ message: "Missing required data (id or stock)" });
        }

        const sql = "UPDATE products SET stock = ? WHERE id = ?";
        const values = [updateData.stock, updateData.id];

        db.query(sql, values, (err, data) => {
            return res.status(200).json({ message: "Product stock updated successfully" });
        });
    }
})


////////////////////////////////////////////////////////////////////////////////////
///// AUTHENTICATION ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Register
app.post("/register", (req, res) => {

    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserSql, [req.body.email], (err, data) => {
        if(err) return res.status(500).json({ message:"Database error. ", err });
        if(data.length > 0 ) return res.status(409).json({ message: "Email already exists." });

        const pass = req.body.pass.toString();
        bcrypt.hash(pass, 10, (err, hash) => {
            if (err) return res.status(500).json({ message:"Error hashing password. ", err });

            const insertUserSql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
            const values = [
                req.body.name, 
                req.body.email, 
                hash
            ]
            db.query(insertUserSql, [values], (err, data) => {
                if(err) return res.status(500).json({ message:"Database error. ", err });
                return res.status(201).json({ message: "Account created successfully."});
            })
        })
    })
})


const generateTokens = (id) => {
    const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Login
app.post("/login", (req, res) => {

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.status(500).json({ message:"Database error. ", err });

        if(data.length > 0 ) {
            const pass = req.body.pass.toString();
            bcrypt.compare(pass, data[0].password, (err, response) => {
                if(err) return res.status(500).json({ message:"Error hashing password. ", err });
                if(response) {
                    const id = data[0].id;
                    const { accessToken, refreshToken } = generateTokens(id);
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
                    return res.status(200).json({ message: "Success", accessToken, user: { id: data[0].id, name: data[0].name, email: data[0].email }});
                }
                return res.status(401).json({ message: "Invalid credentials." });
            })
        } else {
            return res.status(401).json({ message: "Invalid credentials." });
        }
    })
})

app.post("/refreshToken", (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token is required." });
    }
    try {
        const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { accessToken } = generateTokens(userData.id);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token", error: error.message });
    }
})

// Logout
app.post("/logout", (req, res) => {
    res.cookie('refreshToken', '', { httpOnly: true, maxAge: 0, sameSite: 'Strict' });
    res.status(204).send();
});

module.exports = {app, generateTokens};