import 'reflect-metadata';
import { Server } from 'http';
import { CONFIG } from './config';
import { createProductionApp } from './app/app';
import { logger } from './app/utils/logger';

const SHUTDOWN_TIMEOUT_MS = 10000;
const EXIT_CODE = {
  SUCCESS: 0,
  FAILURE: 1,
} as const;

function shutdown(server: Server) {
  logger.debug('Shutting down gracefully...');

  server.close(() => {
    logger.debug('Server closed');
    process.exit(EXIT_CODE.SUCCESS);
  });

  setTimeout(() => {
    logger.error('Forced shutdown: grace period exceeded');
    process.exit(EXIT_CODE.FAILURE);
  }, SHUTDOWN_TIMEOUT_MS);
}

export async function startServer() {
  try {
    const app = await createProductionApp();
    const server = app.listen(CONFIG.port, () => {
      logger.debug(`Server is running on port ${CONFIG.port}`);
    });

    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));

    server.on('error', (err) => {
      logger.error('Server error:', err);
      process.exit(EXIT_CODE.FAILURE);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(EXIT_CODE.FAILURE);
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  process.exit(EXIT_CODE.FAILURE);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(EXIT_CODE.FAILURE);
});

(async () => {
  await startServer();
})();
