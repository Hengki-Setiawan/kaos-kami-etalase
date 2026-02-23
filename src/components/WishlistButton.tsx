'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export function WishlistButton({ productId }: { productId: string }) {
    const { userId } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/wishlists');
                if (res.ok) {
                    const data = await res.json();
                    setIsWishlisted(data.includes(productId));
                }
            } catch (error) {
                console.error("Failed to fetch wishlist status");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, [userId, productId]);

    const toggleWishlist = async () => {
        if (!userId) {
            alert('Silakan login terlebih dahulu untuk menyimpan produk ke Wishlist.');
            return;
        }

        setIsLoading(true);
        try {
            if (isWishlisted) {
                await fetch(`/api/wishlists?productId=${productId}`, {
                    method: 'DELETE'
                });
                setIsWishlisted(false);
            } else {
                await fetch('/api/wishlists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId })
                });
                setIsWishlisted(true);
            }
        } catch (error) {
            console.error("Failed to update wishlist");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 py-3 px-4 w-full border rounded-sm transition-colors ${isWishlisted ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/10 hover:bg-white/5 text-white/60 hover:text-white'} disabled:opacity-50`}
        >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            <span className="text-sm font-bold uppercase tracking-wider">
                {isWishlisted ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist'}
            </span>
        </button>
    );
}
