const express = require('express');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');
// const authMiddleware = require('../middlewares/authentication');
const app = express();

app.get('/all/:keyword', (request, response, next) => {
    let search = request.params.keyword;
    let regex = new RegExp(search, 'i');

    Promise.all([
        searchHospitals(search, regex),
        searchDoctors(search, regex),
        searchUsers(search, regex),
    ]).then(results => {
        response.status(200).json({
            success: true,
            hospitals: results[0],
            doctors: results[1],
            users: results[2],
        });
    });
});

function searchHospitals(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex }, (error, hospitals) => {
            if (error) {
                reject('Error loading hospitals');
            } else {
                resolve(hospitals);
            }
        });
    });
}

function searchDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex }, (error, doctors) => {
            if (error) {
                reject('Error loading doctors');
            } else {
                resolve(doctors);
            }
        });
    });
}

function searchUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find()
            .or([{ name: regex }, { email: regex }])
            .exec((error, users) => {
                if (error) {
                    reject('Error loading users');
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = app;
