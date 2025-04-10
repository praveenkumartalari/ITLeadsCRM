const { query } = require('../config/db');

async function getActivity(id) {
  const result = await query('SELECT * FROM activities WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function createActivity(activity) {
  const result = await query(
    'INSERT INTO activities (type, title, notes, scheduled_at, completed, related_to, related_id, created_by_id, assigned_to_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
    [activity.type, activity.title, activity.notes, activity.scheduledAt, activity.completed || false, activity.relatedTo, activity.relatedId, activity.createdById, activity.assignedToId]
  );
  return result.rows[0];
}

async function updateActivity(id, activityData) {
  const fields = Object.keys(activityData).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(activityData);
  const result = await query(
    `UPDATE activities SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || undefined;
}

async function deleteActivity(id) {
  const result = await query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function listActivities() {
  const result = await query('SELECT * FROM activities');
  return result.rows;
}

async function listActivitiesByUser(userId) {
  const result = await query('SELECT * FROM activities WHERE assigned_to_id = $1', [userId]);
  return result.rows;
}

async function listActivitiesByRelated(relatedTo, relatedId) {
  const result = await query('SELECT * FROM activities WHERE related_to = $1 AND related_id = $2', [relatedTo, relatedId]);
  return result.rows;
}

async function listUpcomingActivities(userId, days = 7) {
  const result = await query(
    'SELECT * FROM activities WHERE assigned_to_id = $1 AND completed = false AND scheduled_at >= NOW() AND scheduled_at <= NOW() + INTERVAL $2 DAY ORDER BY scheduled_at ASC',
    [userId, days]
  );
  return result.rows;
}

module.exports = {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  listActivities,
  listActivitiesByUser,
  listActivitiesByRelated,
  listUpcomingActivities,
};