import { Result, Err, Ok } from '@gum-tech/flow-ts';
import {
  JustifyTextError,
  JUSTIFY_TEXT_ERROR,
} from './errors/justifyTextError';
import { JustifyTextService } from './types/justifyTextService';
import { injectable } from 'inversify';

@injectable()
export class JustifyTextConcreteService implements JustifyTextService {
  private readonly MAX_WIDTH = 80;

  justify(input: string): Result<string, JustifyTextError> {
    if (typeof input !== 'string') {
      return Err(JUSTIFY_TEXT_ERROR.INVALID_INPUT);
    }
    if (!input.trim()) {
      return Err(JUSTIFY_TEXT_ERROR.EMPTY_TEXT);
    }

    const paragraphs = input.split(/\n\s*\n+/).filter(Boolean);
    const result = paragraphs.map((p) => this.processParagraph(p)).join('\n');

    return Ok(result);
  }

  private processParagraph(paragraph: string): string {
    const words = paragraph.trim().split(/\s+/);
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentLen = 0;

    for (const word of words) {
      if (word.length > this.MAX_WIDTH) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = [];
          currentLen = 0;
        }
        lines.push([word]);
        continue;
      }
      if (currentLen + word.length + currentLine.length > this.MAX_WIDTH) {
        lines.push(currentLine);
        currentLine = [];
        currentLen = 0;
      }
      currentLine.push(word);
      currentLen += word.length;
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines
      .map((line, i) => this.justifyLine(line, i === lines.length - 1))
      .join('\n');
  }

  private justifyLine(words: string[], isLastLine: boolean): string {
    if (words.length === 1 || isLastLine) return words.join(' ');

    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const totalSpaces = this.MAX_WIDTH - totalChars;
    const gaps = words.length - 1;

    const baseSpace = Math.floor(totalSpaces / gaps);
    const extraSpaces = totalSpaces % gaps;

    return words.reduce((line, word, i) => {
      if (i === 0) return word;
      const spaces = baseSpace + (i <= extraSpaces ? 1 : 0);
      return line + ' '.repeat(spaces) + word;
    }, '');
  }
}
