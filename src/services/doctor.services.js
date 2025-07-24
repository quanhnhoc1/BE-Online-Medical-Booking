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
  return {
    getScheduleServices,
    getScheduleIDByDateServices,
    getDoctorWorkTimeByDoctorIDService,
  };
}

module.exports = makeDoctorServices;
