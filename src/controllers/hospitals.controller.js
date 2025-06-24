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

module.exports = {
  getHospitalsPrivateController,
  getHospitalsPublicController,
};
