const makeHospitalsServices = require("../services/hospitalsServices/hospitals.Services");
const ApiError = require("../api-error");

async function getHospitalsPrivateController(req, res, next) {
  try {
    const hospitalsPrivate = await makeHospitalsServices();
    const result = await hospitalsPrivate.getHospitalsPrivateServices();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, error.message));
  }
}
async function getHospitalsPublicController(req, res, next) {
  try {
    const hospitalsPublic = await makeHospitalsServices();
    const result = await hospitalsPublic.getHospitalsPublicServices();
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

async function getSpecialtiesWithHospitalIDController(req, res, next) {
  const hospitalsServices = await makeHospitalsServices();
  try {
    const { hospitalID } = req.params;
    const result =
      await hospitalsServices.getSpecialtiesWithHospitalIDServices(hospitalID);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

async function getDoctorFromSpecialtyIDServicesAndIDHospital(req, res, next) {
  const hospitalsServices = await makeHospitalsServices();
  try {
    const { specialtyID, hospitalID } = req.params;
    const result =
      await hospitalsServices.getDoctorFromSpecialtyIDServicesAndIDHospital(
        specialtyID,
        hospitalID
      );
    console.log("specialtyID:", specialtyID, "hospitalID:", hospitalID);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

module.exports = {
  getHospitalsPrivateController,
  getHospitalsPublicController,
  getSpecialtiesWithHospitalIDController,
  getDoctorFromSpecialtyIDServicesAndIDHospital,
};
