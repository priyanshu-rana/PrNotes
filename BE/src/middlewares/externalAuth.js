/**
 * External API Authentication Middleware
 *
 * Simple middleware that checks for a valid API key in request headers
 * for external applications.
 */

require("dotenv").config();

// API key for external authentication
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

/**
 * Middleware to verify API key for external requests
 */
const verifyExternalRequest = (req, res, next) => {
  // Check API key in headers
  const apiKey = req.headers["x-api-key"];

  // If API key is valid, proceed
  if (apiKey && apiKey === EXTERNAL_API_KEY) {
    return next();
  }

  // Reject unauthorized access
  return res.status(401).json({
    success: false,
    message: "Unauthorized access. Valid API key required.",
  });
};

module.exports = {
  verifyExternalRequest,
};
