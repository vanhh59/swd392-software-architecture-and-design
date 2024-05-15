const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./src/routes/');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error);
    });


app.listen(port, () => {
    console.log(`server on http://localhost:${port}`);
});
