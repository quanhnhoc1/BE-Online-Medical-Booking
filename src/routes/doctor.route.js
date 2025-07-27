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
router
  .route("/update-doctor-by-id/:doctorID")
  .post(doctorController.updateDoctorProfileController)
  .all(methodNotAllowed);
router
  .route("/update-doctor-profile/:doctorID")
  .put(doctorController.updateDoctorProfileController)
  .all(methodNotAllowed);

router
  .route("/add-new-doctor-profile")
  .post(doctorController.addNewDoctorController)
  .all(methodNotAllowed);
router
  .route("/get-doctors-by-hospital-id/:hospitalID")
  .get(doctorController.getDoctorsByHospitalIDController)
  .all(methodNotAllowed);
module.exports = router;
