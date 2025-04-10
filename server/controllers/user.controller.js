const { listUsers } = require('../models/user.model');

async function listusers(req, res) {
  try {
    const users = await listUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: usersWithoutPasswords,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'Error fetching users' },
    });
  }
}

module.exports = { listusers };