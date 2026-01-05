import { RedisClientType } from 'redis';

export interface CacheApi {
  getClient(): RedisClientType;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  clearAll(): Promise<void>;
}
