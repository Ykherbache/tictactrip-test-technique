import { isErr } from '@gum-tech/flow-ts';
import { JustifyTextService } from '../../../src/app/features/ justify-text/types/justifyTextService';
import { JustifyTextConcreteService } from '../../../src/app/features/ justify-text/justifyTextConcreteService';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('jusitifyTextService', () => {
  let justifyTextService = {} as JustifyTextService;
  const inputText = readFileSync(join(__dirname, '../../fixtures/justify-input.txt'), 'utf-8');

  const expectedOutput = readFileSync(join(__dirname, '../../fixtures/justify-output.txt'), 'utf-8');
  beforeEach(() => {
    justifyTextService = new JustifyTextConcreteService();
  });

  test.skip('input should equal expected output', () => {
    const result = justifyTextService.justify(inputText);

    expect(isErr(result)).toBe(false);

    if (!isErr(result)) {
      expect(result.value).toBe(expectedOutput);
    }
  });
});
