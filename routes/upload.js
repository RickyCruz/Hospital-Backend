const express = require('express');
const fileUpload = require('express-fileupload');
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

    file.mv(path, function(err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Whoops! Something were wrong',
                errors: err
            });
        }

        res.status(200).json({
            success: true,
            message: 'File stored correctly'
        });
    });
});

module.exports = app;
