/**
 * Contact Email Template
 *
 * This template is sent as a notification when someone submits the contact form.
 * Dynamically adapts based on source (PrNotes or external).
 */

const contactEmailTemplate = (name, email, message, sourceUrl) => {
  // Determine if this is from PrNotes (internal) or external source
  const isInternal = sourceUrl.includes("prnotes") ?? false;

  // Dynamic content based on source
  const appName = isInternal ? "PrNotes" : sourceUrl;

  // Use consistent PrNotes branding for all emails - standard indigo colors
  const brandBarColor =
    "background: linear-gradient(90deg, #6366F1 0%, #4F46E5 100%);";
  const accentColor = "#6366F1";

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #262626;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        
        /* Container */
        .container {
            max-width: 640px;
            margin: 40px auto;
            background-color: #ffffff;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            overflow: hidden;
        }

        /* Brand Bar */
        .brand-bar {
            height: 4px;
            ${brandBarColor}
        }

        /* Header */
        .header {
            background-color: #ffffff;
            padding: 40px 48px 32px;
            text-align: left;
            position: relative;
        }
        .logo-container {
            margin-bottom: 24px;
        }
        .logo {
            display: block;
            width: 120px;
            height: auto;
        }
        .notification-badge {
            display: inline-block;
            background-color: ${accentColor};
            color: white;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 6px 12px;
            border-radius: 4px;
            margin-bottom: 16px;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
            color: #262626;
            letter-spacing: -0.02em;
            line-height: 1.3;
        }
        .header p {
            margin: 0;
            color: #666666;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
        }
        .date-info {
            color: #8c8c8c;
            font-size: 13px;
            margin-top: 24px;
        }

        /* Content */
        .content {
            padding: 24px 48px 40px;
            background-color: #ffffff;
        }
        .section {
            margin-bottom: 32px;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 28px;
        }
        .section:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
        }
        .section-header {
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #262626;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
        }
        .field {
            margin-bottom: 16px;
        }
        .field:last-child {
            margin-bottom: 0;
        }
        .field-label {
            font-size: 13px;
            font-weight: 500;
            color: #8c8c8c;
            margin-bottom: 6px;
        }
        .field-value {
            font-size: 16px;
            color: #262626;
            line-height: 1.5;
            font-weight: 400;
        }
        .field-value a {
            color: ${accentColor};
            text-decoration: none;
        }

        /* Message Box */
        .message-box {
            background-color: #f9f9fb;
            padding: 24px;
            border-radius: 6px;
            font-size: 15px;
            line-height: 1.6;
            color: #262626;
            margin-top: 8px;
        }

        /* Footer */
        .footer {
            background-color: #f9f9fb;
            padding: 32px 48px;
            text-align: left;
        }
        .footer-brand {
            margin-bottom: 24px;
        }
        .footer-logo {
            height: 20px;
            width: auto;
            opacity: 0.85;
        }
        .footer-info {
            font-size: 13px;
            color: #8c8c8c;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .footer-links {
            border-top: 1px solid #eaeaea;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .footer-links-group {
            margin-right: 40px;
            margin-bottom: 16px;
        }
        .footer-link {
            display: block;
            color: #595959;
            text-decoration: none;
            font-size: 13px;
            line-height: 2;
        }
        .copyright {
            font-size: 12px;
            color: #8c8c8c;
            margin-top: 16px;
        }
        .app-name {
            font-size: 24px;
            font-weight: 700;
            color: ${accentColor};
            margin-bottom: 16px;
        }

        /* Responsive Design */
        @media only screen and (max-width: 640px) {
            .container {
                margin: 0;
                width: 100%;
            }
            .header {
                padding: 28px 24px 24px;
            }
            .content {
                padding: 20px 24px 32px;
            }
            .footer {
                padding: 24px;
            }
            .header h1 {
                font-size: 24px;
            }
            .footer-links {
                flex-direction: column;
            }
            .footer-links-group {
                margin-right: 0;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand-bar"></div>
        <div class="header">
            <div class="logo-container">
                ${isInternal ? '<div class="app-name">PrNotes</div>' : ""}
            </div>
            <div class="notification-badge">New Message</div>
            <h1>New Contact Form Submission</h1>
            <p>You have received a new message from your ${appName} website.</p>
            <div class="date-info">Received on ${new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}</div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Contact Information</h2>
                </div>
                <div class="field">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">${name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email Address</div>
                    <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                    <div class="field-label">Source</div>
                    <div class="field-value">${sourceUrl}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Message Content</h2>
                </div>
                <div class="field">
                    <div class="message-box">${message}</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-brand">
                <!-- Optional: Add your logo here -->
                <!-- <img src="your-logo-url" alt="Your Logo" class="footer-logo"> -->
            </div>
            <div class="footer-info">
                This is an automated notification from your ${appName} website's contact form system. Please do not reply directly to this email.
            </div>

            <div class="copyright">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = contactEmailTemplate;
