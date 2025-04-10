const { listActivities, listActivitiesByUser, listUpcomingActivities, createActivity, updateActivity, deleteActivity, getActivity } = require('../models/activity.model');
const { insertActivitySchema } = require('../schema/schema');

async function listactivities(req, res) {
  try {
    const activities = await listActivities();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching activities' },
    });
  }
}

async function listactivitiesByUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const activities = await listActivitiesByUser(userId);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching user activities' },
    });
  }
}

async function listUpcomingactivities(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const activities = await listUpcomingActivities(userId, days);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching upcoming activities:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching upcoming activities' },
    });
  }
}

async function createactivity(req, res) {
  try {
    const validatedData = insertActivitySchema.parse(req.body);
    const activity = await createActivity(validatedData);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: activity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function updateactivity(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existingActivity = await getActivity(id);
    if (!existingActivity) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Activity not found' },
      });
    }
    const validatedData = insertActivitySchema.partial().parse(req.body);
    const updatedActivity = await updateActivity(id, validatedData);
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: updatedActivity,
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Invalid input',
      data: null,
      error: { code: 'INVALID_DATA', details: error.message },
    });
  }
}

async function deleteactivity(req, res) {
  try {
    const id = parseInt(req.params.id);
    const success = await deleteActivity(id);
    if (!success) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'Activity not found' },
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { message: 'Activity deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error deleting activity' },
    });
  }
}

module.exports = {
  listactivities,
  listactivitiesByUser,
  listUpcomingactivities,
  createactivity,
  updateactivity,
  deleteactivity,
};  