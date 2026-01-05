'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, Loader2, Trash2, Check, Copy } from 'lucide-react';

interface Code {
    id: string;
    code: string;
    product_id: string;
    product_name?: string;
    status: 'active' | 'used' | 'expired';
    scan_count: number;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    series: string;
}

export default function AdminCodesPage() {
    const [codes, setCodes] = useState<Code[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [codesRes, productsRes] = await Promise.all([
                fetch('/api/codes'),
                fetch('/api/products')
            ]);
            const codesData = await codesRes.json();
            const productsData = await productsRes.json();
            setCodes(Array.isArray(codesData) ? codesData : []);
            setProducts(Array.isArray(productsData) ? productsData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCodes = async () => {
        if (!selectedProduct) return;
        setGenerating(true);

        try {
            const res = await fetch('/api/codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: selectedProduct,
                    quantity
                })
            });

            if (res.ok) {
                await fetchData();
            }
        } catch (error) {
            console.error('Error generating codes:', error);
        } finally {
            setGenerating(false);
        }
    };

    const deleteCode = async (id: string) => {
        if (!confirm('Hapus code ini?')) return;

        try {
            const res = await fetch(`/api/codes?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchData();
            }
        } catch (error) {
            console.error('Error deleting code:', error);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/verify/${code}`);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const downloadQR = async (code: string) => {
        try {
            const QRCode = await import('qrcode');
            const url = `${window.location.origin}/verify/${code}`;
            const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });

            const link = document.createElement('a');
            link.download = `qr-${code}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error generating QR:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">QR Codes</h1>
                <p className="text-white/40 text-sm">QRコード · QR 코드</p>
            </div>

            {/* Generator */}
            <div className="bg-[#141418] border border-white/5 p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#00d4ff]" />
                    Generate Codes
                </h2>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                        style={{ color: '#fff' }}
                    >
                        <option value="" className="bg-[#1a1a1e] text-white">Select Product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id} className="bg-[#1a1a1e] text-white">{p.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-24 px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                    />
                    <button
                        onClick={generateCodes}
                        disabled={!selectedProduct || generating}
                        className="px-6 py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                        Generate
                    </button>
                </div>
            </div>

            {/* Codes List */}
            <div className="bg-[#141418] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Code</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Product</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Scans</th>
                                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.map((code) => (
                                <tr key={code.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3 font-mono text-white">{code.code}</td>
                                    <td className="px-4 py-3 text-white/60">{code.product_name || 'Unknown'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 ${code.status === 'active'
                                            ? 'bg-[#bbff00]/10 text-[#bbff00]'
                                            : code.status === 'used'
                                                ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                                                : 'bg-[#ff3366]/10 text-[#ff3366]'
                                            }`}>
                                            {code.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-white/40">{code.scan_count}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => copyCode(code.code)}
                                                className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                                                title="Copy URL"
                                            >
                                                {copiedCode === code.code ? <Check className="w-4 h-4 text-[#bbff00]" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => downloadQR(code.code)}
                                                className="p-2 text-white/30 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
                                                title="Download QR"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCode(code.id)}
                                                className="p-2 text-white/30 hover:text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {codes.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                        Belum ada codes. Generate codes untuk produk di atas.
                    </div>
                )}
            </div>
        </div>
    );
}
