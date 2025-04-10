const { query } = require('../config/db');

async function getLead(id) {
  const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function createLead(lead) {
  const result = await query(
    'INSERT INTO leads (name, email, phone, company, industry, source, status, assigned_to_id, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
    [lead.name, lead.email, lead.phone, lead.company, lead.industry, lead.source, lead.status || 'new', lead.assignedToId, lead.notes]
  );
  return result.rows[0];
}

async function updateLead(id, leadData) {
  const fields = Object.keys(leadData).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(leadData);
  const result = await query(
    `UPDATE leads SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || undefined;
}

async function deleteLead(id) {
  const result = await query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function getLeads() {
  const result = await query('SELECT * FROM leads');
  return result.rows;
}

async function getLeadsByAssignee(userId) {
  const result = await query('SELECT * FROM leads WHERE assigned_to_id = $1', [userId]);
  return result.rows;
}

module.exports = {
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeads,
  getLeadsByAssignee,
};