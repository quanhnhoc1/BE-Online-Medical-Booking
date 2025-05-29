// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key";

function verifyToken(req, res, next) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoiYWExMjNhMTIzYTEyM25AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDg1MzUxNjcsImV4cCI6MTc0ODYyMTU2N30.R2H3DDXszvyljppZU0jI27ITPe38rqZv9j9O5Ud100I"; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // gắn user vào request
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
}

module.exports = { verifyToken };
