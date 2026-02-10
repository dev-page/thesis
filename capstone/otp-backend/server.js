// server.js
import express from 'express'
import cors from 'cors'
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoint to send OTP
app.post("/send-otp", async (req, res) => {
  const { recipient, otp } = req.body;

  const msg = {
    to: recipient,
    from: process.env.SENDGRID_SENDER,
    subject: "Your OTP Code",
    text: `Your one-time password is: ${otp}`,
    html: `<strong>Your OTP code is: ${otp}</strong>`,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));