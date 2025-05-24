const ApiError = require("../api-error");
function methodNotAllowed(req, res, next) {
  if (req.route) {
    const httpsMethods = Object.keys(req.route.methods)
      .filter((method) => method !== "_all")
      .map((method) => method.toUpperCase());
    return next(
      new ApiError(405, "Method not allowed", {
        Allow: httpsMethods.join(","),
      })
    );
  }
  return next();
}

function resourceNotFound(req, res, next) {
  // Handler for unknown URL path.
  // Call next() to pass to the error handling function.
  return next(new ApiError(404, "Resource not found"));
}

function handleError(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  return res
    .status(err.statusCode || 500)
    .set(err.headers || {})
    .json({
      message: err.message || "internal server error",
    });
}
module.exports = { methodNotAllowed, resourceNotFound, handleError };
