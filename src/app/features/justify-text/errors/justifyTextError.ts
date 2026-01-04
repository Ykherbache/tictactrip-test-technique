import { ObjectValues } from '../../../types/ObjectValues';

export const JUSTIFY_TEXT_ERROR = {
  EMPTY_TEXT: 'EMPTY_TEXT',
  INVALID_INPUT: 'INVALID_INPUT',
} as const;
export type JustifyTextError = ObjectValues<typeof JUSTIFY_TEXT_ERROR>;
