
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   pool: true,             // <--- THE MAGIC FIX: Keep connection open
//   maxConnections: 1,      // Limit to 1 connection (Polite to Google)
//   maxMessages: 5,         // Send 5 emails before refreshing connection
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// export const sendOTPEmail = async (toEmail, otp) => {
//   try {
//     console.log(`🔌 [${new Date().toLocaleTimeString()}] Preparing email for: ${toEmail}...`);
//     const start = Date.now();

//     const mailOptions = {
//       from: `"Shop Locator" <${process.env.GMAIL_USER}>`,
//       to: toEmail,
//       subject: "Your Verification Code",
//       text: `Your OTP is: ${otp}\n\nValid for 10 minutes.`,
//     };

//     // Attempt to send
//     const info = await transporter.sendMail(mailOptions);
    
//     const duration = (Date.now() - start) / 1000;
//     console.log(`✅ [${new Date().toLocaleTimeString()}] Sent in ${duration}s. ID: ${info.messageId}`);
//     return true;

//   } catch (error) {
//     console.error(`❌ [${new Date().toLocaleTimeString()}] Email Failed:`, error);
//     return false;
//   }
// };


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: '"Shop Locator" <no-reply@brevo.com>',
      to: to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>🔐 Shop Locator Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: blue;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email sent");
    return true;

  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};