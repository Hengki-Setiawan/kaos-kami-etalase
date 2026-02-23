'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Star, MessageCircle } from 'lucide-react';

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    content: string;
    image_url: string | null;
    status: string;
    created_at: string;
}

export function ProductReviews({ productId }: { productId: string }) {
    const { user, isSignedIn } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn || !content.trim()) return;

        setSubmitting(true);
        setUploading(file ? true : false);
        setMessage('');

        try {
            let uploadedImageUrl = null;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    uploadedImageUrl = uploadData.url;
                } else {
                    const err = await uploadRes.json();
                    setMessage(`Upload gagal: ${err.error || 'Terjadi kesalahan'}`);
                    setSubmitting(false);
                    setUploading(false);
                    return;
                }
            }
            setUploading(false);

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating,
                    content,
                    imageUrl: uploadedImageUrl
                })
            });

            if (res.ok) {
                setMessage('Ulasan berhasil dikirim dan menunggu persetujuan admin.');
                setContent('');
                setRating(5);
                setFile(null);
            } else {
                const err = await res.json();
                setMessage(`Gagal mengirim ulasan: ${err.error || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage('Terjadi kesalahan saat mengirim ulasan.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="w-6 h-6 text-[#bbff00]" />
                <h2 className="text-2xl font-black uppercase tracking-tight">Ulasan Pembeli</h2>
            </div>

            {/* Form Review */}
            <div className="mb-12 bg-white/5 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Tulis Ulasan Anda</h3>

                {isSignedIn ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm text-white/60 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-white/60 mb-2">Ulasan</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:border-[#bbff00] focus:ring-1 focus:ring-[#bbff00] outline-none transition-all"
                                rows={4}
                                placeholder="Bagaimana pendapat Anda tentang produk ini?"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-white/60 mb-2">Foto / Video (Opsional)</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#bbff00] file:text-black hover:file:bg-[#aadd00] transition-all cursor-pointer"
                            />
                            <p className="text-xs text-white/40 mt-2">Maksimal gambar 5MB, video 50MB. Akan dikompresi otomatis.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            className="bg-[#bbff00] text-black font-bold py-2 px-6 rounded-md hover:bg-[#aadd00] transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Mengupload Media...' : submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>

                        {message && (
                            <p className="mt-4 text-sm text-white/80 bg-white/10 p-3">{message}</p>
                        )}
                    </form>
                ) : (
                    <div className="text-center py-6 border border-white/10 border-dashed rounded-md">
                        <p className="text-white/60 mb-2">Silakan login untuk memberikan ulasan produk ini.</p>
                        <a href="/sign-in" className="inline-block px-4 py-2 border border-[#bbff00] text-[#bbff00] font-bold text-sm uppercase hover:bg-[#bbff00] hover:text-black transition-all">
                            Login Sekarang
                        </a>
                    </div>
                )}
            </div>

            {/* List Reviews */}
            <div>
                <h3 className="text-lg font-bold mb-6">Ulasan ({reviews.length})</h3>

                {loading ? (
                    <div className="text-white/40">Memuat ulasan...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-white/40 italic">Belum ada ulasan untuk produk ini.</div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-white/5 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">{review.user_name}</span>
                                    <span className="text-xs text-white/40">
                                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                                    ))}
                                </div>
                                <p className="text-white/80">{review.content}</p>
                                {review.image_url && (
                                    <div className="mt-3">
                                        {review.image_url.match(/\.(mp4|webm|mov)$/i) || review.image_url.includes('video/upload') ? (
                                            <video src={review.image_url} controls className="rounded-md max-w-xs max-h-48 border border-white/10" />
                                        ) : (
                                            <img src={review.image_url} alt="Review attachment" className="rounded-md max-w-xs max-h-48 object-cover border border-white/10" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
