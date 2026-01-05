import { inject } from 'inversify';
import { Err, Ok, Result } from '@gum-tech/flow-ts';
import { WordQuotaService } from './types/wordQuotaService';
import { WordQuotaRepository } from './types/wordQuotaRepository';
import { TYPE } from '../../inversify/type.inversify';
import {
  JustifyTextError,
  JUSTIFY_TEXT_ERROR,
} from './errors/justifyTextError';
import { CONFIG } from '../../../config';

const DAILY_QUOTA = CONFIG.wordQuota;

export class WordQuotaConcreteService implements WordQuotaService {
  constructor(
    @inject(TYPE.WordQuotaRepository)
    private readonly wordQuotaRepository: WordQuotaRepository,
  ) {}

  async checkAndIncrementQuota(
    token: string,
    wordCount: number,
  ): Promise<Result<number, JustifyTextError>> {
    const newCount = await this.wordQuotaRepository.incrementWordCount(
      token,
      wordCount,
    );
    if (newCount > DAILY_QUOTA) {
      await this.wordQuotaRepository.incrementWordCount(token, -wordCount);
      const remaining = Math.max(0, DAILY_QUOTA - (newCount - wordCount));
      return Err({
        type: JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED,
        remaining,
      });
    }
    return Ok(newCount);
  }
}
