
import express from "express";
import pool from "../db.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * ✅ GET TOTAL ITEM COUNT (NEW)
 * Must be before /:shopId to avoid conflict
 */
router.get("/all/count", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(items.id) AS total_items 
       FROM items 
       JOIN shops ON items.shop_id = shops.id 
       WHERE shops.owner_id = $1`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].total_items) || 0 });
  } catch (err) {
    console.error("COUNT ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET items
router.get("/:shopId", auth, async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const shopCheck = await pool.query("SELECT owner_id FROM shops WHERE id = $1", [shopId]);
    if (shopCheck.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
    if (shopCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    const items = await pool.query("SELECT * FROM items WHERE shop_id = $1 ORDER BY created_at DESC", [shopId]);
    res.json(items.rows);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE item
router.post("/", auth, async (req, res) => {
  try {
    const { shop_id, item_name, quantity, unit_type, description } = req.body;

    if (!shop_id || !item_name || quantity === undefined || !unit_type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const shopCheck = await pool.query("SELECT owner_id FROM shops WHERE id = $1", [shop_id]);
    if (shopCheck.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
    if (shopCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    const result = await pool.query(
      `INSERT INTO items (shop_id, item_name, quantity, unit_type, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [shop_id, item_name, quantity, unit_type, description || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ADD ITEM ERROR:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// UPDATE item
router.put("/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    const { item_name, quantity, unit_type, description } = req.body;

    const itemCheck = await pool.query(
      `SELECT items.shop_id, shops.owner_id FROM items JOIN shops ON items.shop_id = shops.id WHERE items.id = $1`,
      [itemId]
    );
    if (itemCheck.rows.length === 0) return res.status(404).json({ error: "Item not found" });
    if (itemCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    const result = await pool.query(
      `UPDATE items SET item_name=$1, quantity=$2, unit_type=$3, description=$4 WHERE id=$5 RETURNING *`,
      [item_name, quantity, unit_type, description, itemId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE item
router.delete("/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemCheck = await pool.query(
      `SELECT items.shop_id, shops.owner_id FROM items JOIN shops ON items.shop_id = shops.id WHERE items.id = $1`,
      [itemId]
    );
    if (itemCheck.rows.length === 0) return res.status(404).json({ error: "Item not found" });
    if (itemCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    await pool.query("DELETE FROM items WHERE id = $1", [itemId]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// UPLOAD image
router.post("/upload/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemCheck = await pool.query(
        `SELECT items.shop_id, shops.owner_id FROM items JOIN shops ON items.shop_id = shops.id WHERE items.id = $1`,
        [itemId]
    );
    if (itemCheck.rows.length === 0) return res.status(404).json({ error: "Item not found" });
    if (itemCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: "Not allowed" });

    const imageUrl = req.file.path;
    const result = await pool.query("UPDATE items SET image_url=$1 WHERE id=$2 RETURNING *", [imageUrl, itemId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
