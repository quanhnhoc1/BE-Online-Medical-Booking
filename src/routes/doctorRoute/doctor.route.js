const express = require("express");
const router = express.Router();
const doctorController = require("../../controllers/doctor.controller");
const { methodNotAllowed } = require("../../controllers/errors.controller");

router
  .route("/get-word-time-doctor/:doctorID")
  .get(doctorController.getDoctorWorkTimeController)
  .all(methodNotAllowed);

module.exports = router;
