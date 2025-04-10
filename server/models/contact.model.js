const { query } = require('../config/db');

async function getContact(id) {
  const result = await query('SELECT * FROM contacts WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function createContact(contact) {
  const result = await query(
    'INSERT INTO contacts (client_id, name, email, phone, position, is_primary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [contact.clientId, contact.name, contact.email, contact.phone, contact.position, contact.isPrimary || false]
  );
  return result.rows[0];
}

async function updateContact(id, contactData) {
  const fields = Object.keys(contactData).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(contactData);
  const result = await query(
    `UPDATE contacts SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || undefined;
}

async function deleteContact(id) {
  const result = await query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function listContactsByClient(clientId) {
  const result = await query('SELECT * FROM contacts WHERE client_id = $1', [clientId]);
  return result.rows;
}

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  listContactsByClient,
};