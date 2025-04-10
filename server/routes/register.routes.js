const { createServer } = require('http');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const leadRoutes = require('./lead.routes');
const clientRoutes = require('./client.routes');
const contactRoutes = require('./contact.routes');
const activityRoutes = require('./activity.routes');
const fileRoutes = require('./file.routes');
const userRoutes = require('./user.routes');
const optionRoutes = require('./option.routes');
const { setupSwagger } = require('../utils/swagger');

async function registerRoutes(app) {
  // Setup Swagger UI
  setupSwagger(app);

  // Register individual route modules
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api', contactRoutes); // Note: /contacts is top-level, adjust if needed
  app.use('/api/activities', activityRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/options', optionRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

module.exports = { registerRoutes };