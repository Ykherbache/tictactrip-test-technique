import { inject } from 'inversify';
import { MiddlewareFunction } from '../../types/middlewareFunction';
import { TYPE } from '../../inversify/type.inversify';
import { JustifyTextService } from './types/justifyTextService';
import { WordQuotaService } from './types/wordQuotaService';
import { isErr } from '@gum-tech/flow-ts';
import { Response } from 'express';
import {
  JUSTIFY_TEXT_ERROR,
  JustifyTextError,
} from './errors/justifyTextError';
import { extractToken } from './utils/extractToken';
import { countWords } from './utils/countWords';

export class JustifyTextController {
  constructor(
    @inject(TYPE.JustifyTextService)
    private readonly _justifyTextService: JustifyTextService,
    @inject(TYPE.WordQuotaService)
    private readonly _wordQuotaService: WordQuotaService,
  ) {}
  public justify: MiddlewareFunction = async (req, res) => {
    try {
      const text = req.body;
      const token = extractToken(req);

      if (!token) {
        return res.status(401).send('Token manquant');
      }

      const wordCount = countWords(text);
      const quotaResult = await this._wordQuotaService.checkAndIncrementQuota(
        token,
        wordCount,
      );

      if (isErr(quotaResult)) {
        const error = quotaResult.unwrapErr();
        if (
          typeof error === 'object' &&
          'type' in error &&
          error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
        ) {
          return res
            .status(402)
            .send(
              `Quota dépassé. Quota restant: ${error.remaining} mots. Limite quotidienne: 80000 mots.`,
            );
        }
        return res.status(500).send('Erreur interne du serveur');
      }

      const justifiedText = this._justifyTextService.justify(text);
      if (isErr(justifiedText)) {
        const error = justifiedText.unwrapErr();
        return this.handleJustifyTextError(error, res);
      }
      return res.type('text/plain').send(justifiedText.unwrap());
    } catch (error) {
      console.error('Unexpected error in justify:', error);
      return res.status(500).send('Erreur interne du serveur');
    }
  };
  private handleJustifyTextError(error: JustifyTextError, res: Response) {
    if (
      typeof error === 'object' &&
      'type' in error &&
      error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
    ) {
      return res
        .status(402)
        .send(
          `Quota dépassé. Quota restant: ${error.remaining} mots. Limite quotidienne: 80000 mots.`,
        );
    }

    switch (error) {
      case JUSTIFY_TEXT_ERROR.EMPTY_TEXT:
        return res.status(400).send('Le texte ne peut pas être vide');

      case JUSTIFY_TEXT_ERROR.INVALID_INPUT:
        return res
          .status(400)
          .send('Le corps de la requête doit être du texte brut valide');

      default:
        return res.status(500).send('Erreur interne du serveur');
    }
  }
}
