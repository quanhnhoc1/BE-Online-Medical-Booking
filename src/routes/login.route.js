const express = require("express");
const loginController = require("../controllers/login.controller");

const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();

router.route("/").get(loginController.getUser).all(methodNotAllowed);

// router.route("/:id");

module.exports = router;
