const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // set true nếu deploy lên vercel hoặc render
});

module.exports = pool;
