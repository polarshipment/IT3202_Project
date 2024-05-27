require('dotenv').config();
const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
})

db.connect( (error) => {
    if(error) {
        console.log('Error:', error)
    } else {
        console.log('Successfully connected to the database')
    }
})


module.exports = db;