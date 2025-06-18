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
        EXEC AddNewUser
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
          SELECT acc.*, up.PHONE, up.ADDRESS, up.GENDER, up.BIRTH_DATE
          FROM accounts acc
          LEFT JOIN USER_PROFILES up ON acc.ID = up.USER_ID
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

  return {
    registerAccount,
    userLogin,
    changePassword,
    getUserProfileServices,
  };
}

module.exports = makeUserServices;
