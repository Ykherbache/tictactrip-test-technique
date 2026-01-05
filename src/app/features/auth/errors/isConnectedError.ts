import { ObjectValues } from '../../../types/ObjectValues';

export const IS_CONNECTED_ERROR = {
  AUTHORIZATION_HEADER_MALFORMED: 'AUTHORIZATION_HEADER_MALFORMED',
  ERROR_DECODING_TOKEN: 'ERROR_DECODING_TOKEN',
} as const;
export type isConnectedError = ObjectValues<typeof IS_CONNECTED_ERROR>;
