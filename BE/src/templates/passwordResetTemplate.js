// Password Reset Email Template

const passwordResetTemplate = (resetUrl, userName = "") => {
  // Extract first name from full name
  const firstName = userName ? userName.split(" ")[0] : "there";

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your PrNotes Password</title>
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
            background: linear-gradient(90deg, #6366F1 0%, #4F46E5 100%);
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
        .reset-button {
            display: inline-block;
            padding: 12px 28px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            background-color: #6366F1;
            border-radius: 6px;
            text-decoration: none;
            margin: 16px 0 32px;
        }
        .reset-info {
            font-size: 14px;
            color: #666666;
            margin-bottom: 32px;
            padding: 16px;
            background-color: #f9f9fb;
            border-radius: 6px;
        }
        .security-note {
            font-size: 14px;
            color: #666666;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #eaeaea;
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
        .reset-link {
            word-break: break-all;
            color: #6366F1;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #262626;
        }
        .app-logo {
            margin-bottom: 16px;
            text-align: center;
        }
        .app-name {
            font-size: 24px;
            font-weight: 700;
            color: #6366F1;
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
            <div class="app-name">PrNotes</div>
            <h1>Reset Your PrNotes Password</h1>
        </div>
        <div class="content">
            <div class="message">
                <p class="greeting">Hi ${firstName},</p>
                <p>We received a request to reset your password for your PrNotes account. To reset your password, click the button below:</p>
                
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
                
                <div class="reset-info">
                    <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p><a href="${resetUrl}" class="reset-link">${resetUrl}</a></p>
                </div>
                
                <p>This password reset link will expire in 30 minutes. If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                
                <div class="security-note">
                    <p><strong>Security Tip:</strong> For your protection, please create a strong password that is:</p>
                    <ul>
                        <li>At least 8 characters long</li>
                        <li>Contains a mix of uppercase and lowercase letters</li>
                        <li>Includes numbers and special characters</li>
                    </ul>
                </div>
                
                <p class="signature">Best regards,<br>The PrNotes Team</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} PrNotes. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = passwordResetTemplate;
