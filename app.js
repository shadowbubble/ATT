"use strict";

const bodyParser = require("body-parser");
const express = require("express"); // express tool kit
// import config from 'config';
const path = require("path");
// const session = require('express-session');
// import cookie from 'cookie-parser';
const app = express();
app.use(express.json());
// Set the files under public to static, after which the public directory becomes the root directory
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));
// to parse the application/json
app.use(bodyParser.json());
//  to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(cookie());

const index = require("./private/index");
const user = require("./private/user");

app.get('/', index.getIndex);
app.post('/', index.postInit);
app.post('/pour', index.postPour);
app.post('/switch', index.postSwitch);
app.post('/init', index.postInit);
app.get('/user', user.getIndex);
app.get('/user/login', user.getLogin);
app.use(index.errorHandle);

const port = 3000;
app.listen(port || 3000, () => {
    console.clear();
    console.log(`Server running on http://localhost:${port}`);
    console.log('Press ^C twice to STOP the server');
});
