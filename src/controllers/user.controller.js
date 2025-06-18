const makeUserServices = require("../services/UserServices/user.services");
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

async function getUserProfile(req, res, next) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    console.log(userID);
    const profile = await userServices.getUserProfileServices(userID); // truyền vào đây
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

async function handleLogin(req, res) {
  try {
    const userServices = await makeUserServices();

    const { email, password } = req.body;

    const userLoginResult = await userServices.userLogin(email, password);

    if (userLoginResult.success) {
      const user = userLoginResult.user;
      const token = jwt.sign(
        {
          id: user.ID,
          fullname: user.FULL_NAME,
          email: user.EMAIL,
          phone: user.PHONE,
          address: user.ADDRESS,
          gender: user.GENDER,
          birthDate: user.BIRTHDATE,
          role: user.ROLE,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log("Token generated:", token);
      // Return success message and token
      return res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.ID,
          email: user.EMAIL,
          fullName: user.FULL_NAME,
          phone: user.PHONE,
          address: user.ADDRESS,
          gender: user.GENDER,
          birthDate: user.BIRTH_DATE,
          role: user.ROLE,
        },
      });
    } else {
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
  handleLogin,
  changePassword,
  getUserProfile,
};
