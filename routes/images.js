const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

app.get('/:type/:img', (request, response, next) => {
    let type = request.params.type;
    let img = request.params.img;

    var imgPath = path.resolve(__dirname, `../uploads/${ type }/${ img }`);

    if (fs.existsSync(imgPath)) {
        response.sendFile(imgPath);
    } else {
        response.sendFile(
            path.resolve(__dirname, '../assets/no-img.jpg')
        );
    }
});

module.exports = app;
