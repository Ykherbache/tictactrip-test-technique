export interface AuthRepository {
  saveToken(token: string, email: string): Promise<void>;
  getEmailByToken(token: string): Promise<string | undefined>;
  hasToken(token: string): Promise<boolean>;
}
