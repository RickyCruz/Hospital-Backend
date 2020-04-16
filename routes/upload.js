const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');

const app = express();

// default options
app.use(fileUpload());

app.patch('/:resource/:id', function(req, res) {
    let resource = req.params.resource;
    let id = req.params.id;

    // Collection types
    let allowCollections = ['doctors', 'hospitals', 'users'];

    if (allowCollections.indexOf(resource) < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid collection',
            errors: {
                message: 'No files were uploaded '
            }
        });
    }

    if (! req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No files were uploaded',
            errors: {
                message: 'You must send an image'
            }
        });
    }

    // The name of the input field is used to retrieve the uploaded file
    let file = req.files.image;
    let fileName = file.name.split('.');
    let extension = fileName[fileName.length - 1]
    let allowExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid extension',
            errors: {
                message: 'You can upload only files with extensions: ' + allowExtensions.join(', ')
            }
        });
    }

    let newName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    let path = `./uploads/${ resource }/${ newName }`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Whoops! Something were wrong',
                errors: err
            });
        }

        uploadByType(resource, id, newName, res);
    });
});

function uploadByType(resource, id, newName, response) {
    if (resource === 'users') {
        User.findById(id, (error, user) => {

            if (! user) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! User does not exist',
                    errors: { message: 'User not found' }
                });
            }

            let prevPath = './uploads/users/' + user.img;

            if (fs.existsSync(prevPath)) {
                fs.unlinkSync(prevPath);
            }

            user.img = newName;

            user.save((err, userUpdated ) => {
                return response.status(200).json({
                    success: true,
                    message: 'Image updated',
                    user: userUpdated,
                });
            });
        });
    }

    if (resource === 'doctors') {
        Doctor.findById(id, (error, doctor) => {
            if (! doctor) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Doctor does not exist',
                    errors: { message: 'Doctor not found' }
                });
            }

            let prevPath = './uploads/doctors/' + doctor.img;

            if (fs.existsSync(prevPath)) {
                fs.unlinkSync(prevPath);
            }

            doctor.img = newName;

            doctor.save((err, doctorUpdated ) => {
                return response.status(200).json({
                    success: true,
                    message: 'Image updated',
                    doctor: doctorUpdated,
                });
            });
        });
    }

    if (resource === 'hospitals') {
        Hospital.findById(id, (error, hospital) => {
            if (! hospital) {
                return response.status(400).json({
                    success: false,
                    message: 'Oops! Hospital does not exist',
                    errors: { message: 'Hospital not found' }
                });
            }

            let prevPath = './uploads/hospitals/' + hospital.img;

            if (fs.existsSync(prevPath)) {
                fs.unlinkSync(prevPath);
            }

            hospital.img = newName;

            hospital.save((err, hospitalUpdated ) => {
                return response.status(200).json({
                    success: true,
                    message: 'Image updated',
                    hospital: hospitalUpdated,
                });
            });
        });
    }
}

module.exports = app;
