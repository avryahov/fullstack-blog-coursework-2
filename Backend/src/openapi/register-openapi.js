import swaggerUi from 'swagger-ui-express';
import { createOpenApiSpec } from './spec.js';

export const registerOpenApi = app => {
  const openApiSpec = createOpenApiSpec();

  app.get('/api/openapi.json', (_req, res) => {
    res.status(200).json(openApiSpec);
  });

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Fullstack Blog API Docs',
      explorer: true,
      swaggerOptions: {
        url: '/api/openapi.json',
      },
    })
  );
};
