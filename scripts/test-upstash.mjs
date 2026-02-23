import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: 'https://lenient-rat-5734.upstash.io',
    token: 'ARZmAAImcDJjZWNkZmU3NjE4NGI0ZjIzOWRlODViMTNmNjMxZmVlMnAyNTczNA',
});

async function test() {
    try {
        await redis.set('test', 'hello');
        const val = await redis.get('test');
        console.log('✅ Token OK! Value:', val);
    } catch (e) {
        console.error('❌ Token GAGAL:', e.message || e);
    }
}

test();
