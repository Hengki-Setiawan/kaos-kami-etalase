import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Create unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `product_${timestamp}_${randomStr}.${ext}`;
        const filepath = `products/${filename}`;

        // Convert file to ArrayBuffer then to Uint8Array for Supabase
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filepath, uint8Array, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filepath);

        return NextResponse.json({
            url: urlData.publicUrl,
            filename: filename,
            path: filepath,
            message: 'File uploaded successfully to Supabase Storage'
        });

    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: `Upload failed: ${error?.message || 'Unknown error'}` }, { status: 500 });
    }
}
