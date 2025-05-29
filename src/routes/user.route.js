const express = require("express");
const userController = require("../controllers/user.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const router = express.Router();
router.route("/login").post(userController.login).all(methodNotAllowed);
router.route("/register").post(userController.createUser).all(methodNotAllowed);
router
  .route("/change-password")
  .get(userController.changePassword)
  .all(methodNotAllowed);

module.exports = router;
