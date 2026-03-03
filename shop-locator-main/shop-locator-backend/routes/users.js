import express from "express";
import pool from "../db.js"; 
import { auth } from "../middleware/auth.js"; // <--- FIXED: Added curly braces to match your file

const router = express.Router();

// GET USER PROFILE
// We use 'auth' here because that is the name of your function in auth.js
router.get("/profile", auth, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id = $1", 
      [req.user.id]
    );
    
    // We check if the user exists in the profiles table to get extra info
    const profileResult = await pool.query(
      "SELECT phone, address FROM profiles WHERE user_id = $1", 
      [req.user.id]
    );

    const user = userResult.rows[0];
    const profile = profileResult.rows[0] || {};

    // Combine the data
    res.json({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: profile.phone || "",
      address: profile.address || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USER PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, address } = req.body;

    console.log(`📝 Updating Profile for User ${userId}...`);

    // 1. Update the Main Name in USERS table
    await pool.query(
      "UPDATE users SET full_name = $1 WHERE id = $2",
      [full_name, userId]
    );

    // 2. Check if a profile row exists
    const profileCheck = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [userId]);

    if (profileCheck.rows.length > 0) {
      // Exists -> Update it
      await pool.query(
        "UPDATE profiles SET full_name=$1, phone=$2, address=$3 WHERE user_id=$4",
        [full_name, phone, address, userId]
      );
    } else {
      // Missing -> Insert it
      await pool.query(
        "INSERT INTO profiles (user_id, full_name, phone, address) VALUES ($1, $2, $3, $4)",
        [userId, full_name, phone, address]
      );
    }

    res.json({ message: "Profile updated successfully!" });

  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
