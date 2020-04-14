const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`App listening at port:${port} >\x1b[32m online \x1b[0m`);
});
