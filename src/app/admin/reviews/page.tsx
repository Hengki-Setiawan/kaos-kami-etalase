'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    content: string;
    image_url: string | null;
    status: string;
    is_featured: number;
    created_at: string;
}

export default function AdminReviewsPage() {
    const { user, isLoaded } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch admin reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchReviews();
        }
    }, [isLoaded, user]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchReviews();
            } else {
                alert('Gagal memperbarui status');
            }
        } catch (error) {
            console.error('Error updating review status:', error);
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: number) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: currentFeatured === 1 ? 0 : 1 })
            });

            if (res.ok) {
                fetchReviews();
            } else {
                alert('Gagal memperbarui status featured');
            }
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    if (!isLoaded || loading) {
        return <div className="p-8 text-white/50">Memuat ulasan...</div>;
    }

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Review Management</h1>
                    <p className="text-white/40">Kelola ulasan dari pengguna</p>
                </div>
                <Link href="/admin" className="text-sm border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors">
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="bg-[#141418] rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a20] uppercase text-xs tracking-wider text-white/50 font-bold border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Produk ID</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Komentar</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-white/40">
                                        Belum ada ulasan yang masuk.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold">{review.user_name}</div>
                                            <div className="text-xs text-white/40">{new Date(review.created_at).toLocaleDateString('id-ID')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded max-w-[120px] truncate inline-block">
                                                {review.product_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className={`w-3 h-3 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm max-w-xs break-words line-clamp-2" title={review.content}>
                                                {review.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.status === 'approved' ? 'bg-[#bbff00]/20 text-[#bbff00]' :
                                                review.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                                            {review.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                                                        className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {review.status === 'approved' && (
                                                <button
                                                    onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                                                    className={`p-1.5 rounded transition-colors ${review.is_featured === 1 ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                    title={review.is_featured === 1 ? "Hapus dari Featured" : "Jadikan Featured"}
                                                >
                                                    <Star className={`w-4 h-4 ${review.is_featured === 1 ? 'fill-yellow-400' : ''}`} />
                                                </button>
                                            )}
                                            {review.status !== 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(review.id, 'pending')}
                                                    className="p-1.5 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white rounded transition-colors"
                                                    title="Reset to Pending"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
