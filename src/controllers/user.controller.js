const makeUserServices = require("../services/userServices/user.services");
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
    const profile = await userServices.getUserProfileServices(userID);

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
          id: user.ACCOUNT_ID,
          fullname: user.FULL_NAME,
          email: user.EMAIL,
          phone: user.PHONE,
          address: user.ADDRESS,
          gender: user.GENDER,
          birthDate: user.BIRTH_DATE,
          role: user.ROLE,
          ethnic: user.ETHNIC,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log("Token generated:", token);
      console.log("User data from login:", user);
      // Return success message and token
      return res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          us: "asdasd0",
          id: user.ACCOUNT_ID,
          email: user.EMAIL,
          fullName: user.FULL_NAME,
          phone: user.PHONE,
          address: user.ADDRESS,
          gender: user.GENDER,
          birthDate: user.BIRTH_DATE,
          role: user.ROLE,
          ethnic: user.ETHNIC,
          cccd: user.CCCD,
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
async function addAppointmentByUserController(req, res, next) {
  try {
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    const { doctorID, specialtyID } = req.params; // lấy từ URL params
    const { dateOfMonth, appointmentDate, startTime, endTime } = req.body;
    console.log("req.body:", req.body);

    const userServices = await makeUserServices();
    const userID1 = parseInt(req.user.id, 10); // lấy từ token JWT
    console.log(userID1);

    // Validate specialtyID is a string
    if (!specialtyID || typeof specialtyID !== "string") {
      return res.status(400).json({
        message: "specialtyID must be a valid string",
      });
    }

    const result = await userServices.addAppointmentByUser(
      userID,
      doctorID,
      dateOfMonth,
      appointmentDate,
      specialtyID,
      startTime,
      endTime
    );
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
}

// async function updateUserProfile(req, res) {
//   try {
//     const userServices = await makeUserServices();
//     const userID = parseInt(req.user.id, 10);
//     const userPayload = req.body;
//     const result = await userServices.UpdateProfileByUserID(
//       userID,
//       userPayload
//     );
//     console.log("userPayload:", userPayload);
//     console.log("result:", result);
//     if (!result || !result.result || result.result.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cập nhật thất bại",
//         data: result.result || [],
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Cập nhật thông tin thành công",
//         data: result.result,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }
async function updateUserProfile(req, res) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // ID từ token
    const userPayload = req.body;

    const result = await userServices.UpdateProfileByUserID(
      userID,
      userPayload
    );
    console.log("userPayload:", userPayload);
    console.log("result:", result);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || "Cập nhật thất bại",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message || "Cập nhật thành công",
      data: result.result || [],
    });
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
}

async function GetUserWithUserIDAndIDProfileController(req, res) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    console.log("userid:" + userID);
    console.log("profileID:" + req.query.profileID);
    const profile = await userServices.getUserWithUserIDAndIDProfileService(
      userID,
      req.query.profileID
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

async function deleteUserProfileByIDController(req, res) {
  try {
    const result = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    const profileID = parseInt(req.query.profileID, 10); // lấy từ query params
    const response = await result.deleteUserProfileByIDService(
      userID,
      profileID
    );
    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data || null,
    });
  } catch (err) {
    console.error("Error deleting user profile:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function addNewUserProfileController(req, res) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    const userProfilePayload = req.body; // lấy từ request body
    console.log("userProfilePayload:", userProfilePayload);

    const response = await userServices.addNewUserProfileService(
      userID,
      userProfilePayload
    );

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message || "Thêm hồ sơ thất bại",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: response.message || "Thêm hồ sơ thành công",
      data: response.result || [],
    });
  } catch (err) {
    console.error("Error adding new user profile:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message,
    });
  }
}
async function addNewAppointmentController(req, res) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    const { doctorID, specialtyID } = req.params; // lấy từ URL params
    const reponse = await userServices.addNewAppointmentService(
      userID,
      doctorID,
      specialtyID
    );
  } catch (err) {
    console.error("Error adding new appointment:", err);
    return res.status(500).json({ message: err.message });
  }
}
module.exports = {
  createUser,
  handleLogin,
  changePassword,
  GetUserWithUserIDAndIDProfileController,
  addAppointmentByUserController,
  updateUserProfile,
  getUserProfile,
  deleteUserProfileByIDController,
  addNewUserProfileController,
  addNewAppointmentController,
};
