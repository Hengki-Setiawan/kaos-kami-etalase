// Simple in-memory rate limiter
// For production, consider using a Redis-based solution

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimits.entries()) {
        if (entry.resetAt < now) {
            rateLimits.delete(key);
        }
    }
}, 60000); // Clean every minute

export interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Max requests per window
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { windowMs: 60000, maxRequests: 60 }
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const key = identifier;
    const entry = rateLimits.get(key);

    if (!entry || entry.resetAt < now) {
        // New window
        rateLimits.set(key, {
            count: 1,
            resetAt: now + config.windowMs
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs
        };
    }

    if (entry.count >= config.maxRequests) {
        // Rate limited
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetAt - now
        };
    }

    // Increment counter
    entry.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetAt - now
    };
}

// Helper to get client identifier
export function getClientIdentifier(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const real = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() || real || 'unknown';
}

// Rate limit response
export function rateLimitResponse(resetIn: number) {
    return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil(resetIn / 1000).toString(),
                'X-RateLimit-Reset': Math.ceil(Date.now() + resetIn).toString()
            }
        }
    );
}
