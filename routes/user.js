const express = require('express');
const app = express();

const User = require('../models/user');

app.get('/', (request, response, next) => {
    User.find({ }, 'name email img role').exec(
        (error, users) => {
            if (error) {
                return response.status(500).json({
                    success: false,
                    message: 'Error loading users',
                    errors: error
                });
            }

            response.status(200).json({
                success: true,
                users: users
            });
        }
    );
});

module.exports = app;
