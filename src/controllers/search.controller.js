const searchKeywordServices = require("../services/searchServices");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const { OAuth2Client } = require("google-auth-library");
const { sql, conn } = require("../../connect");
const makeSearchServices = require("../services/searchServices");

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "419237871729-6cv0dkr0tqeqhtmgd734t0srv2vc0mp9.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = "1111";

async function searchKeywordController(req, res, next) {
  try {
    const { keyword } = req.body;

    if (!keyword || typeof keyword !== "string") {
      return res
        .status(400)
        .json({ error: "Keyword is required and must be a string." });
    }

    const searchService = await makeSearchServices();
    const result = await searchService.searchKeyword(keyword);

    return res.status(200).json(result);
  } catch (error) {
    console.log("Search error:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { searchKeywordController };
