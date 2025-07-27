const { pool, sql } = require("../../connect");
async function makeDoctorServices() {
  async function getScheduleServices(doctorID) {
    try {
      const request = pool.request();
      console.log("Querying schedule for doctorID:", doctorID);
      const result = await request
        .input("doctorID", sql.Int, doctorID)
        .query("select * from schedules where DOCTOR_ID = @doctorID;");
      console.log("Result:", result.recordset);
      if (result.recordset.length === 0) {
        throw new Error("No schedule found for this doctor");
      }
      const days = result.recordset.map((row) => row.DAY_OF_WEEK);
      // const scheduleID = result.recordset.map((row) => row.ID);
      const months = result.recordset.map((row) => {
        if (!row.DATE_OF_MONTH) return null;
        // Nếu là object Date
        if (row.DATE_OF_MONTH instanceof Date) {
          return row.DATE_OF_MONTH.toISOString().slice(0, 10);
        }
        // Nếu là chuỗi
        return row.DATE_OF_MONTH.toString().slice(0, 10);
      });
      return { days, months };
    } catch (err) {
      throw new Error(`Error fetching schedule: ${err.message}`);
    }
  }
  async function getScheduleIDByDateServices(DATE_OF_MONTH) {
    try {
      const request = pool
        .request()
        .input("DATE_OF_MONTH", sql.Date, DATE_OF_MONTH);

      const result = await request.query(
        `SELECT ID FROM SCHEDULES WHERE DATE_OF_MONTH = @DATE_OF_MONTH`
      );

      return result.recordset[0]?.ID || null; //
    } catch (err) {
      throw new Error(`Error fetching schedule ID: ${err.message}`);
    }
  }
  async function getDoctorWorkTimeByDoctorIDService(doctorID) {
    try {
      const request = pool.request().input("doctorID", sql.Int, doctorID);
      const result = await request.query(
        `EXEC getStartEnd_timeByDoctorID @doctorID = @doctorID;`
      );
      // console.log("getDoctorWorkTimeByDoctorIDService result:", result);
      return result.recordset || null;
    } catch (err) {
      console.error("Error fetching doctor work time:", err);
      throw new Error(`Error fetching doctor work time: ${err.message}`);
    }
  }

  async function getAllDoctors() {
    try {
      const request = pool.request();
      const result = await request.query("exec getAllDoctors");
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching all doctors: ${err.message}`);
    }
  }

  async function deleteDoctorById(doctorID) {
    try {
      const request = pool.request().input("doctorID", sql.Int, doctorID);
      const result = await request.query(
        "exec deleteDoctorByID @DOCTOR_ID = @doctorID"
      );
      const affectedRows = result.recordset[0]?.affectedRows || 0;
      console.log(affectedRows);
      if (affectedRows > 0) {
        return {
          success: true,
          message: "Doctor deleted successfully.",
        };
      } else {
        return {
          success: false,
          message: "Doctor not found or already deleted.",
        };
      }
    } catch (err) {
      throw new Error(`Error deleting doctor: ${err.message}`);
    }
  }

  async function updateDoctorProfile(doctorID, doctorPayLoad) {
    try {
      const request = pool
        .request()
        .input("doctorID", sql.Int, doctorID)
        .input("fullName", sql.NVarChar(255), doctorPayLoad.fullName)
        .input("phone", sql.VarChar(20), doctorPayLoad.phone)
        .input("email", sql.VarChar(100), doctorPayLoad.email)
        .input("degree", sql.NVarChar(100), doctorPayLoad.degree)
        .input("specialtyID", sql.NVarChar(255), doctorPayLoad.specialtyID)
        .input("hospitalID", sql.NVarChar(255), doctorPayLoad.hospitalID)
        .input("status", sql.VarChar(10), doctorPayLoad.status)
        .input("address", sql.NVarChar(255), doctorPayLoad.address);

      const result = await request.query(
        `EXEC updateDoctorInfor
    @doctorID = @doctorID,
    @fullName = @fullName,
    @phone = @phone,
    @hospitalID = @hospitalID,
    @specialtyID = @specialtyID,
    @degree = @degree,
    @email = @email,
    @status = @status,
    @address = @address`
      );

      console.log("Update result:", result.recordset[0]?.affectedDoctorProfile);

      return {
        updateDoctor: result.recordset[0]?.affectedDoctorProfile || 0,
        updateAccount: result.recordset[0]?.affectedAccount || 0,
      };
    } catch (err) {
      throw new Error(`Error updating doctor profile: ${err.message}`);
    }
  }
  async function addNewDoctor(doctorPayLoad) {
    try {
      const request = pool
        .request()
        .input("fullName", sql.NVarChar(255), doctorPayLoad.fullName)
        .input("email", sql.VarChar(100), doctorPayLoad.email)
        .input("phone", sql.VarChar(20), doctorPayLoad.phone)
        .input("gender", sql.VarChar(10), doctorPayLoad.gender)
        .input("degree", sql.NVarChar(100), doctorPayLoad.degree)
        .input("hospitalID", sql.NVarChar(255), doctorPayLoad.hospitalID)
        .input("specialtyID", sql.NVarChar(255), doctorPayLoad.specialtyID)
        .input("address", sql.NVarChar(255), doctorPayLoad.address)
        .input("desc", sql.NVarChar(255), doctorPayLoad.desc);
      // .input("birthday", sql.Date, doctorPayLoad.birthday);
      const result = await request.query(
        `exec addNewDoctorRole   @fullName = @fullName,
    @email = @email,
    @phone = @phone,
    @gender = @gender,
    @degree = @degree,
    @hospitalID = @hospitalID,
    @specialtyID = @specialtyID,
    @desc = @desc,
    @address = @address`
        // @birthday = @birthday;`
      );
      const affectedRows = result.recordset[0]?.affectedRows || 0;
      if (affectedRows > 0) {
        return {
          success: true,
          message: "Doctor added successfully.",
        };
      } else {
        return {
          success: false,
          message: "Doctor not added.",
        };
      }
    } catch (err) {
      throw new Error(`Error adding new doctor: ${err.message}`);
    }
  }
  async function getDoctorsByHospitalID(hospitalID) {
    try {
      const request = pool
        .request()
        .input("hospitalID", sql.NVarChar(10), hospitalID);
      const result = await request.query(
        "exec getDoctorsByHospitalID @hospitalID = @hospitalID"
      );
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching doctors by hospital ID: ${err.message}`);
    }
  }
  return {
    getScheduleServices,
    getScheduleIDByDateServices,
    getDoctorWorkTimeByDoctorIDService,
    getAllDoctors,
    deleteDoctorById,
    updateDoctorProfile,
    addNewDoctor,
    getDoctorsByHospitalID,
  };
}

module.exports = makeDoctorServices;
