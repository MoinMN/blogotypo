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
    .otp {
      font-size: 42px;
      font-weight: bold;
      color: #4c1d95; /* Dark purple for contrast */
      background-color: #e9d5ff; /* Light purple background */
      padding: 15px 20px;
      border-radius: 6px;
      display: inline-block;
      letter-spacing: 4px;
      margin: 20px 0;
    }
    .content {
      font-size: 18px;
      line-height: 1.6;
      color: #f5f3ff; /* Soft white for readability */
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
    <div class="header">🔐 Email Verification - Blogotypo</div>
    <div class="content">
      <p>Please use the code below to verify your email address:</p>
      <div class="otp">${otp}</div>
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 <strong>Blogotypo</strong>. All Rights Reserved.
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
