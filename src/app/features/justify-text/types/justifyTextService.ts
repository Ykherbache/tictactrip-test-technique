import { Result } from '@gum-tech/flow-ts';
import { JustifyTextError } from '../errors/justifyTextError';

export interface JustifyTextService {
  justify: (input: string) => Result<string, JustifyTextError>;
}
