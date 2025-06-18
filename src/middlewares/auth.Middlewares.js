// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1111";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  console.log("Extracted token:", token);
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
}

module.exports = { verifyToken };
