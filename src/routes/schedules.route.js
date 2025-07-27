const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedules.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

router
  .route("/add-new-schedules")
  .post(schedulesController.addNewSchedulesController)
  .all(methodNotAllowed);

module.exports = router;
