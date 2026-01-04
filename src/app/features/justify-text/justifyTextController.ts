import { inject } from 'inversify';
import { MiddlewareFunction } from '../../types/middlewareFunction';
import { TYPE } from '../../inversify/type.inversify';
import { JustifyTextService } from './types/justifyTextService';
import { isErr } from '@gum-tech/flow-ts';
import { Response } from 'express';
import {
  JUSTIFY_TEXT_ERROR,
  JustifyTextError,
} from './errors/justifyTextError';
import { isKnownError } from '../../utils/isKnownError';

export class JustifyTextController {
  constructor(
    @inject(TYPE.JustifyTextService)
    private readonly _justifyTextService: JustifyTextService,
  ) {}
  public justify: MiddlewareFunction = (req, res) => {
    try {
      const text = req.body;
      // Justifier le texte
      const justifiedText = this._justifyTextService.justify(text);
      if (isErr(justifiedText)) {
        const error = justifiedText.unwrapErr();
        return this.handleJustifyTextError(error, res);
      }
      // Retourner le texte justifié
      res.type('text/plain').send(justifiedText.unwrap());
    } catch (error) {
      if (isKnownError(error, JUSTIFY_TEXT_ERROR)) {
        return this.handleJustifyTextError(error, res);
      }

      console.error('Unexpected error in justify:', error);
      return res.status(500).send('Erreur interne du serveur');
    }
  };
  private handleJustifyTextError(error: JustifyTextError, res: Response) {
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
