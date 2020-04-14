const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect(`mongodb://localhost:27017/mydb`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('DB >\x1b[32m conected! \x1b[0m'))
    .catch(error => console.log('Error', error));

app.get('/', (request, response, next) => {
    response.status(200).json({
        success: true,
        message: 'Request made correctly'
    });
});

app.listen(port, () => {
    console.log(`App listening at port:${port} >\x1b[32m online \x1b[0m`);
});
