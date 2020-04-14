const express = require('express');
const app = express();

app.get('/', (request, response, next) => {
    response.status(200).json({
        success: true,
        message: 'Request made correctly'
    });
});

module.exports = app;
