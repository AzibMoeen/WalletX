import nodemailer from 'nodemailer';
import { User } from '../src/models/user.model.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Log email configuration for debugging (remove in production)
console.log("Email Config:", {
  user: process.env.EMAIL_USER ? "Set" : "Not set",
  pass: process.env.EMAIL_PASSWORD ? "Set" : "Not set"
});

// Frontend URL for redirection
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD 
  },
  tls: {
    rejectUnauthorized: false 
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP server connection error:", error);
  } else {
    console.log("SMTP server connection established successfully");
  }
});

export const sendEmail = async ({ email, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not found in environment variables');
      return false;
    }

    const mailOptions = {
      from: `"WalletX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendEmailNotification = async (userId, message, subject = 'WalletX Notification', customHtml = null) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.email) {
      console.error('User not found or has no email address');
      return false;
    }

    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px;">WalletX Notification</h1>
          <div style="height: 3px; background-color: #3b82f6; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          ${message}
          <a href="${FRONTEND_URL}/request">Go to this link</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #888888; text-align: center;">
          <p>This is an automated message from WalletX. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} WalletX. All Rights Reserved.</p>
        </div>
      </div>
    `;

    return await sendEmail({
      email: user.email,
      subject,
      html: customHtml || defaultHtml
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

export const sendNotification = async (options) => {
  if (options && typeof options === 'object') {
    const { userId, message, subject, html } = options;
    return await sendEmailNotification(userId, message, subject, html);
  }
  else {
    const [userId, message, subject] = arguments;
    return await sendEmailNotification(userId, message, subject);
  }
};