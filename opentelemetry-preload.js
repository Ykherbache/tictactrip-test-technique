if (process.env.OTEL_ENABLED !== 'false')
    { require('@opentelemetry/auto-instrumentations-node/register'); }