const express = require("express");
const userController = require("../../controllers/user.controller");
const { methodNotAllowed } = require("../../controllers/errors.controller");
const { verifyToken } = require("../../middlewares/auth.Middlewares");
const doctorController = require("../../controllers/doctor.controller");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API người dùng (đăng ký, đăng nhập, hồ sơ, đổi mật khẩu)
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.route("/login").post(userController.handleLogin).all(methodNotAllowed);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Lỗi tạo tài khoản
 */
router.route("/register").post(userController.createUser).all(methodNotAllowed);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       401:
 *         description: Không có quyền truy cập
 */
router
  .route("/profile")
  .get(verifyToken, userController.getUserProfile)
  .all(methodNotAllowed);

/**
 * @swagger
 * /change-password:
 *   get:
 *     summary: Trang đổi mật khẩu (có thể dùng lại kiểu POST nếu có xử lý thực sự)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Hiển thị giao diện đổi mật khẩu (tùy backend xử lý gì)
 */
router.route("/change-password").get(userController.changePassword);

router
  .route("/get-schedule-by-doctor-id/:doctorID")
  .get(doctorController.getScheduleController)
  .all(methodNotAllowed);

router
  .route("/add-appointment/:doctorID&:specialtyID")
  .post(verifyToken, userController.addAppointmentByUserController)
  .all(methodNotAllowed);

router
  .route("/update-profile")
  .put(verifyToken, userController.updateUserProfile)
  .all(methodNotAllowed);
module.exports = router;
