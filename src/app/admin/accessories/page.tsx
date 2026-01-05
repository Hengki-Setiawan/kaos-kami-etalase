'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, KeyRound } from 'lucide-react';

interface Accessory {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image_url?: string;
}

export default function AdminAccessoriesPage() {
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Accessory | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Ganci',
        price: 0,
        image_url: ''
    });

    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accessoriesRes, attributesRes] = await Promise.all([
                    fetch('/api/accessories'),
                    fetch('/api/attributes?type=category')
                ]);

                const accessoriesData = await accessoriesRes.json();
                const attributesData = await attributesRes.json();

                setAccessories(Array.isArray(accessoriesData) ? accessoriesData : []);

                if (Array.isArray(attributesData) && attributesData.length > 0) {
                    setCategories(attributesData.map((a: any) => a.value));
                } else {
                    setCategories(['Ganci', 'Pin', 'Sticker', 'Bag', 'Lanyard', 'Charm', 'Other']);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchAccessories = async () => {
        try {
            const res = await fetch('/api/accessories');
            const data = await res.json();
            setAccessories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching accessories:', error);
        }
    };

    const handleOpenModal = (item?: Accessory) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description || '',
                category: item.category || (categories.length > 0 ? categories[0] : 'Ganci'),
                price: item.price || 0,
                image_url: item.image_url || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                category: categories.length > 0 ? categories[0] : 'Ganci',
                price: 0,
                image_url: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = editingItem ? 'PUT' : 'POST';
            const body = editingItem
                ? { ...formData, id: editingItem.id }
                : formData;

            const res = await fetch('/api/accessories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchAccessories();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving accessory:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin hapus aksesoris ini?')) return;

        try {
            const res = await fetch(`/api/accessories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchAccessories();
            }
        } catch (error) {
            console.error('Error deleting accessory:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff3366]" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">Accessories</h1>
                    <p className="text-white/40 text-sm">アクセサリー · 액세서리</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ff3366] text-white font-bold uppercase tracking-wider hover:bg-[#ff3366]/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Accessory
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessories.map((item) => (
                    <div key={item.id} className="bg-[#141418] border border-white/5 overflow-hidden group">
                        <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-[#ff3366]/5 to-transparent">
                            <KeyRound className="w-12 h-12 text-[#ff3366]/20" strokeWidth={1} />
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-white">{item.name}</h3>
                                    <p className="text-sm text-white/40 line-clamp-1">{item.description}</p>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#ff3366]/10 text-[#ff3366]">
                                    {item.category}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                <span className="text-sm font-bold text-[#ff3366]">
                                    Rp {(item.price || 0).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-white/30 hover:text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {accessories.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    Belum ada aksesoris. Klik &quot;Add Accessory&quot; untuk menambahkan.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141418] border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h2 className="text-lg font-bold text-white">
                                {editingItem ? 'Edit Accessory' : 'Add New Accessory'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#ff3366] focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#ff3366] focus:outline-none"
                                    style={{ color: '#fff' }}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-[#1a1a1e] text-white">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#ff3366] focus:outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Price (Rp)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#ff3366] focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-white/10 text-white/60 font-bold uppercase tracking-wider hover:border-white/30 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#ff3366] text-white font-bold uppercase tracking-wider hover:bg-[#ff3366]/90 transition-colors flex items-center justify-center gap-2"
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingItem ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
