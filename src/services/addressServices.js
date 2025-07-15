const { pool, sql } = require("../../connect");
const getProvinces = async () => {
  const result = await pool.request().query(`

	SELECT DISTINCT
  RIGHT(DIACHI, CHARINDEX(',', REVERSE(DIACHI)) - 1) AS Province
FROM XAPHUONG
    `);
  return result.recordset;
};
const getDistrictsByProvince = async (province) => {
  const result = await pool
    .request()
    .input("province", sql.NVarChar, `%${province}`).query(`
      SELECT DISTINCT
        LTRIM(RTRIM(
          SUBSTRING(
            DiaChi,
            CHARINDEX(',', DiaChi) + 1,
            CHARINDEX(',', DiaChi, CHARINDEX(',', DiaChi) + 1) - CHARINDEX(',', DiaChi) - 1
          )
        )) AS name
      FROM XAPHUONG
      WHERE DiaChi LIKE @province
    `);
  return result.recordset;
};

const getWardsByProvinceAndDistrict = async (province, district) => {
  const result = await pool
    .request()
    .input("province", sql.NVarChar, `%${province}%`)
    .input("district", sql.NVarChar, `%${district}%`).query(`
        SELECT DISTINCT
          LTRIM(RTRIM(SUBSTRING(DiaChi, 1, CHARINDEX(',', DiaChi) - 1))) AS name
        FROM XAPHUONG
        WHERE DiaChi LIKE @province AND DiaChi LIKE @district
      `);
  return result.recordset;
};

module.exports = {
  getProvinces,
  getDistrictsByProvince,
  getWardsByProvinceAndDistrict,
};
