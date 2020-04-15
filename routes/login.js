const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
const User = require('../models/user');

app.post('/', (request, response, next) => {
    let body = request.body;

    User.findOne({ email: body.email }, (error, userDB) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error has occurred',
                errors: error
            });
        }

        if (! userDB || (! body.password)) {
            return response.status(400).json({
                success: false,
                message: 'These credentials do not match our records',
            });
        }

        if (! bcrypt.compareSync(body.password, userDB.password)) {
            return response.status(400).json({
                success: false,
                message: 'These credentials do not match our records',
            });
        }

        // Create token

        response.status(200).json({
            success: true,
            user: userDB,
            id: userDB._id
        });
    });

});

module.exports = app;
