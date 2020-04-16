const express = require('express');
const Hospital = require('../models/hospital');
// const authMiddleware = require('../middlewares/authentication');
const app = express();

app.get('/all/:keyword', (request, response, next) => {
    let search = request.params.keyword;
    let regex = new RegExp(search, 'i');

    searchHospitals(search, regex)
        .then(hospitals => {
            response.status(200).json({
                success: true,
                hospitals: hospitals,
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

module.exports = app;
