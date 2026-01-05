/**
 * Counts the number of words in a string.
 *
 * If `text` is falsy or not a string, returns 0.
 *
 * @param text - Input string to count words from.
 * @returns The number of words in `text`.
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}