const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Đặt lịch khám bệnh",
      version: "1.0.0",
      description: "Tài liệu API dùng cho hệ thống NodeJS - VueJS",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [path.resolve(__dirname, "./src/routes/**/*.js")], // sửa chính xác đường dẫn
};

const specs = swaggerJsdoc(options);
console.log("Swagger paths loaded:", specs.paths);
console.log("Swagger dirname:", __dirname);

module.exports = {
  swaggerUi,
  specs,
};
