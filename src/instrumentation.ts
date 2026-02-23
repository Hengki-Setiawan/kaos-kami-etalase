import * as Sentry from '@sentry/nextjs';

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        require('../sentry.server.config');
    } else if (process.env.NEXT_RUNTIME === 'edge') {
        require('../sentry.edge.config');
    }
}

export const onRequestError = Sentry.captureRequestError;
