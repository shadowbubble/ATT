"use strict";

const path = require("path");
const rootDir = path.join(__dirname, '../public');

const viewDir = `${rootDir}/views`;

const user = {};

user.getIndex = (req, res) => {
    res.send('respond with a resource');
};

// 登录
user.getLogin = (req, res) => {
    const loginPath = path.join(viewDir, 'login.html');
    res.sendFile(loginPath);
};

module.exports = user;