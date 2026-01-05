import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config';

export function setupSwaggerRoutes(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
