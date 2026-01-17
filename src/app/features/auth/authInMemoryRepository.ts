import { injectable } from 'inversify';
import { AuthRepository } from './types/authRepository';

@injectable()
export class AuthInMemoryRepository implements AuthRepository {
  private tokenMap: Map<string, string> = new Map();
  private emailMap: Map<string, string> = new Map();

  async getEmailByToken(token: string): Promise<string | null> {
    return this.tokenMap.get(token) ?? null;
  }

  async getTokenByEmail(email: string): Promise<string | null> {
    return this.emailMap.get(email) ?? null;
  }

  async saveToken(token: string, email: string): Promise<void> {
    this.tokenMap.set(token, email);
    this.emailMap.set(email, token);
  }

  async hasToken(token: string): Promise<boolean> {
    return this.tokenMap.has(token);
  }

  async deleteToken(token: string): Promise<void> {
    const email = this.tokenMap.get(token);
    if (email) {
      this.tokenMap.delete(token);
      this.emailMap.delete(email);
    }
  }
}
