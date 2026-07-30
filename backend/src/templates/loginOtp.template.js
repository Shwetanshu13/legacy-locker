export const getLoginOtpEmailTemplate = ({ otp }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }
            .header {
                background-color: #0f172a;
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 40px 32px;
                color: #334155;
                line-height: 1.6;
            }
            .otp-container {
                background-color: #f8fafc;
                border: 2px dashed #cbd5e1;
                border-radius: 8px;
                padding: 24px;
                text-align: center;
                margin: 32px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: 700;
                color: #0ea5e9;
                letter-spacing: 8px;
                margin: 0;
            }
            .footer {
                background-color: #f8fafc;
                padding: 24px;
                text-align: center;
                color: #64748b;
                font-size: 13px;
                border-top: 1px solid #e2e8f0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Legacy Locker Security</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>A login attempt was made using your account password instead of a biometric passkey. To complete the secure login process, please use the following one-time verification code:</p>
                
                <div class="otp-container">
                    <p class="otp-code">${otp}</p>
                </div>
                
                <p>This code will expire in <strong>10 minutes</strong>. If you did not attempt to log in to Legacy Locker, please secure your account and change your Master Password immediately.</p>
                
                <p>Stay secure,<br>The Legacy Locker Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Legacy Locker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
