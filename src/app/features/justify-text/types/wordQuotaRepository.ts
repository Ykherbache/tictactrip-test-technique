export interface WordQuotaRepository {
  getWordCount(token: string): Promise<number>;
  incrementWordCount(token: string, wordCount: number): Promise<number>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  clearAll(): Promise<void>;
}
