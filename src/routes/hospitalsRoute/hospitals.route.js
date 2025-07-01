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
  .route("/get-specitalties-by-id/:hospitalID")
  .get(hospitalsController.getSpecialtiesWithHospitalIDController)
  .all(methodNotAllowed);
module.exports = router;
