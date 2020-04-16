const express = require('express');
const Hospital = require('../models/hospital');
const authMiddleware = require('../middlewares/authentication');
const app = express();

// Index
app.get('/', (request, response, next) => {
    Hospital.find({ }).exec(
        (error, hospitals) => {
            if (error) {
                return response.status(500).json({
                    success: false,
                    message: 'Error loading hospitals',
                    errors: error
                });
            }

            response.status(200).json({
                success: true,
                hospitals: hospitals
            });
        }
    );
});

// Store
app.post('/', authMiddleware.verifyToken, (request, response, next) => {
    let body = request.body;

    let hospital = new Hospital({
        name: body.name,
        user: request.user._id
    });

    hospital.save((error, hospitalCreated) => {
        if (error) {
            return response.status(400).json({
                success: false,
                message: 'Oops! An error has occurred',
                errors: error
            });
        }

        response.status(201).json({
            success: true,
            hospital: hospitalCreated
        });
    });
});

// Update
app.patch('/:id', authMiddleware.verifyToken, (request, response, next) => {
    let id = request.params.id;
    let body = request.body;

    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error occurred while searching for hospital',
                errors: error
            });
        }

        if (! hospital) {
            return response.status(400).json({
                success: false,
                message: 'Oops! Hospital does not exist',
                errors: { message: 'Hospital not found' }
            });
        }

        hospital.name = body.name;
        hospital.user = request.user._id;

        hospital.save((error, hospitalUpdated) => {
            if (error) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Error updating hospital',
                    errors: error
                });
            }

            response.status(200).json({
                success: true,
                hospital: hospitalUpdated
            });
        });
    });
});

// Delete
app.delete('/:id', authMiddleware.verifyToken, (request, response, next) => {
    let id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalDeleted) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error occurred while deleting the hospital',
                errors: error
            });
        }

        if (! hospitalDeleted) {
            return response.status(400).json({
                success: false,
                message: 'Oops! Hospital does not exist',
                errors: { message: 'Hospital not found' }
            });
        }

        response.status(200).json({
            success: true,
            hospital: hospitalDeleted
        });
    });
});

module.exports = app;
