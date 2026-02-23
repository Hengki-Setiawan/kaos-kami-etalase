import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { auth } from '@clerk/nextjs/server';

const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

export async function POST(request: Request) {
    if (!groq) {
        return NextResponse.json({ error: 'Groq API Key is not configured.' }, { status: 500 });
    }

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const systemPrompt = `
Anda adalah AI ahli pembuat deskripsi produk fashion untuk toko "Etalase Kaos Kami".
Buatlah data produk berkualitas tinggi berdasarkan prompt pendek pengguna.
Data tersebut harus dikembalikan HANYA dalam format JSON yang valid, tanpa ada teks di luar JSON.

Format JSON yang diharapkan:
{
  "name": "Nama produk kreatif dan menarik",
  "category": "T-Shirt / Hoodie / Aksesoris / dsb (pilih salah satu)",
  "description": "Deskripsi lengkap, menarik, SEO friendly, dan ada call to action (minimal 2-3 paragraf)",
  "lore": "Cerita fiksi pendek, makna filosofis, atau inspirasi di balik desain baju ini",
  "price": 150000, 
  "model": "Contoh: Oversized Fit / Regular Fit",
  "material": "Contoh: Cotton Combed 30s",
  "sizes": "S, M, L, XL, XXL",
  "stock": 50
}

Aturan:
1. Harga (price) dan stok (stock) harus berupa angka (number).
2. Deskripsi harus memikat pembeli bergaya streetwear lokal Indonesia.
3. Jangan ada komentar code (// atau /**/) atau markdown \`\`\`json. Output harus murni JSON utuh.
        `.trim();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.8,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        });

        const reply = chatCompletion.choices[0]?.message?.content;

        if (!reply) {
            return NextResponse.json({ error: 'No output generated from AI' }, { status: 500 });
        }

        const generatedProduct = JSON.parse(reply);

        return NextResponse.json(generatedProduct);
    } catch (error) {
        console.error('Groq AI Product Generator Error:', error);
        return NextResponse.json({ error: 'Failed to generate product' }, { status: 500 });
    }
}
