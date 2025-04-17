const { createInteraction, getLeadInteractions, getRecentInteractions } = require('../models/interaction.model');
const { insertInteractionSchema } = require('../schema/schema');

async function addInteraction(req, res) {
  try {
    const validatedData = insertInteractionSchema.parse({
      ...req.body,
      leadId: req.params.leadId
    });

    const interaction = await createInteraction({
      ...validatedData,
      created_by_id: req.user.id
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Interaction recorded successfully',
      data: interaction
    });
  } catch (error) {
    console.error('Error creating interaction:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation Error',
        data: null,
        error: { code: 'VALIDATION_ERROR', details: error.errors }
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error recording interaction' }
    });
  }
}

async function getInteractionHistory(req, res) {
  try {
    const interactions = await getLeadInteractions(req.params.leadId);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: interactions
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching interactions' }
    });
  }
}

module.exports = {
  addInteraction,
  getInteractionHistory
};