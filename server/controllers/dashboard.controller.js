const { getDashboardStats } = require('../models/dashboard.model');

async function getStats(req, res) {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching dashboard statistics' },
    });
  }
}

module.exports = { getStats };