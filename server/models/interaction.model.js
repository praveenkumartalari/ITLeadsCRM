const { query } = require('../config/db');

async function createInteraction(interaction) {
  const result = await query(
    `INSERT INTO lead_interactions (
      lead_id,
      type,
      title,
      description,
      interaction_date,
      next_follow_up,
      duration_minutes,
      outcome,
      created_by_id,
      metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`,
    [
      interaction.leadId,
      interaction.type,
      interaction.title,
      interaction.description,
      interaction.interactionDate,
      interaction.nextFollowUp,
      interaction.durationMinutes,
      interaction.outcome,
      interaction.created_by_id,
      interaction.metadata || {}
    ]
  );
  return result.rows[0];
}

async function getLeadInteractions(leadId) {
  const result = await query(
    `SELECT 
      i.*,
      u.username as created_by_name
    FROM lead_interactions i
    LEFT JOIN users u ON u.id = i.created_by_id
    WHERE i.lead_id = $1
    ORDER BY i.interaction_date DESC`,
    [leadId]
  );
  return result.rows;
}

async function getRecentInteractions(limit = 10) {
  const result = await query(
    `SELECT 
      i.*,
      l.name as lead_name,
      u.username as created_by_name
    FROM lead_interactions i
    JOIN leads l ON l.id = i.lead_id
    LEFT JOIN users u ON u.id = i.created_by_id
    ORDER BY i.interaction_date DESC
    LIMIT $1`,
    [limit]
  );
  return result.rows;
}

module.exports = {
  createInteraction,
  getLeadInteractions,
  getRecentInteractions
};