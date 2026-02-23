import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getAllProducts } from '@/lib/data';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis from Upstash
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// Initialize Groq client
const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

export async function POST(request: Request) {
    if (!groq) {
        return NextResponse.json({ error: 'Groq API Key is not configured.' }, { status: 500 });
    }

    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // --- Rate Limiting Check ---
        // Basic identifier - using IP address from headers, fallback to "anonymous"
        const ip = request.headers.get("x-forwarded-for") || 'anonymous';
        const { success, remaining, limit, reset } = await ratelimit.limit(ip);

        if (!success) {
            return NextResponse.json(
                { reply: "Maaf Kak, Kamito lagi kebanjiran chat nih! Sabar tunggu sebentar yah lalu coba lagi. 🙏🏻" },
                { status: 429 }
            );
        }
        // ---------------------------

        // Fetch products to give Kamito context
        const products = await getAllProducts();

        // Build product context string safely
        const productsContext = products.map(p =>
            `- ${p.name} (${p.category}): Rp ${p.price.toLocaleString()}. ${p.description.slice(0, 100)}...`
        ).join('\n');

        const systemPrompt = `
Kamu adalah "Kamito", maskot AI yang ceria, ramah, dan sedikit gaul dari toko baju "Etalase Kaos Kami".
Gaya bahasamu: Santai, menggunakan sapaan akrab seperti "Kak", sesekali menggunakan emoji gaul atau ekspresi antusias.
Tugas utamamu: Membantu pelanggan mencari kaos, memberikan rekomendasi, dan menjawab pertanyaan seputar Etalase Kaos Kami.

Berikut adalah daftar katalog produk saat ini dari Etalase Kaos Kami:
${productsContext}

Ingat:
1. Rekomendasikan produk-produk di atas bila relevan dengan permintaan pengguna (misal cari baju oversized, atau warna tertentu).
2. Jawaban harus singkat, padat, dan jelas (jangan terlalu panjang karena muncul di widget chat kecil).
3. Jika ditanya hal-hal di luar topik pakaian, toko, atau fashion, tanggapi dengan sopan dan kembalikan ke topik Etalase Kaos Kami.
        `.trim();

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: 'llama-3.1-8b-instant', // Updated supported fast model
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "Maaf Kak, Kamito lagi bingung nih. Coba tanya lagi ya!";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Groq API Error:', error);
        return NextResponse.json({ error: 'Failed to communicate with AI' }, { status: 500 });
    }
}
