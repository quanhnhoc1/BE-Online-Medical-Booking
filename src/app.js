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
const userRoute = require("./routes/user.route");
// const authRoute = require("./routes/auth.routes");
app.use(cors());
app.use(express.json());

// Remove the conflicting root route
// app.get("/", async (req, res) => {
//   res.json("welcome to my app");
// });

app.use("/", userRoute);
// app.use("/", authRoute);

app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
