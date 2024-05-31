const app = require('./index');

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})