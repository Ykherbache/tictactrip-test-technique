import { Router } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { JustifyTextController } from './justifyTextController';
import { isConnected } from '../auth/middlewares/isConnected';

function getJustifyTextController() {
  return iocContainer.get(JustifyTextController);
}

/**
 * @swagger
 * /api/justify:
 *   post:
 *     tags:
 *       - Text Justification
 *     summary: Justifie un texte à 80 caractères par ligne
 *     description: |
 *       Formate un texte en le justifiant à exactement 80 caractères par ligne (sauf la dernière ligne de chaque paragraphe).
 *       Les espaces sont distribués uniformément entre les mots pour atteindre la largeur cible.
 *
 *       **Important** :
 *       - Chaque utilisateur a un quota quotidien de 80 000 mots (configurable)
 *       - Le quota est réinitialisé automatiquement à minuit UTC
 *       - Le texte est compté en mots avant justification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
 *         description: >
 *           Texte brut à justifier (limite : 25MB)
 *     responses:
 *       200:
 *         description: Texte justifié avec succès
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit  sed  do
 *               eiusmod  tempor  incididunt  ut  labore  et  dolore  magna  aliqua
 *       400:
 *         description: Texte vide ou format invalide
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             examples:
 *               empty:
 *                 value: "Le texte ne peut pas être vide"
 *               invalid:
 *                 value: "Le corps de la requête doit être du texte brut valide"
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             example: "Token manquant"
 *       402:
 *         description: Quota quotidien dépassé
 *         content:
 *           text/html:
 *             schema:
 *               $ref: '#/components/schemas/QuotaExceededError'
 *             example: "Quota dépassé. Quota restant: 0 mots. Limite quotidienne: 80000 mots."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             example: "Erreur interne du serveur"
 */
export function setupJustifyTextRoutes(): Router {
  const justifyTextController = getJustifyTextController();
  const router = Router();
  router.post('/justify', isConnected, justifyTextController.justify);
  return router;
}
