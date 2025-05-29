const makeUserServices = require("../services/user.services");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const JWT_SECRET = "1111";
async function createUser(req, res, next) {
  try {
    const userServices = await makeUserServices();
    const result = await userServices.registerAccount(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const userServices = await makeUserServices();

    const { email, password } = req.body;

    const userLoginResult = await userServices.userLogin(email, password);

    // Handle login success or failure based on the service result
    if (userLoginResult.success) {
      // If login is successful, generate JWT token
      const user = userLoginResult.user; // Get user object from the service result
      const token = jwt.sign(
        {
          id: user.ID,
          email: user.EMAIL,
          role: user.ROLE,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      // Return success message and token
      return res
        .status(200)
        .json({ message: "Đăng nhập thành công", token, user: user }); // Optionally include user info
    } else {
      // If login failed, return the failure message from the service
      return res.status(401).json(userLoginResult);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi server khi đăng nhập" });
  }
}

async function changePassword(req, res) {
  return res.send("change password page");
}

module.exports = {
  createUser,
  login,
  changePassword,
};
