const express = require('express');
const { createServer } = require('http');
const { registerRoutes } = require('./routes/register.routes');
const { log } = require('./utils/log');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser());

// Test database connection on startup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect((err) => {
  if (err) {
    log(`Database connection error: ${err.stack}`);
  } else {
    log('Connected to PostgreSQL database');
  }
});

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }
      log(logLine);
    }
  });

  next();
});

// Main application setup
(async () => {
  // Register routes with Swagger UI
  const server = await registerRoutes(app);

  // Global error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
      status,
      success: false,
      message,
      data: null,
      error: {
        code: 'SERVER_ERROR',
        details: message,
      },
    });
    log(`Error: ${status} - ${message}`);
    throw err; // Re-throw for further handling if needed
  });

  // Start server
  const port = 5000;
  server.listen(
    {
      port,
      host: '127.0.0.1',
    },
    () => {
      log(`Serving on port ${port}`);
      log(`Swagger UI available at http://localhost:${port}/api-docs`);
    }
  );
})();