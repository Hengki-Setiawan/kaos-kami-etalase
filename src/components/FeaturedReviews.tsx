'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    content: string;
    image_url: string | null;
}

export function FeaturedReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/reviews?featured=true');
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Failed to fetch featured reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading || reviews.length === 0) return null;

    // Double the items to create a seamless infinite loop
    const displayReviews = [...reviews, ...reviews, ...reviews];

    return (
        <section className="py-20 bg-[#0f0f12] overflow-hidden border-t border-b border-white/5 relative">
            <div className="absolute inset-0 bg-urban opacity-50"></div>

            <div className="container mx-auto px-6 mb-12 relative z-10">
                <div className="flex items-center gap-3 justify-center mb-4">
                    <Quote className="w-8 h-8 text-[#00d4ff]" />
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center">
                        KAMI <span className="gradient-text">REVIEW</span>
                    </h2>
                </div>
                <p className="text-white/50 text-center uppercase tracking-widest text-sm font-bold">
                    Apa kata mereka tentang koleksi kami
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden flex z-10">
                {/* Left/Right Gradient Fades for Smooth Illusion */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#0f0f12] to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#0f0f12] to-transparent z-20 pointer-events-none"></div>

                <div className="animate-marquee-track flex gap-8 px-4">
                    {displayReviews.map((review, i) => (
                        <div
                            key={`${review.id}-${i}`}
                            className="w-[400px] flex-shrink-0 card-urban p-8 rounded-2xl bg-[#141418] border border-white/10"
                        >
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${review.rating >= star ? 'text-[#bbff00] fill-[#bbff00]' : 'text-white/10'}`}
                                    />
                                ))}
                            </div>

                            {review.image_url && (
                                <div className="mb-4">
                                    {review.image_url.match(/\.(mp4|webm|mov)$/i) || review.image_url.includes('video/upload') ? (
                                        <video src={review.image_url} controls className="rounded-md w-full h-40 object-cover border border-white/10 bg-black/50" />
                                    ) : (
                                        <img src={review.image_url} alt="Review attachment" className="rounded-md w-full h-40 object-cover border border-white/10" />
                                    )}
                                </div>
                            )}

                            <p className="text-white/80 text-lg mb-8 italic line-clamp-4">
                                "{review.content}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 uppercase font-bold text-[#00d4ff]">
                                    {review.user_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold uppercase tracking-wider text-sm">{review.user_name}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-widest">Verified Buyer</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
