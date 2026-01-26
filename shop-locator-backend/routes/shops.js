
import express from "express";
import pool from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ GET: List ALL logged-in owner's shops
 * Used by: shophome.html (Dashboard)
 */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ error: "Only owners can view shops" });
    }

    const r = await pool.query(
      "SELECT * FROM shops WHERE owner_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(r.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ GET: Get SINGLE shop details (THIS WAS MISSING!)
 * Used by: shop-menu.html, manage-shop.html
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const shopId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM shops WHERE id = $1",
      [shopId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const shop = result.rows[0];

    // Security: Ensure owner owns this shop
    if (shop.owner_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(shop);
  } catch (err) {
    console.error("GET SHOP ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ POST: Create shop
 */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ error: "Only owners can create shops" });
    }

    const { shop_name, phone_number, latitude, longitude, address } = req.body;
    const ownerId = req.user.id;

    if (!shop_name || !latitude || !longitude || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const r = await pool.query(
      `INSERT INTO shops (owner_id, shop_name, phone_number, address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [ownerId, shop_name, phone_number, address, latitude, longitude]
    );

    res.json(r.rows[0]);
  } catch (err) {
    console.error("CREATE SHOP ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ PUT: Edit shop
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const shopId = req.params.id;

    // Security check
    const check = await pool.query("SELECT owner_id FROM shops WHERE id = $1", [shopId]);
    if (check.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    const { shop_name, phone_number, latitude, longitude, address } = req.body;

    const r = await pool.query(
      `UPDATE shops
       SET shop_name = $1, phone_number = $2, latitude = $3, longitude = $4, address = $5
       WHERE id = $6 RETURNING *`,
      [shop_name, phone_number, latitude, longitude, address, shopId]
    );

    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ DELETE: Delete shop
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const shopId = req.params.id;

    const check = await pool.query("SELECT owner_id FROM shops WHERE id = $1", [shopId]);
    if (check.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    await pool.query("DELETE FROM shops WHERE id = $1", [shopId]);

    res.json({ message: "Shop deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
