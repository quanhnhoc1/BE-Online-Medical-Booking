// // routes/adminRoutes.js
// const express = require("express");
// const { verifyToken } = require("../middlewares/auth.Middlewares");
// const { authorizeRoles } = require("../middlewares/roles.middlewares");

// const router = express.Router();

// // Chỉ cho phép role là "admin"
// router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Chào Admin!", user: req.user });
// });

// router.get("/", verifyToken, authorizeRoles("user"), (req, res) => {
//   res.json({ message: "Chào user!", user: req.user });
// });

// module.exports = router;
