const express = require('express');
const Hospital = require('../models/hospital');
const authMiddleware = require('../middlewares/authentication');
const app = express();

// Index
app.get('/', (request, response, next) => {
    var from = request.query.from || 0;
    from = Number(from);

    Hospital.find({ })
        .populate('user', 'name email')
        .skip(from)
        .limit(5)
        .exec(
            (error, hospitals) => {
                if (error) {
                    return response.status(500).json({
                        success: false,
                        message: 'Error loading hospitals',
                        errors: error
                    });
                }

                Hospital.count({}, (error, count) => {
                    response.status(200).json({
                        success: true,
                        hospitals: hospitals,
                        total: count
                    });
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

// Show
app.get('/:id', (req, res) => {
    let id = req.params.id;
    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Oops! An error occurred while searching for hospital',
                    errors: err
                });
            }

            if (! hospital) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Hospital does not exist',
                    errors: { message: 'Hospital not found' }
                });
            }

            res.status(200).json({
                success: true,
                hospital: hospital
            });
        });
});

module.exports = app;
