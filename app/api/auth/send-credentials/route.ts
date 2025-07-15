import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "0", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || user;

    if (!host || !port || !user || !pass) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #E60023; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://res.cloudinary.com/dbalp1654/image/upload/v1752251975/upscalemedia-transformed-Photoroom_w0wqo9.png" alt="EmpusaAI Logo" style="max-width: 180px; margin-bottom: 24px;" />
    <h2>Welcome to EmpusaAI!</h2>
      <p style="font-size: 16px; margin-bottom: 8px;">Hey, It's EmpusaAI — excited to have you here!</p>
      <p style="font-size: 16px; margin-bottom: 24px;">Here's your 6-digit login code:</p>
      <h1 style="font-size: 40px; letter-spacing: 8px; color: #000; margin: 16px 0;">${password}</h1>
      <p style="font-size: 14px; color: #666; margin-top: 24px;">Login email: <strong>${email}</strong></p>
      <p style="font-size: 14px; color: #666;">Enter this code on the login page to continue.</p>
      <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
      <p style="font-size: 12px; color: #aaa; margin-top: 40px;">© ${new Date().getFullYear()} EmpusaAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
    await transporter.sendMail({
      from,
      to: email,
      subject: "Confirm Your Signup",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("send-credentials error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
