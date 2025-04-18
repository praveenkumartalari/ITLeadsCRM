const { getLeads, getLead, createLead, updateLead, deleteLead } = require('../models/lead.model');
const { insertLeadSchema } = require('../schema/schema');
const { isValidPhone, isValidBudget, isValidDate } = require('../utils/Validations');
const EmailService = require('../services/email.service');
const { getUser } = require('../models/user.model');
const { logLeadActivity } = require('../models/activity.model');

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
    const id = req.params.id;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid input',
        data: null,
        error: { code: 'INVALID_ID', details: 'Lead ID must be a valid UUID' },
      });
    }

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
    // Normalize expectedCloseDate
    const bodyWithNormalizedDate = {
      ...req.body,
      expectedCloseDate: req.body.expectedCloseDate
        ? new Date(req.body.expectedCloseDate).toISOString()
        : undefined,
    };

    // Add creator information and handle score from authenticated user
    const validatedData = insertLeadSchema.parse({
      ...bodyWithNormalizedDate,
      score: req.body.score || 0,
      createdById: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Validate phone if provided
    if (validatedData.phone && !isValidPhone(validatedData.phone)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Error",
        data: null,
        error: { code: "INVALID_PHONE", details: "Invalid phone number format" },
      });
    }

    // Validate budget if provided
    if (validatedData.budget && !isValidBudget(validatedData.budget)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Error",
        data: null,
        error: { code: "INVALID_BUDGET", details: "Budget cannot be negative" },
      });
    }

    const lead = await createLead({
      ...validatedData,
      score: validatedData.score,
      created_by_id: req.user.id,
      created_at: new Date(),
    });

    console.log(`Lead created: ${lead.id} by user: ${req.user.id}, score: ${lead.score}`);

    res.status(201).json({
      status: 201,
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Error",
        data: null,
        error: { code: "VALIDATION_ERROR", details: error.errors },
      });
    }

    if (error.name === "DuplicateError") {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Conflict Error",
        data: null,
        error: { code: error.code, details: error.message },
      });
    }

    // Handle database unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Conflict Error",
        data: null,
        error: { code: "DUPLICATE_EMAIL", details: "A lead with this email already exists" },
      });
    }

    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "Error creating lead" },
    });
  }
}

async function updatelead(req, res) {
  try {
    const id = req.params.id;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid input",
        data: null,
        error: { code: "INVALID_ID", details: "Lead ID must be a valid UUID" },
      });
    }

    const existingLead = await getLead(id);
    if (!existingLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Lead not found" },
      });
    }

    // Normalize expectedCloseDate
    const bodyWithNormalizedDate = {
      ...req.body,
      expectedCloseDate: req.body.expectedCloseDate
        ? new Date(req.body.expectedCloseDate).toISOString()
        : undefined,
    };

    const validatedData = insertLeadSchema.partial().parse(bodyWithNormalizedDate);

    const updatedLead = await updateLead(id, validatedData);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Error",
        data: null,
        error: { code: "VALIDATION_ERROR", details: error.errors },
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "Error updating lead" },
    });
  }
}
async function deletelead(req, res) {
  try {
    const id = req.params.id;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid input',
        data: null,
        error: { code: 'INVALID_ID', details: 'Lead ID must be a valid UUID' },
      });
    }

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

async function assignLead(req, res) {
  try {
    const { leadId } = req.params;
    const { assignedToId, notes } = req.body;
    const assignerId = req.user.id;

    // Validate UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(leadId) || !uuidRegex.test(assignedToId)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid input',
        error: { code: 'INVALID_ID', details: 'Lead ID and Assigned To ID must be valid UUIDs' }
      });
    }

    // Get current lead
    const currentLead = await getLead(leadId);
    if (!currentLead) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Lead not found'
      });
    }

    // Get assigned user details with role info
    const assignedUser = await getUser(assignedToId);
    if (!assignedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Assigned user not found'
      });
    }

    // Check if user can be assigned leads based on role and settings
    if (!assignedUser.can_be_assigned_leads && !assignedUser.role.includes('sales')) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'User cannot be assigned leads',
        error: {
          code: 'INVALID_ASSIGNMENT',
          details: 'Selected user cannot be assigned leads. User must have sales role and assignment capability enabled.'
        }
      });
    }

    // Check user's current lead count
    const userLeadCount = await getLeadCountByUser(assignedToId);
    const MAX_LEADS_PER_USER = 50; // Configure based on your needs
    if (userLeadCount >= MAX_LEADS_PER_USER) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'User has reached maximum lead assignment limit',
        error: { code: 'ASSIGNMENT_LIMIT', details: `Users cannot be assigned more than ${MAX_LEADS_PER_USER} leads` }
      });
    }

    // Update lead assignment
    const updatedLead = await updateLead(leadId, { 
      assigned_to_id: assignedToId,
      updated_by_id: assignerId,
      assignment_date: new Date(),
      last_assignment_notes: notes || null
    });

    // Send email notification
    await EmailService.sendTemplatedEmail({
      to: assignedUser.email,
      template: 'LEAD_ASSIGNED',
      context: {
        userName: assignedUser.username,
        leadName: updatedLead.name,
        company: updatedLead.company,
        status: updatedLead.status,
        assignerName: req.user.username,
        notes: notes || 'No additional notes provided'
      }
    });

    // Log the assignment activity
    await logLeadActivity({
      leadId,
      userId: assignerId,
      type: 'ASSIGNMENT',
      description: `Lead assigned to ${assignedUser.username}${notes ? ` - Notes: ${notes}` : ''}`,
      metadata: {
        previous_assigned_to: currentLead.assigned_to_id,
        new_assigned_to: assignedToId,
        assigner_id: assignerId
      }
    });

    // Create a follow-up task
    await createTask({
      title: `Initial contact for lead: ${updatedLead.name}`,
      description: `Follow up with newly assigned lead from ${updatedLead.company}`,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      priority: 'HIGH',
      type: 'FOLLOW_UP',
      lead_id: leadId,
      assigned_to_id: assignedToId,
      created_by_id: assignerId
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Lead assigned successfully',
      data: {
        lead: updatedLead,
        assigned_to: {
          id: assignedUser.id,
          username: assignedUser.username,
          email: assignedUser.email
        },
        assignment_date: updatedLead.assignment_date,
        assigned_by: req.user.username
      }
    });

  } catch (error) {
    console.error('Error assigning lead:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to assign lead',
      error: { code: 'ASSIGNMENT_ERROR', details: error.message }
    });
  }
}

module.exports = { listLeads, listLead, createlead, updatelead, deletelead, assignLead };