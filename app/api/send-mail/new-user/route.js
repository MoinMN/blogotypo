import nodemailer from 'nodemailer';

export async function welcomeNewUserMail(to, userName) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,  // Your Gmail email
        pass: process.env.SMTP_PASS,  // Your App Password
      },
    });

    await transporter.sendMail({
      from: `"Blogotypo - Moin MN" <${process.env.SMTP_USER}>`, // Sender address
      to,         // List of receivers
      subject: 'Welcome to Blogotypo!',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Blogotypo</title>
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: #6b21a8; /* Tailwind purple-700 */
      color: #f0f0f0;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #7e22ce; /* Tailwind purple-600 */
      padding: 30px;
      border-radius: 8px;
      text-align: center;
    }
    .header {
      font-size: 28px;
      color: #c084fc; /* Tailwind purple-400 */
      margin-bottom: 20px;
    }
    .content {
      font-size: 16px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #c084fc; /* Tailwind purple-400 */
      color: #4c1d95; /* Tailwind deep purple */
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Welcome to Blogotypo!</div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>We are thrilled to have you join our blogging community. Blogotypo is your gateway to sharing amazing stories, insights, and ideas with the world.</p>
      <p>Start your journey by exploring our platform and publishing your first blog today.</p>
      <a href="${process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/dashboard'}" class="cta-button">Go to Dashboard</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
    <div class="footer">
      &copy; 2025 Blogotypo. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`,
    });
  } catch (error) {
    console.error(error);
  }
}
