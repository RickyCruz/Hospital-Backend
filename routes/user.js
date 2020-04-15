const express = require('express');
const app = express();

const User = require('../models/user');

// Index
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

// Store
app.post('/', (request, response, next) => {
    let body = request.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    user.save((error, userCreated) => {
        if (error) {
            return response.status(400).json({
                success: false,
                message: 'Oops! An error has occurred',
                errors: error
            });
        }

        response.status(201).json({
            success: true,
            user: userCreated
        });
    });
});

module.exports = app;
