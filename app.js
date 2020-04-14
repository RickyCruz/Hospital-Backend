const dotenv = require('dotenv-safe');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config({ allowEmptyValues: true });

const DB_CONNECTION = process.env.DB_CONNECTION;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const APP_PORT = process.env.APP_PORT;

const dbConnection = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

mongoose.connect(dbConnection, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('DB >\x1b[32m conected! \x1b[0m'))
    .catch(error => console.error('Error', error));

const app = express();

app.get('/', (request, response, next) => {
    response.status(200).json({
        success: true,
        message: 'Request made correctly'
    });
});

app.listen(APP_PORT, () => {
    console.log(`App listening at port:${APP_PORT} >\x1b[32m online \x1b[0m`);
});
