import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();


const OAuth2 = google.auth.OAuth2;

export const sendRegistrationEmail = async (email, studentName) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"Student Portal" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Registration Successful ✔",
      html: `
        <h2>Hello ${studentName},</h2>
        <p>Your registration has been successfully completed.</p>
        <p>Our team will review your details and contact you soon.</p>
        <br/>
        <p>Regards,<br/>Student Admission Team</p>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log("Email sent successfully!");

  } catch (error) {
    console.error("Error sending email:", error);
  }
};
