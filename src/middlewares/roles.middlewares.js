// middlewares/roleMiddleware.js

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next(); // cho qua nếu hợp lệ
  };
}

module.exports = { authorizeRoles };
