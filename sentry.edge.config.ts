import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://4cc732fa015ca2a0805344e771a1118c@o4510928650633216.ingest.us.sentry.io/4510928666361856",
    tracesSampleRate: 1,
    debug: false,
});
