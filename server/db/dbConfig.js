require('dotenv').config();
const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
})

// Check if connection is successful
db.connect( (error) => {
    if(error) {
        console.log('Database connection failed. Error:', error.sqlMessage)
    } else {
        console.log('Successfully connected to the database')
    }
})


module.exports = db;