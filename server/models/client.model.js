const { query } = require('../config/db');

async function getclient(id) {
  const result = await query('SELECT * FROM clients WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function createclient(client) {
  const result = await query(
    'INSERT INTO clients (company_name, industry, location, contact_email, phone, website, notes, lead_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *',
    [client.companyName, client.industry, client.location, client.contactEmail, client.phone, client.website, client.notes, client.leadId]
  );
  return result.rows[0];
}

async function updateclient(id, clientData) {
  const fields = Object.keys(clientData).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(clientData);
  const result = await query(
    `UPDATE clients SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || undefined;
}

async function deleteclient(id) {
  const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function listclients() {
  const result = await query('SELECT * FROM clients');
  return result.rows;
}

module.exports = {
  getclient,
  createclient,
  updateclient,
  deleteclient,
  listclients,
};