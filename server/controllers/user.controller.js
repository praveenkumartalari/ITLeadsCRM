const { listUsers } = require('../models/user.model');

async function listusers(req, res) {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'Access forbidden',
                data: null,
                error: { 
                    code: 'PERMISSION_DENIED', 
                    details: 'Only administrators can view all users' 
                }
            });
        }

        const users = await listUsers();
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                isAdmin: userWithoutPassword.role === 'admin',
                roleName: getRoleName(userWithoutPassword.role)
            };
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Users retrieved successfully',
            data: usersWithoutPasswords,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            data: null,
            error: { code: 'SERVER_ERROR', details: 'Error fetching users' }
        });
    }
}

// Helper function to get readable role names
function getRoleName(role) {
    const roleMap = {
        'admin': 'Administrator',
        'manager': 'Sales Manager',
        'team_lead': 'Team Lead',
        'sales_rep': 'Sales Representative'
    };
    return roleMap[role] || role;
}

module.exports = { listusers };