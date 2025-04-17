const { createInteraction, getLeadInteractions, getRecentInteractions } = require('../models/interaction.model');
const { insertInteractionSchema } = require('../schema/schema');
const { calculateLeadScore } = require('../models/leadScoring.model');
const { createTask } = require('../models/task.model');
const { getLeadAnalytics } = require('../models/analytics.model');

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

    let associatedTask = null;

    // Automatically create follow-up task if nextFollowUp is provided
    if (validatedData.nextFollowUp) {
      associatedTask = await createTask({
        title: `Follow up: ${validatedData.title}`,
        description: `Follow up needed for ${validatedData.type.toLowerCase()} - ${validatedData.description || ''}`,
        dueDate: validatedData.nextFollowUp,
        priority: 'HIGH',
        type: 'FOLLOW_UP',
        leadId: validatedData.leadId,
        assignedToId: req.user.id,
        createdById: req.user.id,
        sourceInteractionId: interaction.id
      });
    }

    // Calculate new lead score
    const newScore = await calculateLeadScore(validatedData.leadId);

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Interaction created successfully',
      data: {
        ...interaction,
        newScore,
        associatedTask
      }
    });
  } catch (error) {
    console.error('Error creating interaction:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      error: { 
        code: 'SERVER_ERROR', 
        details: 'Error creating interaction',
        message: error.message 
      }
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

async function getLeadMetrics(req, res) {
  try {
    const analytics = await getLeadAnalytics(req.params.leadId);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching analytics' }
    });
  }
}

module.exports = {
  addInteraction,
  getInteractionHistory,
  getLeadMetrics
};