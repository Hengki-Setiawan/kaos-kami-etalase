'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, Layers, Palette } from 'lucide-react';

interface Series {
    id: string;
    name: string;
    slug: string;
    description: string;
    theme_color: string;
    accent_color: string;
    tagline: string;
    jp_name?: string;
    kr_name?: string;
}

export default function AdminSeriesPage() {
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSeries, setEditingSeries] = useState<Series | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        theme_color: '#0a0a0a',
        accent_color: '#00d4ff',
        tagline: '',
        jp_name: '',
        kr_name: ''
    });

    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        try {
            const res = await fetch('/api/series');
            const data = await res.json();
            setSeriesList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching series:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (series?: Series) => {
        setError('');
        if (series) {
            setEditingSeries(series);
            setFormData({
                name: series.name,
                slug: series.slug,
                description: series.description || '',
                theme_color: series.theme_color || '#0a0a0a',
                accent_color: series.accent_color || '#00d4ff',
                tagline: series.tagline || '',
                jp_name: series.jp_name || '',
                kr_name: series.kr_name || ''
            });
        } else {
            setEditingSeries(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                theme_color: '#0a0a0a',
                accent_color: '#00d4ff',
                tagline: '',
                jp_name: '',
                kr_name: ''
            });
        }
        setShowModal(true);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: editingSeries ? formData.slug : generateSlug(name)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const method = editingSeries ? 'PUT' : 'POST';
            const body = editingSeries
                ? { ...formData, id: editingSeries.id }
                : formData;

            const res = await fetch('/api/series', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchSeries();
                setShowModal(false);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save series');
            }
        } catch (error) {
            console.error('Error saving series:', error);
            setError('Failed to save series');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin hapus series ini?')) return;

        try {
            const res = await fetch(`/api/series?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchSeries();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete series');
            }
        } catch (error) {
            console.error('Error deleting series:', error);
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">Series</h1>
                    <p className="text-white/40 text-sm">シリーズ管理 · 시리즈 관리</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Series
                </button>
            </div>

            <div className="space-y-4">
                {seriesList.map((series) => (
                    <div key={series.id} className="bg-[#141418] border border-white/5 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: series.accent_color + '20' }}
                            >
                                <Layers className="w-6 h-6" style={{ color: series.accent_color }} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{series.name}</h3>
                                <p className="text-sm text-white/40">{series.tagline || series.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-white/5 px-2 py-0.5 text-white/30">
                                        /{series.slug}
                                    </span>
                                    <div
                                        className="w-4 h-4 rounded border border-white/20"
                                        style={{ backgroundColor: series.accent_color }}
                                        title={series.accent_color}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleOpenModal(series)}
                                className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(series.id)}
                                className="p-2 text-white/30 hover:text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {seriesList.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    Belum ada series. Klik &quot;Add Series&quot; untuk menambahkan.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141418] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h2 className="text-lg font-bold text-white">
                                {editingSeries ? 'Edit Series' : 'Add New Series'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mx-4 mt-4 p-3 bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff3366] text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Series Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. Anime Streetwear"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">URL Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-mono focus:border-[#00d4ff] focus:outline-none"
                                    required
                                />
                                <p className="text-xs text-white/30 mt-1">/series/{formData.slug || 'slug'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">日本語 Name</label>
                                    <input
                                        type="text"
                                        value={formData.jp_name}
                                        onChange={(e) => setFormData({ ...formData, jp_name: e.target.value })}
                                        placeholder="ストリート"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">한국어 Name</label>
                                    <input
                                        type="text"
                                        value={formData.kr_name}
                                        onChange={(e) => setFormData({ ...formData, kr_name: e.target.value })}
                                        placeholder="스트릿"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
                                        <Palette className="w-3 h-3" />
                                        Theme Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.theme_color}
                                            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                            className="w-12 h-10 rounded cursor-pointer border-0"
                                        />
                                        <input
                                            type="text"
                                            value={formData.theme_color}
                                            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#00d4ff] focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
                                        <Palette className="w-3 h-3" />
                                        Accent Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.accent_color}
                                            onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                                            className="w-12 h-10 rounded cursor-pointer border-0"
                                        />
                                        <input
                                            type="text"
                                            value={formData.accent_color}
                                            onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#00d4ff] focus:outline-none"
                                        />
                                    </div>
                                </div>
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
                                    className="flex-1 py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors flex items-center justify-center gap-2"
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingSeries ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
