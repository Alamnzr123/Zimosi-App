import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zimosi API',
      version: '1.0.0',
      description: 'API documentation for Zimosi App',
    },
  },
  // Include both source .ts for JSDoc generation and emitted .js files for runtime accuracy
  apis: ['./api/routes/*.ts', './api/controllers/*.ts', './api/routes/*.js', './api/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
