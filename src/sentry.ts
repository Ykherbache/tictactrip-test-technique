import * as Sentry from '@sentry/node';
import { CONFIG } from './config';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

if (CONFIG.sentry.dsn) {
  Sentry.init({
    dsn: CONFIG.sentry.dsn,
    sendDefaultPii: true,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    //debug: process.env.NODE_ENV !== 'production', // Enable debug mode in development
    environment: process.env.NODE_ENV || 'development',
  });
} else {
  console.warn('Sentry DSN not configured. Sentry error tracking is disabled.');
}
