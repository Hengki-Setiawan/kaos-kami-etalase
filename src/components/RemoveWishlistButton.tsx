'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RemoveWishlistButton({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating since it sits over a Link overlay
        setIsLoading(true);
        try {
            const res = await fetch(`/api/wishlists?productId=${productId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isLoading}
            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
            title="Hapus dari Wishlist"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
