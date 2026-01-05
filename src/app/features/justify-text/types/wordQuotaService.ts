import { Result } from '@gum-tech/flow-ts';
import { JustifyTextError } from '../errors/justifyTextError';

export interface WordQuotaService {
  checkAndIncrementQuota(
    token: string,
    wordCount: number,
  ): Promise<Result<number, JustifyTextError>>;
}
