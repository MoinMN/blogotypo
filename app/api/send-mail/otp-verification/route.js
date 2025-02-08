import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { to, otp } = await req.json();

    if (!to || !otp) {
      return new Response("Receiver or OTP doesn't received!", { status: 404, });
    }

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
      subject: 'OTP Verification for Your Blogotypo Account',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
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
    .otp {
      font-size: 40px;
      font-weight: bold;
      color: #c084fc; /* Tailwind purple-400 */
      margin: 20px 0;
      background-color: #4c1d95; /* Darker purple */
      padding: 10px;
      border-radius: 5px;
    }
    .content {
      font-size: 16px;
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
    <div class="header">Email Verification - Blogotypo</div>
    <div class="content">
      <p>Use the code below to verify your email address:</p>
      <div class="otp">${otp}</div>
      <p>If you didn't request this, kindly ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Blogotypo. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`,
    });

    return new Response('Email sent successfully!', { status: 200, });
  } catch (error) {
    console.error(error);
    return new Response('Error sending email!', { status: 500 });
  }
}
