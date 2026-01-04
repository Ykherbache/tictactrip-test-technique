import { config as loadEnv } from 'dotenv';
loadEnv();
export const config = {
  port: getPort(),
};

function getPort(): number {
  const port = parseInt(process.env.PORT || '3000', 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }
  return port;
}
