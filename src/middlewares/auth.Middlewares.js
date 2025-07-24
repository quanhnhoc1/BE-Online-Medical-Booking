// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1111";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("=== Middleware Debug ===");
  console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  console.log("Extracted token:", token);
  console.log("Token length:", token ? token.length : 0);

  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    console.log("🔍 Attempting to verify token...");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified successfully");
    console.log("Decoded payload:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed");
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
}

module.exports = { verifyToken };
