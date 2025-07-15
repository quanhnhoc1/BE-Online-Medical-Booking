const express = require("express");
const hospitalsController = require("../../controllers/hospitals.controller");
const { methodNotAllowed } = require("../../controllers/errors.controller");
const router = express.Router();

router
  .route("/get-hospitals-private")
  .get(hospitalsController.getHospitalsPrivateController)
  .all(methodNotAllowed);
router
  .route("/get-hospitals-public")
  .get(hospitalsController.getHospitalsPublicController)
  .all(methodNotAllowed);
router
  .route("/get-specialty-by-id/:hospitalID")
  .get(hospitalsController.getSpecialtiesWithHospitalIDController)
  .all(methodNotAllowed);
router
  .route("/get-doctor-by-specialty-and-hospital/:specialtyID/:hospitalID")
  .get(hospitalsController.getDoctorFromSpecialtyIDServicesAndIDHospital)
  .all(methodNotAllowed);
module.exports = router;
