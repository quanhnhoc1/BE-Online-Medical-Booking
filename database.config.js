require("dotenv").config();
const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // bắt buộc nếu bạn dùng Azure hoặc tick "Encrypt"
    trustServerCertificate: process.env.DB_TRUST_CERT === "true", // cần thiết nếu tự tin với certificate
  },
};

// Kết nối duy nhất
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  sql,
  pool,
  poolConnect,
};
