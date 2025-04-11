const nodemailer = require("nodemailer");
const contactEmailTemplate = require("../templates/contactEmailTemplate");
const autoResponseTemplate = require("../templates/autoResponseTemplate");
const passwordResetTemplate = require("../templates/passwordResetTemplate");
require("dotenv").config();

/**
 * Email Service Class
 *
 * Handles all email-related functionality for the application.
 */
class EmailService {
  constructor() {
    // Initialize the transporter once
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    this.defaultEmail = process.env.EMAIL_USER;
    this.adminEmail = process.env.ADMIN_EMAIL;
  }

  /**
   * Generic method to send an email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} text - Plain text content
   * @param {string} html - HTML content
   * @returns {Promise<object>} Result of the email operation
   */
  async sendEmail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: this.defaultEmail,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send contact form submission email to admin and an auto-response to the sender
   * @param {string} name - Sender's name
   * @param {string} email - Sender's email
   * @param {string} message - Message content
   * @param {string} sourceUrl - URL where the form was submitted from
   * @returns {Promise<object>} Result of both email operations
   */
  async sendContactEmail(name, email, message, sourceUrl = "") {
    try {
      const isInternal = sourceUrl.includes("prnotes") ?? false;
      // 1. Send notification to yourself
      const adminSubject = `New Contact Form Submission from ${name} (via ${sourceUrl})`;

      const adminResult = await this.sendEmail(
        this.adminEmail,
        adminSubject,
        "",
        contactEmailTemplate(name, email, message, sourceUrl)
      );

      // 2. Send auto-response to user with source information
      const userSubject = `Thank you for contacting ${
        isInternal ? "PrNotes" : "me"
      }`;
      const userResult = await this.sendEmail(
        email,
        userSubject,
        "",
        autoResponseTemplate(name, sourceUrl)
      );

      // Check if the admin notification was sent successfully
      if (!adminResult.success) {
        throw new Error(
          "Failed to send notification: " +
            (adminResult.error || "Unknown error")
        );
      }

      // Log warning if auto-response failed, but don't fail the whole process
      if (!userResult.success) {
        console.warn("Auto-response email failed to send:", userResult.error);
      }

      return {
        success: true,
        sourceUrl,
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.success ? userResult.messageId : null,
      };
    } catch (error) {
      console.error("Contact email process failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password reset email with secure reset link
   * @param {string} userEmail - User's email address
   * @param {string} resetToken - Secure token for password reset
   * @param {string} userName - User's name (optional)
   * @returns {Promise<object>} Result of the email operation
   */
  async sendPasswordResetEmail(userEmail, resetToken, userName = "") {
    try {
      const subject = "Reset Your PrNotes Password";
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Password reset emails always use PrNotes branding
      const html = passwordResetTemplate(resetUrl, userName);

      const result = await this.sendEmail(userEmail, subject, "", html);

      if (!result.success) {
        console.error("Failed to send password reset email:", result.error);
      }

      return result;
    } catch (error) {
      console.error("Password reset email failed:", error);
      return { success: false, error: error.message };
    }
  }
}

// Create a singleton instance
const emailService = new EmailService();

// Export the singleton for use throughout the application
module.exports = emailService;
