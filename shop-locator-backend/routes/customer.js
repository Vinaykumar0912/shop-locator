
import express from "express";
import pool from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// -----------------------------------------------------
// 1. NEARBY ITEMS
// -----------------------------------------------------
router.get("/nearby", auth, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const userLat = lat || 0;
    const userLng = lng || 0;

    const result = await pool.query(
      `SELECT 
        items.id, items.item_name, items.quantity, items.unit_type, items.image_url,
        shops.id AS shop_id, shops.shop_name,
        ROUND(
          6371 * acos(
            cos(radians($1)) * cos(radians(shops.latitude)) *
            cos(radians(shops.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(shops.latitude))
          )::numeric, 2
        ) AS distance
      FROM items
      JOIN shops ON items.shop_id = shops.id
      ORDER BY distance ASC
      LIMIT 20`,
      [userLat, userLng]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("NEARBY ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 2. SEARCH ITEMS
// -----------------------------------------------------
router.get("/search", auth, async (req, res) => {
  try {
    const { item, lat, lng } = req.query;

    if (!item || !lat || !lng) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const result = await pool.query(
      `SELECT 
        items.id, items.item_name, items.quantity, items.unit_type,
        items.image_url, items.description,
        shops.id AS shop_id, shops.shop_name, shops.latitude, shops.longitude,
        ROUND(
          6371 * acos(
            cos(radians($1)) * cos(radians(shops.latitude)) *
            cos(radians(shops.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(shops.latitude))
          )::numeric, 2
        ) AS distance
      FROM items
      JOIN shops ON items.shop_id = shops.id
      WHERE LOWER(items.item_name) LIKE LOWER($3)
      ORDER BY distance ASC
      LIMIT 20`,
      [lat, lng, `%${item}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("SEARCH ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 3. RECENTLY VIEWED (Fixed for Number IDs)
// -----------------------------------------------------
router.get("/list", auth, async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.json([]);

    // Split and convert to Integers to avoid SQL errors
    const validIds = ids.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id)); // Remove non-numbers
    
    if (validIds.length === 0) return res.json([]);

    const result = await pool.query(
      `SELECT items.id, items.item_name, items.quantity, items.unit_type, items.image_url, shops.shop_name 
       FROM items 
       JOIN shops ON items.shop_id = shops.id
       WHERE items.id = ANY($1::int[])`, // Explicitly looking for Integers
      [validIds]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("LIST ERROR:", err.message);
    res.json([]); 
  }
});

// -----------------------------------------------------
// 4. SINGLE ITEM DETAILS (Fixed: Removed UUID Check)
// -----------------------------------------------------
router.get("/item/:id", auth, async (req, res) => {
  try {
    // We REMOVED the regex check here so "5" is allowed
    const itemId = req.params.id;

    const result = await pool.query(
      `SELECT items.*, shops.shop_name, shops.phone_number, shops.latitude, shops.longitude
       FROM items
       JOIN shops ON items.shop_id = shops.id
       WHERE items.id = $1`,
      [itemId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ITEM ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
// 5. SHOP DETAILS
// -----------------------------------------------------
router.get("/shop/:id", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shops WHERE id = $1", [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
