import { isErr } from '@gum-tech/flow-ts';
import { JustifyTextService } from '../../../src/app/features/justify-text/types/justifyTextService';
import { JustifyTextConcreteService } from '../../../src/app/features/justify-text/justifyTextConcreteService';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JUSTIFY_TEXT_ERROR } from '../../../src/app/features/justify-text/errors/justifyTextError';

describe('justifyTextService', () => {
  let justifyTextService = {} as JustifyTextService;
  const inputText = readFileSync(
    join(__dirname, '../../fixtures/justify-input.txt'),
    'utf-8',
  );

  const expectedOutput = readFileSync(
    join(__dirname, '../../fixtures/justify-output.txt'),
    'utf-8',
  );
  beforeEach(() => {
    justifyTextService = new JustifyTextConcreteService();
  });
  // this were the given input/output text on the job technical test page
  test.skip('Happy path: input should equal expected output', () => {
    const result = justifyTextService.justify(inputText);

    expect(isErr(result)).toBe(false);

    if (!isErr(result)) {
      expect(result.value).toBe(expectedOutput);
    }
  });

  test('Happy path: input should equal expected output', () => {
    const input = `Coffee was discovered in the Ethiopian highlands by a goat herder named Kaldi. He noticed that his goats became exceptionally energetic after eating berries from a certain tree. Curious, Kaldi tried the berries himself and felt a similar rush of energy. He brought the berries to a local monastery, where the monks turned them into a drink to stay awake during long evening prayers. From there, the knowledge of this energizing bean spread across the Arabian Peninsula. By the 15th century, coffee was being grown in Yemen, and by the 16th century, it was known in Persia, Egypt, Syria, and Turkey. Public coffee houses began to appear in cities across the Near East, becoming popular social hubs known as "Schools of the Wise." Travelers brought tales of this dark beverage back to Europe, and eventually, the first European coffee house opened in Venice in 1645.`;
    const output = `Coffee  was  discovered in the Ethiopian highlands by a goat herder named Kaldi.
He  noticed  that  his goats became exceptionally energetic after eating berries
from a certain tree. Curious, Kaldi tried the berries himself and felt a similar
rush  of  energy.  He  brought the berries to a local monastery, where the monks
turned  them into a drink to stay awake during long evening prayers. From there,
the  knowledge  of  this energizing bean spread across the Arabian Peninsula. By
the  15th  century, coffee was being grown in Yemen, and by the 16th century, it
was  known  in  Persia,  Egypt, Syria, and Turkey. Public coffee houses began to
appear  in  cities  across  the Near East, becoming popular social hubs known as
"Schools  of  the  Wise."  Travelers brought tales of this dark beverage back to
Europe,  and  eventually,  the  first  European coffee house opened in Venice in
1645.`;

    const result = justifyTextService.justify(input);

    expect(isErr(result)).toBe(false);

    if (!isErr(result)) {
      expect(result.value).toBe(output);
    }
  });
  test('sad path: should error when input is empty string', () => {
    const result = justifyTextService.justify('');

    expect(isErr(result)).toBe(true);
    expect(result.unwrapErr()).toBe(JUSTIFY_TEXT_ERROR.EMPTY_TEXT);
  });

  test('sad path: should error when input is not a string', () => {
    const result = justifyTextService.justify({ toto: 2 } as unknown as string);

    expect(isErr(result)).toBe(true);
    expect(result.unwrapErr()).toBe(JUSTIFY_TEXT_ERROR.INVALID_INPUT);
  });
});
