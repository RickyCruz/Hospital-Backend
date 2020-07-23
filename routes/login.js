const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authentication');

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
        let token = jwt.sign(
            { user: userDB },
            process.env.JWT_SEED,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );

        response.status(200).json({
            success: true,
            user: userDB,
            token: token,
            id: userDB._id,
            menu: getMenu(userDB.role)
        });
    });
});

app.get('/refresh-token', authMiddleware.verifyToken, (request, response, next) => {
    // Create token
    let token = jwt.sign(
        { user: request.user },
        process.env.JWT_SEED,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    return response.status(500).json({
        success: true,
        token: token
    });
});

function getMenu(role) {
    let menu = [
        {
            title: 'General',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'ProgressBar', url: '/progress' },
                { title: 'Charts', url: '/charts-one' },
                { title: 'Promises', url: '/promises' },
                { title: 'RxJs', url: '/rxjs' },
                { title: 'Settings', url: '/account-settings' },
            ]
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu.push({
            title: 'Maintenance',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Users', url: '/users' },
                { title: 'Hospitals', url: '/hospitals' },
                { title: 'Doctors', url: '/doctors' },
            ]
        });
    }

    return menu;
}

module.exports = app;
