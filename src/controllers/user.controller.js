const makeUserServices = require("../services/userServices/user.services");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const { OAuth2Client } = require("google-auth-library");
const { sql, conn } = require("../../connect");

// Khởi tạo Google OAuth client với fallback
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "419237871729-6cv0dkr0tqeqhtmgd734t0srv2vc0mp9.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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
          fullname: user.fullname,
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
          fullName: user.FULLNAME,
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
    const { profileID, doctorID, scheduleID } = req.query; // lấy từ URL params

    // Gọi service để thêm lịch hẹn mới
    const response = await userServices.addNewAppointmentService(
      profileID,
      doctorID,
      scheduleID
    );
    console.log(
      "profileID:",
      profileID,
      "doctorID:",
      doctorID,
      "scheduleID:",
      scheduleID,
      "affectedRowus"
    );
    // Kiểm tra kết quả trả về từ service
    const affectedRows = response?.recordset?.[0]?.affectedRows;
    console.log(affectedRows);
    console.log("recordset:", response.recordset);
    console.log("recordsets:", response.recordsets);

    const affectedRows1 = response?.recordset?.[0]?.affectedRows;
    const affectedRows2 = response?.recordsets?.[0]?.[0]?.affectedRows;

    console.log("affectedRows1:", response);
    console.log("affectedRows2:", response.success);
    if (response && response.success) {
      // Thành công
      return res.status(201).json({
        success: true,
        message: "Đặt lịch hẹn thành công!",
        data: response.data,
      });
    } else {
      // Không có dòng nào bị ảnh hưởng (thất bại)
      return res.status(400).json({
        success: false,
        message: "Đặt lịch hẹn thất bại. Vui lòng kiểm tra lại thông tin!",
      });
    }
  } catch (err) {
    console.error("Error adding new appointment:", err);
    return res.status(500).json({ message: err.message });
  }
}
async function getListBookingTicketController(req, res) {
  try {
    const userServices = await makeUserServices();
    const userID = parseInt(req.user.id, 10); // lấy từ token JWT
    const appointmentStatus = req.query.apStatus;
    const result = await userServices.getListBookingTicketService(
      userID,
      appointmentStatus
    );
    console.log("result:", result);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error getting list booking ticket:", err);
  }
}
async function cancelAppointmentController(req, res) {
  try {
    const userServices = await makeUserServices();
    // const userProfileID = parseInt(req.user.id, 10); // lấy từ token JWT
    const { userProfileID, doctorID, scheduleID } = req.body;
    const result = await userServices.cancelAppointmentService(
      userProfileID,
      doctorID,
      scheduleID
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error canceling appointment:", err);
    return res.status(500).json({ message: err.message });
  }
}

const handleGoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    console.log("Received token type:", typeof token);
    console.log("Token length:", token.length);
    console.log("Token starts with:", token.substring(0, 50));

    let userInfo = null;

    // Kiểm tra xem token có phải là ID token hay authorization code
    if (token.includes(".")) {
      // ID Token flow
      console.log("Processing as ID token");
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_ID,
        });
        userInfo = ticket.getPayload();
      } catch (idTokenError) {
        console.error("ID token verification failed:", idTokenError);
        return res.status(400).json({ message: "Invalid ID token" });
      }
    } else {
      // Authorization Code flow
      console.log("Processing as authorization code");
      try {
        // Exchange authorization code for tokens
        const { tokens } = await client.getToken(token);
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: GOOGLE_CLIENT_ID,
        });
        userInfo = ticket.getPayload();
      } catch (codeError) {
        console.error("Authorization code exchange failed:", codeError);
        return res.status(400).json({ message: "Invalid authorization code" });
      }
    }

    const { email, name, picture, sub: googleId } = userInfo;

    // Check if user exists in database
    const pool = await conn;
    const userCheckQuery = `
      SELECT * FROM ACCOUNTS 
      WHERE EMAIL = @email
    `;

    const userCheckResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(userCheckQuery);

    let user = userCheckResult.recordset[0];

    if (!user) {
      // Create new user if doesn't exist
      const insertUserQuery = `
        INSERT INTO ACCOUNTS (EMAIL, PASSWORD, ROLE, CREATE_AT)
        OUTPUT INSERTED.*
        VALUES (@email, NULL, 'user', GETDATE())
      `;

      const insertResult = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(insertUserQuery);

      user = insertResult.recordset[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user.ACCOUNT_ID,
        email: user.EMAIL,
        role: user.ROLE,
        fullname: name, // Sử dụng name từ Google
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user.ACCOUNT_ID,
        email: user.EMAIL,
        fullName: name, // Sử dụng name từ Google
        role: user.ROLE,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

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
  getListBookingTicketController,
  cancelAppointmentController,
  handleGoogleLogin,
};
