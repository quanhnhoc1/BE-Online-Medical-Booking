const ApiError = require("../api-error");
const makeDoctorServices = require("../services/doctor.services");
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

async function getDoctorWorkTimeController(req, res, next) {
  try {
    const doctorID = req.params.doctorID; // lấy từ URL params
    const doctorSchedule = await makeDoctorServices();
    const result =
      await doctorSchedule.getDoctorWorkTimeByDoctorIDService(doctorID);
    // Nếu result là mảng (nhiều lịch), format từng phần tử
    let formatted = [];
    if (Array.isArray(result)) {
      formatted = result.map((item) => ({
        start_time: formatTime(item.START_TIME),
        end_time: formatTime(item.END_TIME),
        date: formatDate(item.DATE_OF_MONTH),
        status: item.STATUS,
      }));
    } else if (result) {
      // Nếu chỉ trả về 1 object
      formatted = [
        {
          start_time: formatTime(result.START_TIME),
          end_time: formatTime(result.END_TIME),
          date: formatDate(result.DATE_OF_MONTH),
          status: result.STATUS,
        },
      ];
    }
    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function getAllDoctorsController(req, res, next) {
  try {
    const doctorServices = await makeDoctorServices();
    const result = await doctorServices.getAllDoctors();
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

async function deleteDoctorByIdController(req, res, next) {
  try {
    const doctorID = req.params.doctorID;
    const doctorServices = await makeDoctorServices();
    const result = await doctorServices.deleteDoctorById(doctorID);
    console.log(result.success);
    if (result.success == false) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or already deleted.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully controller.",
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

async function updateDoctorProfileController(req, res, next) {
  try {
    const doctorID = req.params.doctorID;
    const doctorPayLoad = req.body;
    const doctorServices = await makeDoctorServices();
    const result = await doctorServices.updateDoctorProfile(
      doctorID,
      doctorPayLoad
    );
    console.log("Update result:", result);
    if (result.updateDoctor > 0 || result.updateAccount > 0) {
      return res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully controller.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Doctor profile updated not success controller.",
    });
  } catch (err) {
    console.error("Error updating doctor profile:", err);
    return next(new ApiError(500, err.message));
  }
}

async function addNewDoctorController(req, res, next) {
  try {
    const doctorPayLoad = req.body;
    const doctorServices = await makeDoctorServices();
    const result = await doctorServices.addNewDoctor(doctorPayLoad);

    if (result.success === true) {
      return res.status(200).json({
        success: true,
        message: "Doctor added successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Doctor not added.",
    });
  } catch (err) {
    console.error(err);
  }
}
async function getDoctorsByHospitalIDController(req, res, next) {
  try {
    const hospitalID = req.params.hospitalID;
    const doctorServices = await makeDoctorServices();
    const result = await doctorServices.getDoctorsByHospitalID(hospitalID);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}
module.exports = {
  getScheduleController,
  getScheduleIDController,
  getDoctorWorkTimeController,
  getAllDoctorsController,
  deleteDoctorByIdController,
  updateDoctorProfileController,
  addNewDoctorController,
  getDoctorsByHospitalIDController,
};
