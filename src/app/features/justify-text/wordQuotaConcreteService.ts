import { inject } from 'inversify';
import { Err, Ok, Result } from '@gum-tech/flow-ts';
import { WordQuotaService } from './types/wordQuotaService';
import { WordQuotaRepository } from './types/wordQuotaRepository';
import { TYPE } from '../../inversify/type.inversify';
import {
  JustifyTextError,
  JUSTIFY_TEXT_ERROR,
} from './errors/justifyTextError';

const DAILY_QUOTA = 80000;

export class WordQuotaConcreteService implements WordQuotaService {
  constructor(
    @inject(TYPE.WordQuotaRepository)
    private readonly wordQuotaRepository: WordQuotaRepository,
  ) {}

  async checkAndIncrementQuota(
    token: string,
    wordCount: number,
  ): Promise<Result<number, JustifyTextError>> {
    const currentCount = await this.wordQuotaRepository.getWordCount(token);
    const newCount = currentCount + wordCount;

    if (newCount > DAILY_QUOTA) {
      const remaining = Math.max(0, DAILY_QUOTA - currentCount);
      return Err({
        type: JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED,
        remaining,
      });
    }

    const finalCount = await this.wordQuotaRepository.incrementWordCount(
      token,
      wordCount,
    );
    return Ok(finalCount);
  }
}
