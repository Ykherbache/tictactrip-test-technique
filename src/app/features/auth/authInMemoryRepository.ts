import { injectable } from 'inversify';
import { AuthRepository } from './types/authRepository';

@injectable()
export class AuthInMemoryRepository implements AuthRepository {
  private tokenMap: Map<string, string> = new Map();
  async getEmailByToken(token: string): Promise<string | null> {
    return this.tokenMap.get(token) ?? null;
  }
  async saveToken(token: string, email: string): Promise<void> {
    this.tokenMap.set(token, email);
  }

  async hasToken(token: string): Promise<boolean> {
    return this.tokenMap.has(token);
  }
}
