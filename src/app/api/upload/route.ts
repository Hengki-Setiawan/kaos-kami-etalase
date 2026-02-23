import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { rateLimit, getClientIdentifier, rateLimitResponse } from '@/lib/rateLimit';
import { checkAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        // Rate limiting: 10 uploads per minute per IP
        const clientId = getClientIdentifier(request);
        const limit = rateLimit(`upload:${clientId}`, { windowMs: 60000, maxRequests: 10 });

        if (!limit.allowed) {
            return rateLimitResponse(limit.resetIn);
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const isImage = validImageTypes.includes(file.type);
        const isVideo = validVideoTypes.includes(file.type);

        if (!isImage && !isVideo) {
            return NextResponse.json({ error: 'Invalid file type. Only PNG, JPG, WebP images and MP4, WebM, MOV videos are allowed.' }, { status: 400 });
        }

        // Validate file size (max 5MB for images, 50MB for videos)
        const maxImageSize = 5 * 1024 * 1024; // 5MB
        const maxVideoSize = 50 * 1024 * 1024; // 50MB

        if (isImage && file.size > maxImageSize) {
            return NextResponse.json({ error: 'Image file too large. Maximum size is 5MB.' }, { status: 400 });
        }
        if (isVideo && file.size > maxVideoSize) {
            return NextResponse.json({ error: 'Video file too large. Maximum size is 50MB.' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define specific transformations for automatic compression
        // f_auto and q_auto tell Cloudinary to choose the best format/quality based on the browser
        let transformation: any[] = [];
        if (isImage) {
            transformation = [
                { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
            ];
        } else if (isVideo) {
            // Lower resolution to 720p/1080p for videos to heavily compress them
            transformation = [
                { width: 1280, height: 1280, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
            ];
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, {
            folder: 'kaos-kami/products',
            transformation,
        });

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            size: file.size,
            originalType: file.type,
            message: 'File uploaded successfully'
        });

    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: `Upload failed: ${error?.message || 'Unknown error'}` }, { status: 500 });
    }
}
