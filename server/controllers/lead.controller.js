const { getLeads, getLead, createLead, updateLead, deleteLead } = require('../models/lead.model');
const { insertLeadSchema } = require('../schema/schema');

async function listLeads(req, res) {
  try {
    const leads = await getLeads();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching leads' },
    });
  }
}

async function listLead(req, res) {
  try {
    const id = parseInt(req.params.id);
    const lead = await getLead(id);
    if (!lead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Lead not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: lead,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching lead' },
    });
  }
}

async function createlead(req, res) {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    const lead = await createLead(validatedData);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: lead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function updatelead(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existingLead = await getLead(id);
    if (!existingLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Lead not found' },
      });
    }
    const validatedData = insertLeadSchema.partial().parse(req.body);
    const updatedLead = await updateLead(id, validatedData);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: updatedLead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function deletelead(req, res) {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteLead(id);
    if (!success) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Lead not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { message: 'Lead deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error deleting lead' },
    });
  }
}

module.exports = { listLeads, listLead, createlead, updatelead, deletelead };