const emailService = require("../services/emailService");

/**
 * External Controller
 *
 * Handles requests from external applications/processes.
 */

/**
 * Handle contact form submissions from external applications/processes
 */
const handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Extract source URL from referrer or a custom header
    const sourceUrl = req.headers.referer || req.headers["x-source-url"] || "";

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Send email with source URL
    const result = await emailService.sendContactEmail(
      name,
      email,
      message,
      sourceUrl
    );

    // Check result
    if (!result.success) {
      throw new Error(result.error || "Failed to send message");
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      source: result.source,
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  handleContactForm,
};
