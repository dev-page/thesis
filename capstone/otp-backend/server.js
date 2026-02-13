import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import multer from "multer";
import { supabase } from "./supabase.js"; // backend Supabase client (service role key)
import { firestore } from "./firebaseAdmin.js";
import admin from "firebase-admin";



dotenv.config();

const app = express();

// ✅ Restrict CORS (adjust origin for production)
app.use(cors());
app.use(express.json());

// ✅ Add file size limit (5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ================= SENDGRID SETUP =================
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY missing in .env");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= OTP ROUTE =================
app.post("/send-otp", async (req, res) => {
  try {
    const { recipient, otp } = req.body;

    if (!recipient || !otp) {
      return res.status(400).json({
        success: false,
        error: "Recipient and OTP are required",
      });
    }

    const msg = {
      to: recipient,
      from: process.env.SENDGRID_SENDER,
      subject: "Your OTP Code",
      text: `Your one-time password is: ${otp}`,
      html: `<strong>Your OTP code is: ${otp}</strong>`,
    };

    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `uploads/${Date.now()}-${safeName}`;

    // Upload to Supabase
    const uploadResult = await supabase.storage
      .from("images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadResult.error) {
      console.error("Supabase upload error details:", uploadResult.error);
      return res.status(500).json({ error: "Supabase upload error", details: uploadResult.error.message || uploadResult.error });
    }

    // Get permanent public URL
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    if (publicUrlError) {
      console.error("Supabase getPublicUrl error:", publicUrlError);
      return res.status(500).json({ error: "Failed to get public URL", details: publicUrlError.message || publicUrlError });
    }

    const publicUrl = publicUrlData?.publicUrl;

    const docRef = await firestore.collection("images").add({
      url: publicUrl,
      path: filePath,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      id: docRef.id,
      url: publicUrl,
      path: filePath,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/test-firestore", async (req, res) => {
  try {
    const docRef = await firestore.collection("images").add({
      test: true,
      createdAt: new Date(),
    });
    res.json({ id: docRef.id });
  } catch (err) {
    console.error("Firestore test error:", err);
    res.status(500).json({ error: "Firestore test failed" });
  }
});
// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});