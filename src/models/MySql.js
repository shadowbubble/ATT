const mysql = require('mysql');
const dbConfig = require('../config/database');
// const dbConfig = require('config').get('app.dbConfig');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;
