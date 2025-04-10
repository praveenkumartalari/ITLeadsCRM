const { listClients, getClient, createClient, updateClient, deleteClient } = require('../models/client.model');
const { insertClientSchema } = require('../schema/schema');

async function listclients(req, res) {
  try {
    const clients = await listClients();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching clients' },
    });
  }
}

async function getclient(req, res) {
  try {
    const id = parseInt(req.params.id);
    const client = await getClient(id);
    if (!client) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Client not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: client,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching client' },
    });
  }
}

async function createclient(req, res) {
  try {
    const validatedData = insertClientSchema.parse(req.body);
    const client = await createClient(validatedData);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function updateclient(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existingClient = await getClient(id);
    if (!existingClient) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Client not found' },
      });
    }
    const validatedData = insertClientSchema.partial().parse(req.body);
    const updatedClient = await updateClient(id, validatedData);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: updatedClient,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function deleteclient(req, res) {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteClient(id);
    if (!success) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Client not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { message: 'Client deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error deleting client' },
    });
  }
}

module.exports = { listclients, getclient, createclient, updateclient, deleteclient };