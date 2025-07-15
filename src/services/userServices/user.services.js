const { pool, sql } = require("../../../connect");
const bcrypt = require("bcrypt");

async function makeUserServices() {
  async function getUserProfileServices(userID) {
    try {
      const request = pool.request().input("UserID", sql.Int, userID);

      const result = await request.query(
        "EXEC GetUserProfileByID @UserID = @UserID;"
      );

      if (result.recordset.length === 0) {
        throw new Error("User not found");
      }

      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching user profile: ${error.message}`);
    }
  }

  async function registerAccount(userPayload) {
    try {
      // Validate required fields
      if (!userPayload || !userPayload.password || !userPayload.email) {
        throw new Error(
          "Missing required fields: email and password are required"
        );
      }

      const numberHash = 10;
      const hashedPassword = await bcrypt.hash(
        userPayload.password,
        numberHash
      );

      const request = pool
        .request()
        .input("FullName", sql.NVarChar(200), userPayload.fullName || "")
        .input("Email", sql.VarChar(100), userPayload.email)
        .input("Password", sql.VarChar(255), hashedPassword)
        .input("Phone", sql.VarChar(20), userPayload.phone || "")
        .input("Gender", sql.VarChar(10), userPayload.gender || "")
        .input("BirthDate", sql.Date, userPayload.birthDate || null)
        .input("Address", sql.NVarChar(200), userPayload.address || "");

      const result = await request.query(`
        EXEC AddNewUserAccount
        @FullName = @FullName,
        @Email = @Email,
        @Password = @Password,
        @Phone = @Phone,
        @Gender = @Gender,
        @BirthDate = @BirthDate,
        @Address = @Address;
      `);

      return {
        success: true,
        message: "User registered successfully",
      };
    } catch (error) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }

  async function userLogin(loginName, password) {
    try {
      const request = pool
        .request()
        .input("Email", sql.VarChar(100), loginName);

      const result = await request.query(`
          SELECT acc.*, up.PHONE, up.ADDRESS, up.GENDER, up.BIRTH_DATE, up.ETHNIC, up.CCCD
          FROM accounts acc
          LEFT JOIN USER_PROFILES up ON acc.ACCOUNT_ID = up.USER_ID
          WHERE acc.Email = @Email
        `);

      const user = result.recordset[0];
      if (!user) return { success: false, message: "Email không tồn tại" };

      const isMatch = await bcrypt.compare(password, user.PASSWORD);
      if (!isMatch) return { success: false, message: "Sai mật khẩu" };

      // delete user.PASSWORD;

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  }

  async function changePassword(req, res) {
    return res.send("change as");
  }
  async function addAppointmentByUser(
    userID,
    doctorID,
    dateOfMonth,
    appointmentDate,
    specialtyID,
    startTime,
    endTime
  ) {
    // Validate and convert parameters
    const userId = parseInt(userID, 10);
    const doctorId = parseInt(doctorID, 10);

    if (isNaN(userId) || isNaN(doctorId)) {
      throw new Error("USER_ID and DOCTOR_ID must be valid numbers");
    }

    // Validate specialtyID is a string
    if (!specialtyID || typeof specialtyID !== "string") {
      throw new Error("SPECIALTY_ID must be a valid string");
    }

    // Validate and format time parameters
    const validateTimeFormat = (timeStr) => {
      if (!timeStr || typeof timeStr !== "string") {
        throw new Error("Time must be a valid string");
      }

      // Check if time format is HH:MM:SS or HH:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
      if (!timeRegex.test(timeStr)) {
        throw new Error("Time must be in format HH:MM:SS or HH:MM");
      }

      // Ensure time has seconds part
      if (timeStr.split(":").length === 2) {
        timeStr += ":00";
      }

      return timeStr;
    };

    const formattedStartTime = validateTimeFormat(startTime);
    const formattedEndTime = validateTimeFormat(endTime);

    const request = pool.request();
    request.input("USER_ID", sql.Int, userId);
    request.input("DOCTOR_ID", sql.Int, doctorId);
    request.input("DATE_OF_MONTH", sql.Date, dateOfMonth);
    request.input("APPOINTMENT_DATE", sql.Date, appointmentDate);
    request.input("SPECIALTY_ID", sql.VarChar(20), specialtyID);
    request.input("START_TIME", sql.VarChar(8), formattedStartTime);
    request.input("END_TIME", sql.VarChar(8), formattedEndTime);
    try {
      const result = await request.query(`
        EXEC AddAppointmentByUser
        @USER_ID = @USER_ID,
        @DOCTOR_ID = @DOCTOR_ID,
        @DATE_OF_MONTH = @DATE_OF_MONTH,
        @APPOINTMENT_DATE = @APPOINTMENT_DATE,
        @SPECIALTY_ID = @SPECIALTY_ID,
        @START_TIME = @START_TIME,
        @END_TIME = @END_TIME;
      `);

      // Check if result exists and has recordset
      if (result && result.recordset && result.recordset.length > 0) {
        return result.recordset[0];
      } else {
        // If no recordset returned, return success message
        return {
          success: true,
          message: "Appointment added successfully",
        };
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      throw new Error(`Error adding appointment: ${error.message}`);
    }
  }

  async function UpdateProfileByUserID(UserID, userPayload) {
    try {
      const request = pool
        .request()
        .input("USER_ID", sql.Int, UserID)
        .input("FullName", sql.NVarChar(200), userPayload.fullName || "")
        .input("Email", sql.VarChar(100), userPayload.email || "")
        .input("Phone", sql.VarChar(20), userPayload.phone || "")
        .input("Gender", sql.VarChar(10), userPayload.gender || "")
        .input("BirthDate", sql.Date, userPayload.birthDate || null)
        .input("Address", sql.NVarChar(200), userPayload.address || "")
        .input("CCCD", sql.VarChar(20), userPayload.cccd || "")
        .input("Ethnic", sql.VarChar(50), userPayload.ethnic || "");

      const result = await request.query(`
        EXEC UpdateUserProfileByID
         @USER_ID = @USER_ID,
          @FullName = @FullName,
          @Email = @Email,
          @Phone = @Phone,
          @Gender = @Gender,
          @BirthDate = @BirthDate,
          @Address = @Address,
          @CCCD = @CCCD,
          @Ethnic = @Ethnic;
      `);

      return {
        success: true,
        message: "Cập nhật thông tin thành công",
        result: result.recordset,
      };
    } catch (err) {
      console.error("Error editing profile:", err);
      throw new Error(`Error editing profile: ${err.message}`);
    }
  }

  return {
    registerAccount,
    userLogin,
    changePassword,
    getUserProfileServices,
    addAppointmentByUser,
    UpdateProfileByUserID,
  };
}

module.exports = makeUserServices;
