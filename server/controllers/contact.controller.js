const { listContactsByClient, createContact, updateContact, deleteContact, getContact } = require('../models/contact.model');
const { insertContactSchema } = require('../schema/schema');

async function listContactsByclient(req, res) {
  try {
    const clientId = parseInt(req.params.clientId);
    const contacts = await listContactsByClient(clientId);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching contacts' },
    });
  }
}

async function createcontact(req, res) {
  try {
    const validatedData = insertContactSchema.parse(req.body);
    const contact = await createContact(validatedData);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function updatecontact(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existingContact = await getContact(id);
    if (!existingContact) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Contact not found' },
      });
    }
    const validatedData = insertContactSchema.partial().parse(req.body);
    const updatedContact = await updateContact(id, validatedData);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function deletecontact(req, res) {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteContact(id);
    if (!success) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Contact not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { message: 'Contact deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error deleting contact' },
    });
  }
}

module.exports = { listContactsByclient, createcontact, updatecontact, deletecontact };