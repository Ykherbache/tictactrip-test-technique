import { Router } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { AuthController } from './authController';

function getAuthController() {
  return iocContainer.get(AuthController);
}

/**
 * @swagger
 * /api/token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Génère un token d'authentification
 *     description: Crée un nouveau token d'authentification à partir d'une adresse email valide. Ce token doit être utilisé dans l'en-tête Authorization pour accéder aux autres endpoints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenRequest'
 *           example:
 *             email: user@example.com
 *     responses:
 *       200:
 *         description: Token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *             example:
 *               token: "550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Email manquant ou format invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing:
 *                 value:
 *                   error: "Email is required"
 *               invalid:
 *                 value:
 *                   error: "Invalid email format"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export function setupAuthRouter(): Router {
  const authController = getAuthController();
  const router = Router();
  router.post('/token', authController.generateToken);
  return router;
}
