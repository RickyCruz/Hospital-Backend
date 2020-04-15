const express = require('express');
const bcrypt = require('bcryptjs')

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
        password: bcrypt.hashSync(body.password, 10),
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

// Update
app.patch('/:id', (request, response, next) => {
    let id = request.params.id;
    let body = request.body;

    User.findById(id, (error, user) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error occurred while searching for user',
                errors: error
            });
        }

        if (! user) {
            return response.status(400).json({
                success: false,
                message: 'Oops! User does not exist',
                errors: { message: 'User not found' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((error, userUpdated) => {
            if (error) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Error updating user',
                    errors: error
                });
            }

            userUpdated.password = '🤭';

            response.status(200).json({
                success: true,
                user: userUpdated
            });
        });
    });
});

module.exports = app;
