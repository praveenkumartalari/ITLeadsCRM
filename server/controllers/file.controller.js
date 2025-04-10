const { listFilesByRelated, createFile, deleteFile, getFile } = require('../models/file.model');
const { insertFileSchema } = require('../schema/schema');

async function listfilesByRelated(req, res) {
  try {
    const { relatedTo, relatedId } = req.params;
    const files = await listFilesByRelated(relatedTo, parseInt(relatedId));
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: files,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching files' },
    });
  }
}

async function createfile(req, res) {
  try {
    const validatedData = insertFileSchema.parse(req.body);
    const file = await createFile(validatedData);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: file,
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function deletefile(req, res) {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteFile(id);
    if (!success) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'File not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { message: 'File deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error deleting file' },
    });
  }
}

module.exports = { listfilesByRelated, createfile, deletefile };