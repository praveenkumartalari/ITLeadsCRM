const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout for acquiring a connection
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};