
// import express from "express";
// import pool from "../db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { auth } from "../middleware/auth.js";
// import { sendOTPEmail } from "../services/emailService.js"; 

// const router = express.Router();

// /* =========================================
//    SMART REGISTER ROUTE (With Debug Logs)
// ========================================= */
// router.post("/register", async (req, res) => {
//   console.log(`⏱️ [${new Date().toLocaleTimeString()}] 1. Register Request Received`);

//   try {
//     const { full_name, email, password, role } = req.body;

//     // Basic Validation
//     if (!full_name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 1. Check if user exists
//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 2. Checking DB for existing user...`);
//     const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
//     let userId;

//     if (userCheck.rows.length > 0) {
//       const existingUser = userCheck.rows[0];
      
//       // CASE A: User exists AND is verified -> Block them
//       if (existingUser.is_verified) {
//         return res.status(409).json({ message: "Email already registered and verified. Please login." });
//       }

//       // CASE B: User exists but is NOT verified -> Reuse this account
//       console.log(`⏱️ [${new Date().toLocaleTimeString()}] 3. User exists (unverified). Updating password...`);
//       userId = existingUser.id;
      
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await pool.query("UPDATE users SET full_name=$1, password=$2, role=$3 WHERE id=$4", 
//         [full_name, hashedPassword, role, userId]);

//     } else {
//       // CASE C: New User -> Create them
//       console.log(`⏱️ [${new Date().toLocaleTimeString()}] 3. Hashing Password...`);
//       const hashedPassword = await bcrypt.hash(password, 10);

//       console.log(`⏱️ [${new Date().toLocaleTimeString()}] 4. Inserting New User into DB...`);
//       const result = await pool.query(
//         `INSERT INTO users (full_name, email, password, role)
//          VALUES ($1, $2, $3, $4)
//          RETURNING id`,
//         [full_name, email, hashedPassword, role]
//       );
//       userId = result.rows[0].id;
//     }

//     // 2. Cleanup old OTPs
//     await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);

//     // 3. Generate New OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // 4. Save New OTP
//     await pool.query(
//       `INSERT INTO otp_verifications (user_id, otp_code, expires_at)
//        VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
//       [userId, otp]
//     );

//     // 5. Send Email (The Suspected Delay)
//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 5. STARTING EMAIL SEND to: ${email}...`);
    
//     const emailSent = await sendOTPEmail(email, otp);

//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 6. EMAIL PROCESS FINISHED. Success: ${emailSent}`);

//     if (!emailSent) {
//         return res.status(500).json({ 
//             message: "Failed to send OTP email. Please check the email address." 
//         });
//     }

//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 7. Sending Response to Frontend.`);
//     res.status(201).json({
//       message: `OTP sent to ${email}`,
//       userId: userId
//     });

//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* =========================
//    VERIFY OTP
// ========================= */
// router.post("/verify-otp", async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     if (userRes.rows.length === 0) return res.status(404).json({ message: "User not found" });

//     const userId = userRes.rows[0].id;
//     const otpRes = await pool.query(
//       "SELECT * FROM otp_verifications WHERE user_id = $1 AND otp_code = $2 AND expires_at > NOW()",
//       [userId, otp]
//     );

//     if (otpRes.rows.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

//     await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [userId]);
//     await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);

//     res.json({ message: "Verified! You can now login." });
//   } catch (err) { 
//     console.error(err);
//     res.status(500).json({ message: "Server error" }); 
//   }
// });

// /* =========================
//    LOGIN
// ========================= */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

//     const user = result.rows[0];
//     if (!user.is_verified) return res.status(403).json({ message: "Please verify your email first." });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
//     res.json({ token, user: { id: user.id, name: user.full_name, role: user.role } });
//   } catch (err) { 
//     console.error(err);
//     res.status(500).json({ message: "Server error" }); 
//   }
// });

// /* =========================
//    GET CURRENT USER
// ========================= */
// router.get("/me", auth, async (req, res) => {
//   try {
//     const r = await pool.query("SELECT id, full_name, email, role FROM users WHERE id=$1", [req.user.id]);
//     res.json(r.rows[0]);
//   } catch (e) { 
//     console.error(e);
//     res.status(500).json({ error: "Server error" }); 
//   }
// });















// export default router;
// import express from "express";
// import pool from "../db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// // Note the added .js extension below - required for ES Modules
// import { auth } from "../middleware/auth.js"; 
// import { sendOTPEmail } from "../services/emailService.js"; 

// const router = express.Router();

// /* =========================================
//    REGISTER ROUTE
// ========================================= */
// router.post("/register", async (req, res) => {
//   console.log(`⏱️ [${new Date().toLocaleTimeString()}] 1. Register Request Received`);

//   try {
//     const { full_name, email, password, role } = req.body;

//     if (!full_name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 2. Checking DB...`);
//     const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
//     let userId;

//     if (userCheck.rows.length > 0) {
//       const existingUser = userCheck.rows[0];
//       if (existingUser.is_verified) {
//         return res.status(409).json({ message: "Email already registered. Please login." });
//       }
//       userId = existingUser.id;
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await pool.query("UPDATE users SET full_name=$1, password=$2, role=$3 WHERE id=$4", 
//         [full_name, hashedPassword, role, userId]);
//     } else {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const result = await pool.query(
//         `INSERT INTO users (full_name, email, password, role)
//          VALUES ($1, $2, $3, $4)
//          RETURNING id`,
//         [full_name, email, hashedPassword, role]
//       );
//       userId = result.rows[0].id;
//     }

//     await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     await pool.query(
//       `INSERT INTO otp_verifications (user_id, otp_code, expires_at)
//        VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
//       [userId, otp]
//     );

//     console.log(`⏱️ [${new Date().toLocaleTimeString()}] 5. Sending Email...`);
//     const emailSent = await sendOTPEmail(email, otp);

//     if (!emailSent) {
//         return res.status(500).json({ message: "Failed to send OTP email." });
//     }

//     res.status(201).json({ message: `OTP sent to ${email}`, userId: userId });
//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* =========================
//    VERIFY OTP
// ========================= */
// router.post("/verify-otp", async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     if (userRes.rows.length === 0) return res.status(404).json({ message: "User not found" });

//     const userId = userRes.rows[0].id;
//     const otpRes = await pool.query(
//       "SELECT * FROM otp_verifications WHERE user_id = $1 AND otp_code = $2 AND expires_at > NOW()",
//       [userId, otp]
//     );

//     if (otpRes.rows.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

//     await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [userId]);
//     await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);

//     res.json({ message: "Verified! You can now login." });
//   } catch (err) { 
//     console.error(err);
//     res.status(500).json({ message: "Server error" }); 
//   }
// });

// /* =========================
//    LOGIN
// ========================= */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

//     const user = result.rows[0];
//     if (!user.is_verified) return res.status(403).json({ message: "Please verify your email first." });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
//     res.json({ token, user: { id: user.id, name: user.full_name, role: user.role } });
//   } catch (err) { 
//     console.error(err);
//     res.status(500).json({ message: "Server error" }); 
//   }
// });

// /* =========================
//    GET ME
// ========================= */
// router.get("/me", auth, async (req, res) => {
//   try {
//     const r = await pool.query("SELECT id, full_name, email, role FROM users WHERE id=$1", [req.user.id]);
//     res.json(r.rows[0]);
//   } catch (e) { 
//     console.error(e);
//     res.status(500).json({ error: "Server error" }); 
//   }
// });

// export default router;

import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js"; 
import { sendOTPEmail } from "../services/emailService.js"; 

const router = express.Router();

/* =========================================
   REGISTER ROUTE (FIXED)
========================================= */
router.post("/register", async (req, res) => {
  console.log("🚀 Register API hit");

  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("🔍 Checking user in DB...");
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    let userId;

    if (userCheck.rows.length > 0) {
      const existingUser = userCheck.rows[0];

      if (existingUser.is_verified) {
        return res.status(409).json({ message: "Email already registered. Please login." });
      }

      console.log("♻️ Updating existing unverified user...");
      userId = existingUser.id;

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "UPDATE users SET full_name=$1, password=$2, role=$3 WHERE id=$4",
        [full_name, hashedPassword, role, userId]
      );

    } else {
      console.log("🆕 Creating new user...");
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (full_name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [full_name, email, hashedPassword, role]
      );

      userId = result.rows[0].id;
    }

    // OTP logic
    await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO otp_verifications (user_id, otp_code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [userId, otp]
    );

    // ✅ EMAIL DEBUG + SAFE EXECUTION
    console.log("📧 Sending OTP email...");
    console.log("ENV EMAIL:", process.env.EMAIL);

    let emailSent = false;

    try {
      emailSent = await sendOTPEmail(email, otp);
      console.log("✅ Email result:", emailSent);
    } catch (emailError) {
      console.error("❌ EMAIL ERROR:", emailError);
      return res.status(500).json({
        message: "Email sending failed",
        error: emailError.message
      });
    }

    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send OTP email (service returned false)"
      });
    }

    console.log("✅ Register success");
    res.status(201).json({
      message: `OTP sent to ${email}`,
      userId
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR FULL:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRes.rows[0].id;

    const otpRes = await pool.query(
      "SELECT * FROM otp_verifications WHERE user_id = $1 AND otp_code = $2 AND expires_at > NOW()",
      [userId, otp]
    );

    if (otpRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [userId]);
    await pool.query("DELETE FROM otp_verifications WHERE user_id = $1", [userId]);

    res.json({ message: "Verified! You can now login." });

  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   GET ME
========================= */
router.get("/me", auth, async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(r.rows[0]);

  } catch (e) {
    console.error("❌ ME ERROR:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;