import { AuthRepository } from './types/authRepository';
import { Pool } from 'pg';

export class AuthPostgresRepository implements AuthRepository {
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString:
        connectionString ||
        process.env.DATABASE_URL ||
        'postgresql://localhost:5432/tictactrip',
    });

    this.initializeTable().catch(console.error);
  }

  private async initializeTable(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS auth_tokens (
          token VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      client.release();
    }
  }

  async saveToken(token: string, email: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        'INSERT INTO auth_tokens (token, email) VALUES ($1, $2) ON CONFLICT (token) DO UPDATE SET email = $2',
        [token, email],
      );
    } finally {
      client.release();
    }
  }

  async getEmailByToken(token: string): Promise<string | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT email FROM auth_tokens WHERE token = $1',
        [token],
      );
      return result.rows[0]?.email || null;
    } finally {
      client.release();
    }
  }

  async hasToken(token: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT 1 FROM auth_tokens WHERE token = $1',
        [token],
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}
