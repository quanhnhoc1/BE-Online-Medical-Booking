const express = require("express");
const cors = require("cors");
const hospitalsRoute = require("./routes/hospitalsRoute/hospitals.route");
const { swaggerUi, specs } = require("../swagger");
// const { poolConnect, pool, sql } = require("../database.config");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

// connect database
const { conn, sql, pool } = require("../connect");
const app = express();
const userRoute = require("./routes/userRoute/user.route");
const authRoute = require("./routes/auth.routes");
const addressRoute = require("./routes/address.route");
app.use(cors());
app.use(express.json());

// Remove the conflicting root route
// app.get("/", async (req, res) => {
//   res.json("welcome to my app");
// });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", addressRoute);
app.use("/", hospitalsRoute);
app.use("/", userRoute);
app.use("/", authRoute);

// app.use("/api", userRoute);
app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
