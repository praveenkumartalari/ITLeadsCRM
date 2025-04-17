const { calculateLeadScore } = require('../models/leadScoring.model');
const { isValidScore } = require('../utils/Validations');
const { updateLead } = require('../models/lead.model');

async function getLeadScore(req, res) {
  try {
    const score = await calculateLeadScore(req.params.leadId);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Score retrieved successfully',
      data: { score }
    });
  } catch (error) {
    console.error('Error calculating score:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      error: { code: 'SERVER_ERROR', details: 'Error calculating score' }
    });
  }
}

async function updateLeadScore(req, res) {
  try {
    const { score } = req.body;
    const leadId = req.params.leadId;

    // Validate score
    if (!isValidScore(score)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation Error',
        error: { 
          code: 'INVALID_SCORE', 
          details: 'Score must be between 0 and 100' 
        }
      });
    }

    // Update the lead score
    const updatedLead = await updateLead(leadId, { 
      score,
      updated_at: new Date(),
      updated_by_id: req.user.id
    });

    if (!updatedLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Lead not found',
        error: { code: 'NOT_FOUND', details: 'Lead not found' }
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Score updated successfully',
      data: { score: updatedLead.score }
    });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      error: { code: 'SERVER_ERROR', details: 'Error updating score' }
    });
  }
}

module.exports = { 
  getLeadScore,
  updateLeadScore 
};