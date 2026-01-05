'use client';

import { useState, useEffect } from 'react';

import { Save, Loader2, Home, Info, KeyRound, RefreshCw } from 'lucide-react';

type PageContent = Record<string, Record<string, Record<string, string>>>;

export default function AdminPagesPage() {
    const [content, setContent] = useState<PageContent>({});
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/page-content');
            const data = await res.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateContent = (page: string, section: string, key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [section]: {
                    ...prev[page]?.[section],
                    [key]: value
                }
            }
        }));
    };

    const saveContent = async (page: string) => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/page-content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, content: content[page] })
            });

            if (res.ok) {
                setMessage('Konten berhasil disimpan!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Gagal menyimpan konten');
            }
        } catch (error) {
            setMessage('Error saving content');
        } finally {
            setSaving(false);
        }
    };

    const initMigration = async () => {
        setLoading(true);
        try {
            await fetch('/api/migrate/create-page-content');
            await fetchContent();
            setMessage('Migration berhasil!');
        } catch (error) {
            setMessage('Migration gagal');
        }
    };

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'about', label: 'About', icon: Info },
        { id: 'accessories', label: 'Accessories', icon: KeyRound },
    ];

    const getValue = (page: string, section: string, key: string) => {
        return content[page]?.[section]?.[key] || '';
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Pages</h1>
                    <p className="text-white/40 text-sm">ページ管理 · 페이지 관리</p>
                </div>
                <button
                    onClick={initMigration}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Init/Reset Content
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 text-sm ${message.includes('berhasil') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-[#00d4ff] text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* HOME */}
                    {activeTab === 'home' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#00d4ff]">Hero Section</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={getValue('home', 'hero', 'title')}
                                            onChange={(e) => updateContent('home', 'hero', 'title', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Subtitle (Japanese/Korean)</label>
                                        <input
                                            type="text"
                                            value={getValue('home', 'hero', 'subtitle')}
                                            onChange={(e) => updateContent('home', 'hero', 'subtitle', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Description</label>
                                        <textarea
                                            value={getValue('home', 'hero', 'description')}
                                            onChange={(e) => updateContent('home', 'hero', 'description', e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">CTA Button Text</label>
                                        <input
                                            type="text"
                                            value={getValue('home', 'hero', 'cta_text')}
                                            onChange={(e) => updateContent('home', 'hero', 'cta_text', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => saveContent('home')}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/80 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Home
                            </button>
                        </div>
                    )}

                    {/* ABOUT */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#bbff00]">Hero Section</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'hero', 'title')}
                                            onChange={(e) => updateContent('about', 'hero', 'title', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Description</label>
                                        <textarea
                                            value={getValue('about', 'hero', 'description')}
                                            onChange={(e) => updateContent('about', 'hero', 'description', e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#bbff00]">Our Story</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'story', 'title')}
                                            onChange={(e) => updateContent('about', 'story', 'title', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Description</label>
                                        <textarea
                                            value={getValue('about', 'story', 'description')}
                                            onChange={(e) => updateContent('about', 'story', 'description', e.target.value)}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#ff3366]">Mascot - Kamito</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Mascot Name</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'mascot', 'name')}
                                            onChange={(e) => updateContent('about', 'mascot', 'name', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Description</label>
                                        <textarea
                                            value={getValue('about', 'mascot', 'description')}
                                            onChange={(e) => updateContent('about', 'mascot', 'description', e.target.value)}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#00d4ff]">Contact Info</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">WhatsApp</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'contact', 'whatsapp')}
                                            onChange={(e) => updateContent('about', 'contact', 'whatsapp', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                            placeholder="+62 812-xxxx-xxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'contact', 'phone')}
                                            onChange={(e) => updateContent('about', 'contact', 'phone', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                            placeholder="+62 812-xxxx-xxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Instagram</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'contact', 'instagram')}
                                            onChange={(e) => updateContent('about', 'contact', 'instagram', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">TikTok</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'contact', 'tiktok')}
                                            onChange={(e) => updateContent('about', 'contact', 'tiktok', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-white/40 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={getValue('about', 'contact', 'location')}
                                            onChange={(e) => updateContent('about', 'contact', 'location', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                            placeholder="Bandung, Jawa Barat, Indonesia"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => saveContent('about')}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-[#bbff00] text-black font-bold uppercase tracking-wider hover:bg-[#bbff00]/80 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save About
                            </button>
                        </div>
                    )}

                    {/* ACCESSORIES */}
                    {activeTab === 'accessories' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6">
                                <h3 className="font-bold uppercase tracking-wider mb-4 text-[#ff3366]">Hero Section</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={getValue('accessories', 'hero', 'title')}
                                            onChange={(e) => updateContent('accessories', 'hero', 'title', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/40 mb-1">Description</label>
                                        <textarea
                                            value={getValue('accessories', 'hero', 'description')}
                                            onChange={(e) => updateContent('accessories', 'hero', 'description', e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => saveContent('accessories')}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-[#ff3366] text-white font-bold uppercase tracking-wider hover:bg-[#ff3366]/80 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Accessories
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
