const { pool, sql } = require("../../../connect");
async function makeDoctorServices() {
  async function getScheduleServices(doctorID) {
    try {
      const request = pool.request();
      const result = await request
        .input("doctorID", sql.Int, doctorID)
        .query("select * from schedules where DOCTOR_ID = @doctorID;");
      if (result.recordset.length === 0) {
        throw new Error("No schedule found for this doctor");
      }
      const days = result.recordset.map((row) => row.DAY_OF_WEEK);
      const months = result.recordset.map((row) => {
        if (!row.DATE_OF_MONTH) return null;
        // Nếu là object Date
        if (row.DATE_OF_MONTH instanceof Date) {
          return row.DATE_OF_MONTH.toISOString().slice(0, 10);
        }
        // Nếu là chuỗi
        return row.DATE_OF_MONTH.toString().slice(0, 10);
      });
      // res.json({ doctorID, day_of_week: days });
      // console.log(days);
      // return result.recordset;
      return { days, months };
    } catch (err) {
      throw new Error(`Error fetching schedule: ${err.message}`);
    }
  }

  return { getScheduleServices };
}

module.exports = makeDoctorServices;
