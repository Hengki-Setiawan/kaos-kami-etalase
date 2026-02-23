import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Redis } from '@upstash/redis';
import Groq from 'groq-sdk';

async function test() {
    let hasError = false;

    console.log("Testing Upstash Redis...");
    try {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL || '',
            token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
        });
        await redis.set('test_key', '123');
        const val = await redis.get('test_key');
        console.log('✅ Redis OK - test value:', val);
    } catch (e) {
        console.error('❌ Redis Error', e);
        hasError = true;
    }

    console.log("\nTesting Groq API...");
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'hello' }],
            model: 'llama-3.1-8b-instant',
        });
        console.log('✅ Groq OK - response:', chatCompletion.choices[0]?.message?.content?.substring(0, 50));
    } catch (e) {
        console.error('❌ Groq Error', e.error || e.message || e);
        hasError = true;
    }

    process.exit(hasError ? 1 : 0);
}

test();
