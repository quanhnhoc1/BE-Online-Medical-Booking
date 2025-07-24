const { pool, sql } = require("../../connect");

async function makeSearchServices() {
  async function searchKeyword(keyword) {
    try {
      const request = pool.request().input("keyword", sql.NVarChar, keyword);
      const result = await request.query(
        "EXEC SearchKeyword @Keyword = @keyword"
      );
      return {
        doctors: result.recordsets[0], // Danh sách bác sĩ
        hospitals: result.recordsets[1], // Danh sách bệnh viện
      };
    } catch (error) {
      throw new Error(`Error searching keyword: ${error.message}`);
    }
  }
  return { searchKeyword };
}

module.exports = makeSearchServices;
