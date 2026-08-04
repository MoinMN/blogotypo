import transporter from "./transporter.js";

export async function sendMail({
  to,
  subject,
  html,
  from = `"Blogotypo - Moin MN" <${process.env.SMTP_USER}>`,
}) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Mail Error:", error);

    return {
      success: false,
      error,
    };
  }
}