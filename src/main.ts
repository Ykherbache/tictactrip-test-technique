import 'reflect-metadata';
import { Server } from 'http';
import { CONFIG } from './config';
import { createProductionApp } from './app/app';

const SHUTDOWN_TIMEOUT_MS = 10000;
const EXIT_CODE = {
  SUCCESS: 0,
  FAILURE: 1,
} as const;

function shutdown(server: Server) {
  console.log('Shutting down gracefully...');

  server.close(() => {
    console.log('Server closed');
    process.exit(EXIT_CODE.SUCCESS);
  });

  setTimeout(() => {
    console.error('Forced shutdown: grace period exceeded');
    process.exit(EXIT_CODE.FAILURE);
  }, SHUTDOWN_TIMEOUT_MS);
}

export async function startServer() {
  try {
    const app = await createProductionApp();
    const server = app.listen(CONFIG.port, () => {
      console.log(`Server is running on port ${CONFIG.port}`);
    });

    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(EXIT_CODE.FAILURE);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(EXIT_CODE.FAILURE);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(EXIT_CODE.FAILURE);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(EXIT_CODE.FAILURE);
});

(async () => {
  await startServer();
})();
