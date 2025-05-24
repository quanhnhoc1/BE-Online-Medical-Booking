const express = require("express");
const cors = require("cors");
// const { poolConnect, pool, sql } = require("../database.config");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

// connect database
const { conn, sql, pool } = require("../connect");
const app = express();
const loginRouter = require("./routes/login.route");
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json("welcome to my app");
});

// app.get("/", async (req, res) => {
//   try {
//     await poolConnect; // đảm bảo kết nối đã được tạo
//     const result = await pool.request().query("SELECT 1 AS result");
//     res.json("asc");
//   } catch (err) {
//     console.error("SQL error", err);
//     res.status(500).send("Database error");
//   }
// });

app.use("/login", loginRouter);
app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
