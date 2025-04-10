const { query } = require('../config/db'); // Adjusted to point to models/db.js
const bcrypt = require('bcryptjs');

async function getUser(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function getUserByUsername(username) {
  const result = await query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
  return result.rows[0] || undefined;
}

async function getUserByEmail(email) {
  const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return result.rows[0] || undefined;
}

async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const result = await query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [user.username, user.email, hashedPassword, user.role || 'sales_rep']
  );
  return result.rows[0];
}

async function updateUser(id, userData) {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  const fields = Object.keys(userData).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(userData);
  const result = await query(
    `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || undefined;
}

async function listUsers() {
  const result = await query('SELECT * FROM users');
  return result.rows;
}

module.exports = {
  getUser,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  listUsers,
};