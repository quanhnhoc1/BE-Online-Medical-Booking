const ApiError = require("../api-error");
const makeDoctorServices = require("../services/doctorServices/doctor.services");
async function getScheduleController(req, res, next) {
  try {
    const id = Number(req.params.doctorID);
    const doctorSchedule = await makeDoctorServices();
    const result = await doctorSchedule.getScheduleServices(id);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

module.exports = {
  getScheduleController,
};
