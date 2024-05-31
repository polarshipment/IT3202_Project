const {app} = require('./index');

const db = require('./db/dbConfig');

const PORT = process.env.PORT || 7000;

// Check if connection is successful
db.connect( (error) => {
    if(error) {
        console.log('Database connection failed. Error:', error.sqlMessage)
    } else {
        console.log('Successfully connected to the database')
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

