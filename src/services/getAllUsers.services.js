// const sql = require("mssql");
const { pool } = require("../../connect");

async function getAllUsers() {
  try {
    const request = pool.request();
    const result = await request.query("select * from users");
    return result.recordset;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

module.exports = {
  getAllUsers,
};
