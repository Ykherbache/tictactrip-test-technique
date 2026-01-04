import { config as loadEnv } from 'dotenv';
loadEnv();
export const config = {
  port: process.env.PORT || 3000,
};
