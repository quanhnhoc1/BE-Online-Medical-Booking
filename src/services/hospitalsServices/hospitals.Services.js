const { pool, sql } = require("../../../connect");
async function makeHospitalsServices() {
  async function getHospitalsPrivateServices() {
    try {
      const request = pool.request();
      const result = await request.query(
        " select * from hospitals where type = 'private';"
      );

      if (result.recordset.length === 0) {
        throw new Error("No hospitals found");
      }

      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching hospitals: ${err.message}`);
    }
  }

  async function getHospitalsPublicServices() {
    try {
      const request = pool.request();
      const result = await request.query(
        " select * from hospitals where type = 'public';"
      );
      if (result.recordset.length === 0) {
        throw new Error("No hospitals found");
      }
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching hospitals: ${err.message}`);
    }
  }
  return {
    getHospitalsPrivateServices,
    getHospitalsPublicServices,
  };
}

module.exports = makeHospitalsServices;
