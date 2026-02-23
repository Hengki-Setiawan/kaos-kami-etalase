import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://4cc732fa015ca2a0805344e771a1118c@o4510928650633216.ingest.us.sentry.io/4510928666361856",

    // Performance Monitoring — 10% of transactions (free tier friendly)
    tracesSampleRate: 0.1,

    debug: false,

    // Session Replay — capture 100% of error sessions, 10% of normal sessions
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
});
