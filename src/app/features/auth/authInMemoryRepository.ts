import { AuthRepository } from './types/authRepository';

export class AuthInMemoryRepository implements AuthRepository {
  private tokenMap: Map<string, string> = new Map();
  async connect(): Promise<void> {}
  async getEmailByToken(token: string): Promise<string | undefined> {
    return this.tokenMap.get(token);
  }
  async saveToken(token: string, email: string): Promise<void> {
    this.tokenMap.set(token, email);
  }

  async hasToken(token: string): Promise<boolean> {
    return this.tokenMap.has(token);
  }
}
