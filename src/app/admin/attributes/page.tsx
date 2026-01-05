'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Tag, Shirt, Scissors, Ruler } from 'lucide-react';

interface Attribute {
    id: string;
    type: string;
    value: string;
    label: string;
}

const ATTRIBUTE_TYPES = [
    { id: 'category', label: 'Categories', icon: Tag },
    { id: 'model', label: 'Models (Jenis Kaos)', icon: Shirt },
    { id: 'material', label: 'Materials (Jenis Katun)', icon: Scissors },
    { id: 'size', label: 'Sizes', icon: Ruler },
];

export default function AdminAttributesPage() {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('category');
    const [newItem, setNewItem] = useState({ label: '', value: '' });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        try {
            const res = await fetch('/api/attributes');
            const data = await res.json();
            setAttributes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching attributes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.label) return;

        setAdding(true);
        // Auto-generate value from label if not provided (slugify)
        const value = newItem.value || newItem.label.toLowerCase().replace(/\s+/g, '-');

        try {
            const res = await fetch('/api/attributes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    label: newItem.label,
                    value: value
                })
            });

            if (res.ok) {
                setNewItem({ label: '', value: '' });
                await fetchAttributes();
            }
        } catch (error) {
            console.error('Error adding attribute:', error);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus item ini?')) return;

        try {
            const res = await fetch(`/api/attributes?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchAttributes();
            }
        } catch (error) {
            console.error('Error deleting attribute:', error);
        }
    };

    const filteredAttributes = attributes.filter(a => a.type === activeTab);

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
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">Attributes</h1>
                <p className="text-white/40 text-sm">属性管理 · 속성 관리</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-1">
                {ATTRIBUTE_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = activeTab === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2
                                ${isActive
                                    ? 'border-[#00d4ff] text-[#00d4ff]'
                                    : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {type.label}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#141418] border border-white/5 p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-white mb-4">Add New {ATTRIBUTE_TYPES.find(t => t.id === activeTab)?.label}</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Label</label>
                                <input
                                    type="text"
                                    value={newItem.label}
                                    onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none"
                                    placeholder="e.g. Cotton Combed 30s"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Value (Optional)</label>
                                <input
                                    type="text"
                                    value={newItem.value}
                                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none"
                                    placeholder="Auto-generated if empty"
                                />
                                <p className="text-[10px] text-white/20 mt-1">Used for system logic (slug)</p>
                            </div>
                            <button
                                type="submit"
                                disabled={adding || !newItem.label}
                                className="w-full py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add Item
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-[#141418] border border-white/5 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Label</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Value</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/40">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttributes.map((attr) => (
                                    <tr key={attr.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-bold">{attr.label}</td>
                                        <td className="px-6 py-4 text-white/40 font-mono text-sm">{attr.value}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(attr.id)}
                                                className="text-white/20 hover:text-[#ff3366] transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAttributes.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-white/20">
                                            No items found. Add one on the left.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
