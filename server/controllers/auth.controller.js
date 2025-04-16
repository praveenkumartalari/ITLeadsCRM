const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByUsername, getUserByEmail, createUser, getUser } = require('../models/user.model');
const {isValidPassword, isValidEmail} = require("../utils/Validations");

const JWT_SECRET = process.env.JWT_SECRET || 'smartlead-jwt-secret';
const JWT_EXPIRES_IN = '24h';

// Helper function to set auth cookie
function setAuthCookie(res, token) {
  res.cookie("auth_token", token, {
    expires: new Date(Date.now() + 3600000), // 1 hour
   
  });
}

async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if(!isValidEmail(email)){
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation Error',
        data: null,
        error: { code: 'VALIDATION_ERROR', details: 'Invalid email format' },
      });
    } 


    if(!isValidPassword(password)){
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation Error',
        data: null,
        error: { code: 'VALIDATION_ERROR', details: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
      });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: 'Conflict detected',
        data: null,
        error: { code: 'RESOURCE_EXISTS', details: 'Username already exists' },
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: 'Conflict detected',
        data: null,
        error: { code: 'RESOURCE_EXISTS', details: 'Email already exists' },
      });
    }

    // Password is hashed in createUser function
    const user = await createUser({
      username,
      email,
      password,
      role: role || 'sales_rep',
    });

    const token = jwt.sign(
      { id: user.id, username: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set the token in cookie
    setAuthCookie(res, token);

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'An unexpected error occurred' },
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log("Login attempt with username:", username);
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized access',
        data: null,
        error: { code: 'AUTH_ERROR', details: 'Invalid credentials' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized access',
        data: null,
        error: { code: 'AUTH_ERROR', details: 'Invalid credentials' },
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, // This will now be a UUID
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    setAuthCookie(res, token);
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'An unexpected error occurred' },
    });
  }
}

function authenticate(req, res, next) {
  try {
    const token = req.cookies.auth_token; 

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized access',
        data: null,
        error: { code: 'AUTH_ERROR', details: 'Authentication required' },
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized access',
      data: null,
      error: { code: 'AUTH_ERROR', details: 'Invalid or expired token' },
    });
  }
}

async function logout(req, res) {
  res.clearCookie('auth_token', null, { 
    expires:new Date(Date.now()),
    httpOnly: true,
  });
  
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Logged out successfully',
    data: null
  });
}

function authorize(roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized access',
        data: null,
        error: { code: 'AUTH_ERROR', details: 'Authentication required' },
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Access forbidden',
        data: null,
        error: { code: 'PERMISSION_DENIED', details: 'Insufficient permissions' },
      });
    }
    next();
  };
}

async function getCurrentUser(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized access',
        data: null,
        error: { code: 'AUTH_ERROR', details: 'Authentication required' },
      });
    }

    const userData = await getUser(user.id);
    if (!userData) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: { code: 'NOT_FOUND', details: 'User not found' },
      });
    }

    const { password: _, ...userWithoutPassword } = userData;
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: { code: 'SERVER_ERROR', details: 'An unexpected error occurred' },
    });
  }
}

module.exports = { register, login, logout, authenticate, authorize, getCurrentUser };