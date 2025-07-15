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

  async function getSpecialtiesWithHospitalIDServices(hospitalID) {
    try {
      const request = pool.request();
      request.input("hospitalID", sql.VarChar(20), hospitalID);
      const result = await request.query(
        "EXEC GetSpecialtiesByHospital @HospitalID = @hospitalID;"
      );
      if (result.recordset.length === 0) {
        throw new Error("No specialties found for this hospital");
      }
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching hospitals: ${err.message}`);
    }
  }

  async function getDoctorFromSpecialtyIDServicesAndIDHospital(
    specialtyID,
    hospitalID
  ) {
    try {
      const request = pool.request();
      request.input("SpecialtyID", sql.VarChar(20), specialtyID);
      request.input("HospitalID", sql.VarChar(20), hospitalID);
      const result = await request.query(`
        EXEC GetDoctorsByHospitalAndSpecialty 
    @HospitalID = ${hospitalID},
    @SpecialtyID = ${specialtyID};
      `);
      console.log("Querying doctors with:", specialtyID, hospitalID);

      if (result.recordset.length === 0) {
        throw new Error("No doctors found for this specialty");
      }
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching doctors: ${err.message}`);
    }
  }
  return {
    getHospitalsPrivateServices,
    getHospitalsPublicServices,
    getSpecialtiesWithHospitalIDServices,
    getDoctorFromSpecialtyIDServicesAndIDHospital,
  };
}

module.exports = makeHospitalsServices;
