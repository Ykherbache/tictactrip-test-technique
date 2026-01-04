/**
 * Checks if a value is a valid value from a given POJO (Object)
 */
export const isKnownError = <T extends Record<string, string>>(
  error: unknown,
  errorObject: T,
): error is T[keyof T] => {
  return (
    typeof error === 'string' && Object.values(errorObject).includes(error)
  );
};
