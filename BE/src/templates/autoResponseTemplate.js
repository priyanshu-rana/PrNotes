/**
 * Auto-response Email Template
 *
 * This template is sent to users who submit the contact form
 * as an acknowledgment that their message was received.
 */

const autoResponseTemplate = (name, sourceUrl) => {
  // Extract first name from full name
  const firstName = name.split(" ")[0];

  // Determine if this is from PrNotes (internal) or external source
  const isInternal = sourceUrl.includes("prnotes") ?? false;

  // Dynamic content based on source
  const appName = isInternal
    ? "PrNotes"
    : sourceUrl.includes("priyanshu")
    ? "Priyanshu Rana"
    : sourceUrl;
  const thankYouMessage = isInternal
    ? "Thank you for reaching out through PrNotes. Your message has been received and will be reviewed shortly."
    : `Thank you for contacting me through ${sourceUrl}. I appreciate your interest and will review your message shortly.`;

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
    <title>Thank You for Contacting ${isInternal ? "PrNotes" : "Me"}</title>
    <style>
        body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #262626;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 640px;
            margin: 40px auto;
            background-color: #ffffff;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            overflow: hidden;
        }
        .brand-bar {
            height: 4px;
            ${brandBarColor}
        }
        .header {
            background-color: #ffffff;
            padding: 40px 48px 32px;
            text-align: left;
        }
        .header h1 {
            margin: 0 0 16px 0;
            font-size: 28px;
            font-weight: 700;
            color: #262626;
        }
        .content {
            padding: 0 48px 40px;
            background-color: #ffffff;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #262626;
            margin-bottom: 24px;
        }
        .signature {
            font-weight: 600;
            margin-top: 32px;
        }
        .footer {
            background-color: #f9f9fb;
            padding: 32px 48px;
            text-align: center;
            font-size: 14px;
            color: #8c8c8c;
        }
        .social-links {
            margin-top: 16px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: ${accentColor};
            text-decoration: none;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #262626;
        }
        .app-name {
            font-size: 24px;
            font-weight: 700;
            color: ${accentColor};
            margin-bottom: 16px;
        }
        @media only screen and (max-width: 640px) {
            .container {
                margin: 0;
                width: 100%;
            }
            .header, .content, .footer {
                padding-left: 24px;
                padding-right: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand-bar"></div>
        <div class="header">
            ${isInternal ? '<div class="app-name">PrNotes</div>' : ""}
            <h1>Thank You for Reaching Out!</h1>
        </div>
        <div class="content">
            <div class="message">
                <p class="greeting">Hi ${firstName},</p>
                <p>${thankYouMessage}</p>
                <p>I typically respond within 24-48 hours during business days. If your matter is urgent, please feel free to connect with me on LinkedIn or GitHub (links in the footer).</p>
                <p>Looking forward to our conversation!</p>
                <p class="signature">Best regards,<br>${appName}</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <div class="social-links">
                <a href="https://www.linkedin.com/in/priyanshu-rana" target="_blank">LinkedIn</a>
                <a href="https://github.com/priyanshu-rana" target="_blank">GitHub</a>
                <a href="https://priyanshurana.netlify.app" target="_blank">Portfolio</a>
            </div>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = autoResponseTemplate;
