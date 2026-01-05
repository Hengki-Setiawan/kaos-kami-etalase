'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Package, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
    id: string;
    name: string;
    category?: string;
    series?: string;
    description: string;
    price: number;
    image_url?: string;
    type: 'product' | 'accessory';
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: SearchResult[]; accessories: SearchResult[] }>({ products: [], accessories: [] });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults({ products: [], accessories: [] });
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults({ products: [], accessories: [] });
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    if (!isOpen) return null;

    const totalResults = results.products.length + results.accessories.length;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[#141418] border border-white/10 shadow-2xl animate-slide-up">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <Search className="w-5 h-5 text-white/40" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari produk..."
                        className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-white/30"
                    />
                    {loading && <Loader2 className="w-5 h-5 animate-spin text-[#00d4ff]" />}
                    <button onClick={onClose} className="text-white/40 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.length < 2 ? (
                        <div className="p-8 text-center text-white/40">
                            Ketik minimal 2 karakter untuk mencari
                        </div>
                    ) : totalResults === 0 && !loading ? (
                        <div className="p-8 text-center text-white/40">
                            Tidak ada hasil untuk "{query}"
                        </div>
                    ) : (
                        <>
                            {/* Products */}
                            {results.products.length > 0 && (
                                <div className="p-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#00d4ff] mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Products ({results.products.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {results.products.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/products/${item.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="w-12 h-12 bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm group-hover:text-[#00d4ff] transition-colors truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-white/40 truncate">{item.series}</p>
                                                </div>
                                                <span className="text-sm font-bold text-[#00d4ff]">
                                                    Rp {item.price.toLocaleString()}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Accessories */}
                            {results.accessories.length > 0 && (
                                <div className="p-4 border-t border-white/5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff3366] mb-3 flex items-center gap-2">
                                        <KeyRound className="w-4 h-4" />
                                        Accessories ({results.accessories.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {results.accessories.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/products/${item.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="w-12 h-12 bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <KeyRound className="w-5 h-5 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm group-hover:text-[#ff3366] transition-colors truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-white/40 truncate">{item.category}</p>
                                                </div>
                                                <span className="text-sm font-bold text-[#ff3366]">
                                                    Rp {item.price.toLocaleString()}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 text-center">
                    <span className="text-xs text-white/30">
                        Press ESC to close
                    </span>
                </div>
            </div>
        </div>
    );
}
