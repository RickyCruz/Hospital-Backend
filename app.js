const express = require('express');
const app = express();
const port = 3000;

app.get('/', (request, response, next) => {
    response.status(200).json({
        success: true,
        message: 'Request made correctly'
    });
});

app.listen(port, () => {
    console.log(`App listening at port:${port} >\x1b[32m online \x1b[0m`);
});
