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
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, 
  ssl: {
    rejectUnauthorized: false // Required for Neon and Vercel
  }
});

export default pool;