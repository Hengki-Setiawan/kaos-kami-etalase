'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus, Star, Trash2, Edit2, Loader2, RefreshCw, Check, X } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image_url: string;
    is_featured: boolean;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        role: '',
        content: '',
        rating: 5,
        is_featured: true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setTestimonials(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const initMigration = async () => {
        setLoading(true);
        try {
            await fetch('/api/migrate/create-testimonials');
            await fetchTestimonials();
            setMessage('Migration berhasil!');
        } catch (error) {
            setMessage('Migration gagal');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...form, id: editingId } : form;

            const res = await fetch('/api/testimonials', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setMessage(editingId ? 'Testimonial diupdate!' : 'Testimonial ditambahkan!');
                setShowForm(false);
                setEditingId(null);
                setForm({ name: '', role: '', content: '', rating: 5, is_featured: true });
                fetchTestimonials();
            }
        } catch (error) {
            setMessage('Error saving testimonial');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEdit = (t: Testimonial) => {
        setForm({
            name: t.name,
            role: t.role,
            content: t.content,
            rating: t.rating,
            is_featured: t.is_featured
        });
        setEditingId(t.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus testimonial ini?')) return;
        try {
            await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            fetchTestimonials();
            setMessage('Testimonial dihapus!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting');
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Testimonials</h1>
                        <p className="text-white/40 text-sm">お客様の声 · 고객 후기</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={initMigration}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Init
                        </button>
                        <button
                            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', role: '', content: '', rating: 5, is_featured: true }); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#bbff00] text-black text-sm font-bold hover:bg-[#bbff00]/80 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mb-4 p-3 text-sm ${message.includes('berhasil') || message.includes('ditambahkan') || message.includes('diupdate') || message.includes('dihapus') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mb-8 bg-white/5 border border-white/10 p-6">
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-[#bbff00]">
                            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Role (optional)</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        placeholder="Customer, Collector, etc."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/40 mb-1">Content</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                    required
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setForm({ ...form, rating: n })}
                                                className={`p-1 ${form.rating >= n ? 'text-[#bbff00]' : 'text-white/20'}`}
                                            >
                                                <Star className="w-6 h-6" fill={form.rating >= n ? '#bbff00' : 'transparent'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label className="text-sm text-white/60">Featured on Homepage</label>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#bbff00] text-black font-bold disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null); }}
                                    className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white font-bold"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#bbff00]" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                        Belum ada testimonial. Klik Init untuk membuat sample.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testimonials.map((t) => (
                            <div key={t.id} className="card-urban p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold">{t.name}</h4>
                                        <p className="text-xs text-white/40">{t.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {t.is_featured && (
                                            <span className="text-[8px] px-2 py-1 bg-[#bbff00]/20 text-[#bbff00]">Featured</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-white/60 mb-3 line-clamp-3">{t.content}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-[#bbff00]' : 'text-white/20'}`} fill={i < t.rating ? '#bbff00' : 'transparent'} />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(t)} className="text-white/40 hover:text-[#00d4ff]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="text-white/40 hover:text-[#ff3366]">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
