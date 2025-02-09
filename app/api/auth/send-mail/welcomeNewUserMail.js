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
      font-family: Arial, sans-serif;
      background-color: #4c1d95; /* Tailwind purple-900 */
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #6b21a8; /* Tailwind purple-700 */
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }
    .header {
      font-size: 30px;
      font-weight: bold;
      color: #e9d5ff; /* Light purple for better contrast */
      margin-bottom: 20px;
    }
    .content {
      font-size: 18px;
      line-height: 1.6;
      color: #f5f3ff; /* Soft white for readability */
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 14px 28px;
      background-color: #e9d5ff; /* Lighter purple for contrast */
      color: #4c1d95; /* Deep purple text */
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s ease-in-out;
    }
    .cta-button:hover {
      background-color: #d8b4fe; /* Slightly lighter on hover */
    }
    .footer {
      margin-top: 25px;
      font-size: 14px;
      color: #f3e8ff; /* Softer shade for better contrast */
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">🎉 Welcome to Blogotypo! 🎉</div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>We’re thrilled to have you join our blogging community! Blogotypo is your gateway to sharing amazing stories, insights, and ideas with the world.</p>
      <p>Start your journey by exploring our platform and publishing your first blog today.</p>
      <a href="${process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/dashboard'}" class="cta-button">Go to Dashboard</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
    <div class="footer">
      &copy; 2025 <strong>Blogotypo</strong>. All Rights Reserved.
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
