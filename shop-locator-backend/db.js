// import pkg from "pg";
// const { Pool } = pkg;

// const pool = new Pool({
//   host: "localhost",
//   port: 5432,
//   user: "postgres",
//   password: "postgres",   // MUST be a string
//   database: "shopdb",
// });

// export default pool;
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this matches Vercel exactly
  ssl: {
    rejectUnauthorized: false // This is required for Neon/Vercel connections
  }
});

module.exports = pool;