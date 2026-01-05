import { WordQuotaConcreteService } from '../../../src/app/features/justify-text/wordQuotaConcreteService';
import { WordQuotaInMemoryRepository } from '../../../src/app/features/justify-text/wordQuotaInMemoryRepository';
import { isErr, isOk } from '@gum-tech/flow-ts';
import { JUSTIFY_TEXT_ERROR } from '../../../src/app/features/justify-text/errors/justifyTextError';

describe('WordQuotaService', () => {
  let wordQuotaService: WordQuotaConcreteService;
  let wordQuotaRepository: WordQuotaInMemoryRepository;

  beforeEach(() => {
    wordQuotaRepository = new WordQuotaInMemoryRepository();
    wordQuotaService = new WordQuotaConcreteService(wordQuotaRepository);
  });

  describe('checkAndIncrementQuota', () => {
    it('should increment quota when within limit', async () => {
      const token = 'test-token';
      const wordCount = 100;

      const result = await wordQuotaService.checkAndIncrementQuota(
        token,
        wordCount,
      );

      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(100);
      }

      const currentCount = await wordQuotaRepository.getWordCount(token);
      expect(currentCount).toBe(100);
    });

    it('should accumulate word count across multiple calls', async () => {
      const token = 'test-token';
      const firstBatch = 500;
      const secondBatch = 300;

      const result1 = await wordQuotaService.checkAndIncrementQuota(
        token,
        firstBatch,
      );
      expect(isOk(result1)).toBe(true);

      const result2 = await wordQuotaService.checkAndIncrementQuota(
        token,
        secondBatch,
      );
      expect(isOk(result2)).toBe(true);
      if (isOk(result2)) {
        expect(result2.value).toBe(800);
      }

      const currentCount = await wordQuotaRepository.getWordCount(token);
      expect(currentCount).toBe(800);
    });

    it('should return error when quota would be exceeded', async () => {
      const token = 'test-token';
      const initialWords = 79999;
      const additionalWords = 2;

      await wordQuotaService.checkAndIncrementQuota(token, initialWords);

      const result = await wordQuotaService.checkAndIncrementQuota(
        token,
        additionalWords,
      );

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        const error = result.unwrapErr();
        expect(
          typeof error === 'object' &&
            'type' in error &&
            error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED,
        ).toBe(true);
        if (
          typeof error === 'object' &&
          'type' in error &&
          error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
        ) {
          expect(error.remaining).toBe(1);
        }
      }

      const currentCount = await wordQuotaRepository.getWordCount(token);
      expect(currentCount).toBe(79999);
    });

    it('should return error with correct remaining quota when exactly at limit', async () => {
      const token = 'test-token';
      const words = 80000;

      await wordQuotaService.checkAndIncrementQuota(token, words);

      const result = await wordQuotaService.checkAndIncrementQuota(token, 1);

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        const error = result.unwrapErr();
        expect(
          typeof error === 'object' &&
            'type' in error &&
            error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED,
        ).toBe(true);
        if (
          typeof error === 'object' &&
          'type' in error &&
          error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
        ) {
          expect(error.remaining).toBe(0);
        }
      }
    });

    it('should allow exactly 80000 words', async () => {
      const token = 'test-token';
      const words = 80000;

      const result = await wordQuotaService.checkAndIncrementQuota(
        token,
        words,
      );

      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(80000);
      }

      const currentCount = await wordQuotaRepository.getWordCount(token);
      expect(currentCount).toBe(80000);
    });

    it('should return error with remaining 0 when trying to exceed from 0', async () => {
      const token = 'test-token';
      const words = 80001;

      const result = await wordQuotaService.checkAndIncrementQuota(
        token,
        words,
      );

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        const error = result.unwrapErr();
        expect(
          typeof error === 'object' &&
            'type' in error &&
            error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED,
        ).toBe(true);
        if (
          typeof error === 'object' &&
          'type' in error &&
          error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
        ) {
          expect(error.remaining).toBe(80000);
        }
      }

      const currentCount = await wordQuotaRepository.getWordCount(token);
      expect(currentCount).toBe(0);
    });

    it('should handle different tokens independently', async () => {
      const token1 = 'token-1';
      const token2 = 'token-2';
      const words = 50000;

      const result1 = await wordQuotaService.checkAndIncrementQuota(
        token1,
        words,
      );
      const result2 = await wordQuotaService.checkAndIncrementQuota(
        token2,
        words,
      );

      expect(isOk(result1)).toBe(true);
      expect(isOk(result2)).toBe(true);

      const count1 = await wordQuotaRepository.getWordCount(token1);
      const count2 = await wordQuotaRepository.getWordCount(token2);
      expect(count1).toBe(50000);
      expect(count2).toBe(50000);
    });

    it('should calculate remaining quota correctly when partially used', async () => {
      const token = 'test-token';
      const initialWords = 50000;
      const additionalWords = 40000;

      await wordQuotaService.checkAndIncrementQuota(token, initialWords);

      const result = await wordQuotaService.checkAndIncrementQuota(
        token,
        additionalWords,
      );

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        const error = result.unwrapErr();
        if (
          typeof error === 'object' &&
          'type' in error &&
          error.type === JUSTIFY_TEXT_ERROR.QUOTA_EXCEEDED
        ) {
          expect(error.remaining).toBe(30000);
        }
      }
    });
  });
});
