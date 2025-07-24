const express = require("express");
const searchKeyWordController = require("../controllers/search.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();

router
  .route("/search-keyword")
  .post(searchKeyWordController.searchKeywordController)
  .all(methodNotAllowed);

module.exports = router;
