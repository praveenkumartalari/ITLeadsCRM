const { query } = require('../config/db');

async function getFile(id) {
  const result = await query('SELECT * FROM files WHERE id = $1', [id]);
  return result.rows[0] || undefined;
}

async function createFile(file) {
  const result = await query(
    'INSERT INTO files (file_name, file_url, file_type, related_to, related_id, uploaded_by_id, uploaded_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
    [file.fileName, file.fileUrl, file.fileType, file.relatedTo, file.relatedId, file.uploadedById]
  );
  return result.rows[0];
}

async function deleteFile(id) {
  const result = await query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

async function listFilesByRelated(relatedTo, relatedId) {
  const result = await query('SELECT * FROM files WHERE related_to = $1 AND related_id = $2', [relatedTo, relatedId]);
  return result.rows;
}

module.exports = {
  getFile,
  createFile,
  deleteFile,
  listFilesByRelated,
};