import { AuthRepository } from './types/authRepository';

export class AuthInMemoryRepository implements AuthRepository {
  connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private tokenMap: Map<string, string> = new Map();

  async saveToken(token: string, email: string): Promise<void> {
    this.tokenMap.set(token, email);
  }

  async getEmailByToken(token: string): Promise<string | null> {
    return this.tokenMap.get(token) || null;
  }

  async hasToken(token: string): Promise<boolean> {
    return this.tokenMap.has(token);
  }
}
