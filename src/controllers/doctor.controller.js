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

async function getScheduleIDController(req, res) {
  try {
    const date = req.body.date; // nếu gửi qua URL dạng /schedule-id/:date
    const doctorScheduleID = await makeDoctorServices();
    const result = await doctorScheduleID.getScheduleIDByDateServices(date);

    return res.status(200).json({ id: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getScheduleController,
  getScheduleIDController,
};
