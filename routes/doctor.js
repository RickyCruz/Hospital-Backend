const express = require('express');
const Doctor = require('../models/doctor');
const authMiddleware = require('../middlewares/authentication');
const app = express();

// Index
app.get('/', (request, response, next) => {
    var from = request.query.from || 0;
    from = Number(from);

    Doctor.find({ })
        .skip(from)
        .limit(5)
        .populate('user', 'name email img')
        .populate('hospital')
        .exec(
            (error, doctors) => {
                if (error) {
                    return response.status(500).json({
                        success: false,
                        message: 'Error loading doctors',
                        errors: error
                    });
                }

                Doctor.count({}, (error, count) => {
                    response.status(200).json({
                        success: true,
                        doctors: doctors,
                        total: count
                    });
                });
            }
        );
});

// Store
app.post('/', authMiddleware.verifyToken, (request, response, next) => {
    let body = request.body;

    let doctor = new Doctor({
        name: body.name,
        hospital: body.hospital,
        user: request.user._id
    });

    doctor.save((error, doctorCreated) => {
        if (error) {
            return response.status(400).json({
                success: false,
                message: 'Oops! An error has occurred',
                errors: error
            });
        }

        response.status(201).json({
            success: true,
            doctor: doctorCreated
        });
    });
});

// Update
app.patch('/:id', authMiddleware.verifyToken, (request, response, next) => {
    let id = request.params.id;
    let body = request.body;

    Doctor.findById(id, (error, doctor) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error occurred while searching for doctor',
                errors: error
            });
        }

        if (! doctor) {
            return response.status(400).json({
                success: false,
                message: 'Oops! Doctor does not exist',
                errors: { message: 'Doctor not found' }
            });
        }

        doctor.name = body.name;
        doctor.user = request.user._id;
        doctor.hospital = body.hospital;

        doctor.save((error, doctorUpdated) => {
            if (error) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Error updating doctor',
                    errors: error
                });
            }

            response.status(200).json({
                success: true,
                doctor: doctorUpdated
            });
        });
    });
});

// Delete
app.delete('/:id', authMiddleware.verifyToken, (request, response, next) => {
    let id = request.params.id;

    Doctor.findByIdAndRemove(id, (error, doctorDeleted) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Oops! An error occurred while deleting the doctor',
                errors: error
            });
        }

        if (! doctorDeleted) {
            return response.status(400).json({
                success: false,
                message: 'Oops! Doctor does not exist',
                errors: { message: 'Doctor not found' }
            });
        }

        response.status(200).json({
            success: true,
            doctor: doctorDeleted
        });
    });
});

// Show
app.get('/:id', (req, res) => {
    let id = req.params.id;
    Doctor.findById(id)
        .populate('user', 'name img email')
        .populate('hospital')
        .exec((err, doctor) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Oops! An error occurred while searching for doctor',
                    errors: err
                });
            }

            if (! doctor) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Doctor does not exist',
                    errors: { message: 'Doctor not found' }
                });
            }

            res.status(200).json({
                success: true,
                doctor: doctor
            });
        });
});

module.exports = app;
