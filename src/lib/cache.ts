import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }
    if (!redis) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}

/**
 * Get data from Redis cache, or fetch and cache it.
 * Falls back to direct fetch if Redis is unavailable.
 */
export async function getCached<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = 300 // default 5 minutes
): Promise<T> {
    const client = getRedis();

    if (client) {
        try {
            const cached = await client.get<T>(key);
            if (cached !== null && cached !== undefined) {
                return cached;
            }
        } catch (e) {
            console.warn('Redis cache read failed:', e);
        }
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache (fire and forget)
    if (client) {
        try {
            await client.set(key, JSON.stringify(data), { ex: ttlSeconds });
        } catch (e) {
            console.warn('Redis cache write failed:', e);
        }
    }

    return data;
}

/**
 * Invalidate one or more cache keys.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
    const client = getRedis();
    if (client) {
        try {
            await client.del(...keys);
        } catch (e) {
            console.warn('Redis cache invalidation failed:', e);
        }
    }
}
