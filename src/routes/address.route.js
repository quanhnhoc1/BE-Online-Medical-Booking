const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/address.controller");

router.get("/provinces", AddressController.getProvinces);
router.get("/districts", AddressController.getDistricts);
router.get("/wards", AddressController.getWards);

module.exports = router;
