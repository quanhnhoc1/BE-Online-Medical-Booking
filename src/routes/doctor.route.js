const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

router
  .route("/get-word-time-doctor/:doctorID")
  .get(doctorController.getDoctorWorkTimeController)
  .all(methodNotAllowed);
router
  .route("/get-all-doctors")
  .get(doctorController.getAllDoctorsController)
  .all(methodNotAllowed);
router
  .route("/delete-doctor-by-id/:doctorID")
  .get(doctorController.deleteDoctorByIdController)
  .all(methodNotAllowed);
module.exports = router;
