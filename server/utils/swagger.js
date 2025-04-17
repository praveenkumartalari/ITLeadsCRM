const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartLead CRM API',
      version: '1.0.0',
      description: 'API documentation for the SmartLead CRM application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/auth.routes.js',
    './routes/dashboard.routes.js',
    './routes/lead.routes.js',
    './routes/client.routes.js',
    './routes/contact.routes.js',
    './routes/activity.routes.js',
    './routes/file.routes.js',
    './routes/user.routes.js',
    './routes/option.routes.js',
    './routes/interaction.routes.js',
    './routes/task.routes.js',   
    './routes/scoring.routes.js'   
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { setupSwagger };