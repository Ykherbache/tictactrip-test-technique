import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../../../config';

const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const isProduction =
  process.env.NODE_ENV === 'production' ||
  !fs.existsSync(path.join(projectRoot, 'src'));

const apiPaths: string[] = [];
if (isProduction) {
  apiPaths.push(
    path.join(projectRoot, 'dist', 'app', 'features', '**', '*.js'),
    path.join(projectRoot, 'dist', 'app', 'routes', '**', '*.js'),
  );
} else {
  apiPaths.push(
    path.join(projectRoot, 'src', 'app', 'features', '**', '*.ts'),
    path.join(projectRoot, 'src', 'app', 'routes', '**', '*.ts'),
  );
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Justification de Texte - Tic Tac Trip',
      version: '1.0.0',
      description:
        'API REST permettant de justifier du texte à 80 caractères par ligne avec authentification par token et gestion de quota quotidien de mots.',
      contact: {
        name: 'Yacine Kherbache',
        email: 'yacinekherbache@yaci.fr',
      },
      license: {
        name: 'AGPL-3.0',
      },
    },
    servers: [
      {
        url: `http://localhost:${CONFIG.port}`,
        description: 'Serveur de développement local',
      },
      {
        url: 'https://tictactrip-test.yaci.fr',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'UUID',
          description: "Token d'authentification obtenu via /api/token",
        },
      },
      schemas: {
        TokenRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
              description: 'Adresse email valide',
            },
          },
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
              description:
                "Token d'authentification à utiliser dans les requêtes suivantes",
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Email is required',
              description: "Message d'erreur descriptif",
            },
          },
        },
        QuotaExceededError: {
          type: 'string',
          example:
            'Quota dépassé. Quota restant: 0 mots. Limite quotidienne: 80000 mots.',
          description: "Message d'erreur indiquant le quota restant",
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description:
          "Endpoints pour l'authentification et la génération de tokens",
      },
      {
        name: 'Text Justification',
        description: 'Endpoints pour la justification de texte',
      },
    ],
  },
  apis: apiPaths,
};

export const swaggerSpec = swaggerJsdoc(options);
