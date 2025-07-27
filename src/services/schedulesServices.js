const { pool, sql } = require("../../connect");

async function makeSchedulesServices() {
  async function addNewSchedules(doctorID, schedulesPayLoad) {
    try {
      console.log("=== BACKEND SERVICE DEBUG ===");
      console.log("Service: Doctor ID:", doctorID, "Type:", typeof doctorID);
      console.log("Service: Schedules payload:", schedulesPayLoad);

      // Validate doctorID
      if (!doctorID || isNaN(parseInt(doctorID))) {
        throw new Error("Invalid doctorID");
      }

      const request = pool
        .request()
        .input("doctorID", sql.Int, parseInt(doctorID))
        .input("dayOfWeek", sql.VarChar(20), schedulesPayLoad.dayOfWeek)
        .input(
          "startTime",
          sql.Time(7),
          convertTimeStringToDate(schedulesPayLoad.startTime)
        )
        .input(
          "endTime",
          sql.Time(7),
          convertTimeStringToDate(schedulesPayLoad.endTime)
        )
        .input("dayOfMonth", sql.Date, schedulesPayLoad.dayOfMonth);
      // .input("notes", sql.VarChar(255), schedulesPayLoad.notes);

      console.log("Service: Executing stored procedure...");
      const result = await request.query(
        "EXEC AddNewSchedules @doctorID = @doctorID, @dayOfWeek = @dayOfWeek, @startTime = @startTime, @endTime = @endTime, @dayOfMonth = @dayOfMonth;"
      );

      const affectedRows = result.recordset[0]?.affectedRows || 0;
      console.log("Service: Affected rows:", affectedRows);
      console.log("=== END BACKEND SERVICE DEBUG ===");

      if (affectedRows > 0) {
        return {
          success: true,
          message: "Schedules added successfully.",
        };
      } else {
        return {
          success: false,
          message: "Schedules not added.",
        };
      }
    } catch (err) {
      console.error("Service: Error:", err);
      throw new Error(`Error adding schedules: ${err.message}`);
    }
  }

  function convertTimeStringToDate(timeStr) {
    return new Date(`1970-01-01T${timeStr}:00Z`);
  }

  return {
    addNewSchedules,
  };
}

module.exports = makeSchedulesServices;
