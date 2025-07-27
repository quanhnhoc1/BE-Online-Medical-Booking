const ApiError = require("../api-error");
const makeSchedulesServices = require("../services/schedulesServices");

async function addNewSchedulesController(req, res, next) {
  try {
    console.log("=== BACKEND CONTROLLER DEBUG ===");
    console.log("Controller: Request body:", req.body);

    const doctorID = req.body.doctorID;
    const schedulesPayLoad = {
      dayOfWeek: req.body.dayOfWeek,
      dayOfMonth: req.body.dayOfMonth,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      doctorPrice: req.body.doctorPrice,
    };

    console.log("Controller: Doctor ID:", doctorID, "Type:", typeof doctorID);
    console.log("Controller: Schedules payload:", schedulesPayLoad);

    const schedulesServices = await makeSchedulesServices();
    const result = await schedulesServices.addNewSchedules(
      doctorID,
      schedulesPayLoad
    );

    console.log("Controller: Service result:", result);
    console.log("=== END BACKEND CONTROLLER DEBUG ===");

    return res.status(200).json(result);
  } catch (err) {
    console.error("Controller: Error:", err);
    return next(new ApiError(500, err.message));
  }
}

module.exports = {
  addNewSchedulesController,
};
