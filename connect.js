const sql = require("mssql");
require("dotenv").config();
const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};
const pool = new sql.ConnectionPool(config);
const conn = pool.connect();

module.exports = {
  sql,
  pool,
  conn,
};
