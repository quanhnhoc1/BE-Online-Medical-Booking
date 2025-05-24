const sql = require("mssql");

const config = {
  server: "THANITLO",
  user: "sa",
  password: "123123",
  database: "ExpenseTracker",
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
