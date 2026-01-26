// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import shopsRoutes from "./routes/shops.js";
import itemsRoutes from "./routes/items.js";
import customerRoutes from "./routes/customer.js";
// import userRoutes from "./routes/users.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json()); // Correctly parses JSON payloads

// routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/customer", customerRoutes);

app.get("/", (req, res) => {
  res.send("Shop Locator API");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});