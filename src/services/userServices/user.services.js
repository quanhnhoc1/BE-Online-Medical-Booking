const { pool, sql } = require("../../../connect");
const bcrypt = require("bcrypt");

async function makeUserServices() {
  async function getUserProfileServices(userID) {
    try {
      const request = pool.request().input("UserID", sql.Int, userID);

      const result = await request.query(
        // "EXEC GetUserProfileByID @UserID = @UserID;"
        "SELECT * FROM USER_PROFILES where USER_ID = @UserID;"
      );

      if (result.recordset.length === 0) {
        throw new Error("User not found");
      }

      return result.recordset;
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
          SELECT acc.*, up.FULL_NAME, up.PHONE, up.ADDRESS, up.GENDER, up.BIRTH_DATE, up.ETHNIC, up.CCCD
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
      console.log("UpdateProfileByUserID - UserID:", UserID);
      console.log("UpdateProfileByUserID - userPayload:", userPayload);

      const request = pool
        .request()
        .input("USER_ID", sql.Int, UserID)
        .input("FullName", sql.NVarChar(200), userPayload.fullName || "")
        .input("Email", sql.VarChar(100), userPayload.email || "")
        .input("Phone", sql.VarChar(20), userPayload.phone || "")
        .input("Gender", sql.VarChar(10), userPayload.gender || "")
        .input("BirthDate", sql.Date, userPayload.birthDate ?? null)
        .input("Address", sql.NVarChar(200), userPayload.address || "")
        .input("CCCD", sql.VarChar(20), userPayload.cccd || "")
        .input("Ethnic", sql.VarChar(50), userPayload.ethnic || "")
        .input("ID_PROFILE", sql.Int, userPayload.idProfile ?? null)
        .input("JOB", sql.NVarChar(100), userPayload.job || "");

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
          @Ethnic = @Ethnic,
          @ID_PROFILE = @ID_PROFILE,
          @JOB = @JOB;
  
        SELECT * FROM USER_PROFILES WHERE USER_ID = @USER_ID AND ID_PROFILE = @ID_PROFILE;
      `);

      console.log("UpdateProfileByUserID - SQL result:", result);

      if (result.rowsAffected[0] > 0 && result.recordset.length > 0) {
        return {
          success: true,
          message: "Cập nhật thông tin thành công",
          result: result.recordset,
        };
      } else {
        return {
          success: false,
          message: "Không có bản ghi nào được cập nhật.",
          result: [],
        };
      }
    } catch (err) {
      console.error("Lỗi khi gọi stored procedure:", err);
      if (err.precedingErrors && err.precedingErrors.length > 0) {
        console.error("SQL preceding errors:", err.precedingErrors);
      }
      return {
        success: false,
        message: "Lỗi cập nhật hồ sơ: " + err.message,
        result: [],
      };
    }
  }

  async function getUserWithUserIDAndIDProfileService(userID, profileID) {
    try {
      const request = pool
        .request()
        .input("UserID", sql.Int, userID)
        .input("ProfileID", sql.Int, profileID);
      const result = await request.query(
        `exec GetUserWithUserIDAndIDProfile @USER_ID = @UserID, @ID_PROFILE = @ProfileID;`
      );
      if (result.recordset.length === 0) {
        throw { success: false, message: "User not found" };
      }
      return { success: true, data: result.recordset[0] };
    } catch (err) {
      console.error("Error fetching user with ID:", err);
      throw { success: false, message: err.message || err };
    }
  }

  async function deleteUserProfileByIDService(userID, ProfileID) {
    try {
      const request = pool
        .request()
        .input("UserID", sql.Int, userID)
        .input("ProfileID", sql.Int, ProfileID);
      const result = await request.query(`
        EXEC deleteUserProfile @USER_ID = @UserID, @ID_PROFILE = @ProfileID;
      `);
      console.log("rowsAffected:", result.rowsAffected);
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return {
          success: true,
          message: "User profile deleted successfully",
          data: result.recordset,
        };
      } else {
        return {
          success: false,
          message:
            "No user profile deleted. Profile may not exist or you do not have permission.",
          data: result.recordset || null,
        };
      }
    } catch (error) {
      throw new Error(`Error deleting user profile: ${error.message}`);
    }
  }
  async function addNewUserProfileService(userID, userProfilePayload) {
    try {
      const request = pool
        .request()
        .input("UserID", sql.Int, userID)
        .input("FullName", sql.NVarChar(200), userProfilePayload.fullName)
        .input("Phone", sql.VarChar(20), userProfilePayload.phone)
        .input("BirthDate", sql.Date, userProfilePayload.birthDate)
        .input("Address", sql.NVarChar(200), userProfilePayload.address)
        .input("ETHNIC", sql.NVarChar(20), userProfilePayload.ethnic)
        .input("CCCD", sql.VarChar(20), userProfilePayload.cccd)
        .input("JOB", sql.NVarChar(100), userProfilePayload.job)
        .input("GENDER", sql.NVarChar(20), userProfilePayload.gender);

      const result = await request.query(`
        EXEC ADDNEWUSERPRROFILE
          @USER_ID = @UserID,
          @FULL_NAME = @FullName,
          @PHONE = @Phone,
          @BIRTH_DATE = @BirthDate,
          @ADDRESS = @Address,
          @ETHNIC = @ETHNIC,
          @CCCD = @CCCD,
          @JOB = @JOB,
          @GENDER = @GENDER;
      `);

      console.log("SQL result:", result);
      console.log("rowsAffected:", result.rowsAffected);
      console.log("recordset:", result.recordset);

      // Kiểm tra dựa trên cấu trúc thực tế từ log
      // recordset: [ { affectedRows: 1 } ]
      if (
        result.recordset &&
        result.recordset[0] &&
        result.recordset[0].affectedRows > 0
      ) {
        return {
          success: true,
          message: "Thêm hồ sơ thành công",
          result: result.recordset || [],
        };
      } else {
        return {
          success: false,
          message: "Thêm hồ sơ thất bại",
          result: result.recordset || [],
        };
      }
    } catch (err) {
      console.error("Error adding new user profile:", err);
      throw new Error(`Error adding new user profile: ${err.message}`);
    }
  }
  async function addNewAppointmentService(profileID, doctorID, scheduleID) {
    try {
      const request = pool
        .request()
        .input("ProfileID", sql.Int, profileID)
        .input("DoctorID", sql.Int, doctorID)
        .input("ScheduleID", sql.Int, scheduleID);

      const result = await request.query(
        `exec ADDNEWAPPOINTMENT @PROFILE_ID = @ProfileID, @DOCTOR_ID = @DoctorID, @SCHEDULE_ID = @ScheduleID;`
      );
      console.log("addNewAppointmentService result:", result);
      if (result.recordset.length > 0 && result.recordset[0].affectedRows > 0) {
        return {
          success: true,
          message: "Appointment added successfully",
          data: result.recordset,
        };
      } else {
        return {
          success: false,
          message: "Failed to add appointment",
          result: result.recordset || [],
        };
      }
    } catch (err) {
      console.error("Error adding new appointment:", err);
      throw new Error(`Error adding new appointment: ${err.message}`);
    }
  }

  async function getListBookingTicketService(userID, appointmentStatus) {
    try {
      const request = pool
        .request()
        .input("UserID", sql.Int, userID)
        .input("AppointmentStatus", sql.VarChar(20), appointmentStatus);
      const result = await request.query(`
        EXEC getAppointmentsByUserIDAndStatus @userID = @UserID, @status = @AppointmentStatus;
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting list booking ticket:", err);
      throw new Error(`Error getting list booking ticket: ${err.message}`);
    }
  }
  async function cancelAppointmentService(userProfileID, doctorID, scheduleID) {
    try {
      const request = pool
        .request()
        .input("userProfileID", sql.Int, userProfileID)
        .input("DoctorID", sql.Int, doctorID)
        .input(
          "ScheduleID",
          scheduleID ? sql.Int : sql.Int,
          scheduleID || null
        );

      const result = await request.query(`
        EXEC CancelAppointment @PROFILE_ID = @userProfileID, @DOCTOR_ID = @DoctorID, @SCHEDULE_ID = @ScheduleID;
      `);

      console.log("Recordset:", result.recordset);

      // Kiểm tra message từ stored procedure
      const message = result.recordset?.[0]?.message || "Unknown result";
      const affectedRows = result.recordset?.[0]?.affectedRows || 0;

      console.log("Message from stored procedure:", message);
      console.log("Affected rows:", affectedRows);

      // Kiểm tra kết quả dựa trên message
      if (message === "huy thanh cong" || affectedRows > 0) {
        return {
          success: true,
          data: result.recordsets?.[0],
        };
      } else {
        return {
          success: false,
          result: result.recordset,
        };
      }
    } catch (err) {
      console.error("Error canceling appointment:", err);
      return {
        success: false,
        message: "Failed to cancel appointment",
        error: err.message,
        result: [],
      };
    }
  }
  return {
    registerAccount,
    userLogin,
    changePassword,
    getUserProfileServices,
    addAppointmentByUser,
    UpdateProfileByUserID,
    getUserWithUserIDAndIDProfileService,
    deleteUserProfileByIDService,
    addNewUserProfileService,
    addNewAppointmentService,
    getListBookingTicketService,
    cancelAppointmentService,
  };
}

module.exports = makeUserServices;
