import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadToCloudinary(
    buffer: Buffer,
    options: {
        folder?: string;
        publicId?: string;
        transformation?: object[];
    } = {}
): Promise<{ url: string; publicId: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const uploadOptions: Record<string, unknown> = {
            folder: options.folder || 'kaos-kami/products',
            resource_type: 'auto',
        };

        if (options.publicId) {
            uploadOptions.public_id = options.publicId;
        }

        if (options.transformation) {
            uploadOptions.transformation = options.transformation;
        }

        cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height,
                    });
                } else {
                    reject(new Error('No result from Cloudinary'));
                }
            }
        ).end(buffer);
    });
}

export function getCloudinaryUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
} = {}): string {
    return cloudinary.url(publicId, {
        secure: true,
        transformation: [
            {
                width: options.width,
                height: options.height,
                crop: options.crop || 'fill',
                quality: options.quality || 'auto:good',
                fetch_format: 'auto',
            },
        ],
    });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}
