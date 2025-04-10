const { leadStatusOptions, leadSourceOptions } = require('../schema/schema');

function getLeadStatuses(req, res) {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Request successful',
    data: leadStatusOptions,
  });
}

function getLeadSources(req, res) {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Request successful',
    data: leadSourceOptions,
  });
}

module.exports = { getLeadStatuses, getLeadSources };