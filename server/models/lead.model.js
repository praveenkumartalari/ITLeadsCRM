const { query } = require('../config/db');

async function getLead(id) {
  const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function getLeadByEmail(email) {
  const result = await query(
    'SELECT * FROM leads WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return result.rows[0];
}

async function createLead(lead) {
  // Check for existing lead with same email
  const existingLead = await getLeadByEmail(lead.email);
  if (existingLead) {
    throw {
      name: 'DuplicateError',
      message: 'A lead with this email already exists',
      code: 'DUPLICATE_EMAIL'
    };
  }

  const result = await query(
    `INSERT INTO leads (
      name, 
      email, 
      phone, 
      company, 
      industry,
      source, 
      status, 
      assigned_to_id,
      notes,
      budget, 
      expected_close_date,
      created_by_id,
      created_at,
      updated_at,
      score
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.industry,
      lead.source,
      lead.status || 'new',
      lead.assignedToId,
      lead.notes,
      lead.budget,
      lead.expectedCloseDate,
      lead.created_by_id,
      lead.created_at,
      lead.updated_at,
      lead.score || 0
    ]
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
  getLeadByEmail,
  createLead,
  updateLead,
  deleteLead,
  getLeads,
  getLeadsByAssignee,
};