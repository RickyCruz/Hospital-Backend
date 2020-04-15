const dotenv = require('dotenv-safe');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

dotenv.config({ allowEmptyValues: true });

const DB_CONNECTION = process.env.DB_CONNECTION;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const APP_PORT = process.env.APP_PORT;

const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');

const dbConnection = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
};

mongoose.connect(dbConnection, dbOptions)
    .then(() => console.log('DB >\x1b[32m conected! \x1b[0m'))
    .catch(error => console.error('Error', error));

const app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

app.listen(APP_PORT, () => {
    console.log(`App listening at port:${APP_PORT} >\x1b[32m online \x1b[0m`);
});
