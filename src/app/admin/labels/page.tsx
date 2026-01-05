'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
    Plus, QrCode, Trash2, Edit2, Loader2, RefreshCw, Check, X, Eye,
    Download, Copy, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import QRCode from 'qrcode';

interface Label {
    id: string;
    code: string;
    name: string;
    image_url: string;
    images: string[];
    size: string;
    price: number;
    material: string;
    color: string;
    description: string;
    story: string;
    care_instructions: { icon: string; text: string }[];
    purchase_links: { platform: string; url: string }[];
    is_active: boolean;
    scan_count: number;
}

const careIconOptions = [
    { value: 'wash-cold', label: 'Cuci Air Dingin' },
    { value: 'no-bleach', label: 'Jangan Bleach' },
    { value: 'no-dryer', label: 'Jangan Pengering' },
    { value: 'iron-low', label: 'Setrika Rendah' },
    { value: 'hang-dry', label: 'Keringkan Gantung' },
    { value: 'wash-inside', label: 'Cuci Bagian Dalam' },
];

export default function AdminLabelsPage() {
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [qrModalId, setQrModalId] = useState<string | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        name: '',
        image_url: '',
        size: '',
        price: 0,
        material: '',
        color: '',
        description: '',
        story: '',
        care_instructions: [] as { icon: string; text: string }[],
        purchase_links: [] as { platform: string; url: string }[],
    });

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    useEffect(() => {
        fetchLabels();
    }, []);

    const fetchLabels = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/labels');
            const data = await res.json();
            setLabels(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const initMigration = async () => {
        setLoading(true);
        try {
            await fetch('/api/migrate/create-labels');
            await fetchLabels();
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

            const res = await fetch('/api/labels', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setMessage(editingId ? 'Label diupdate!' : 'Label dibuat!');
                resetForm();
                fetchLabels();
            }
        } catch (error) {
            setMessage('Error saving');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({
            name: '', image_url: '', size: '', price: 0, material: '', color: '',
            description: '', story: '', care_instructions: [], purchase_links: []
        });
    };

    const handleEdit = (label: Label) => {
        setForm({
            name: label.name,
            image_url: label.image_url,
            size: label.size,
            price: label.price,
            material: label.material,
            color: label.color,
            description: label.description,
            story: label.story,
            care_instructions: label.care_instructions || [],
            purchase_links: label.purchase_links || []
        });
        setEditingId(label.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus label ini?')) return;
        try {
            await fetch(`/api/labels?id=${id}`, { method: 'DELETE' });
            fetchLabels();
            setMessage('Label dihapus!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting');
        }
    };

    const generateQR = async (label: Label) => {
        const url = `${baseUrl}/label/${label.code}`;
        const qr = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' }
        });
        setQrDataUrl(qr);
        setQrModalId(label.id);
    };

    const downloadQR = (code: string) => {
        const link = document.createElement('a');
        link.download = `label-${code}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    const copyUrl = (code: string) => {
        navigator.clipboard.writeText(`${baseUrl}/label/${code}`);
        setMessage('URL disalin!');
        setTimeout(() => setMessage(''), 2000);
    };

    const addCareInstruction = () => {
        setForm({
            ...form,
            care_instructions: [...form.care_instructions, { icon: 'wash-cold', text: '' }]
        });
    };

    const updateCareInstruction = (index: number, field: 'icon' | 'text', value: string) => {
        const updated = [...form.care_instructions];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, care_instructions: updated });
    };

    const removeCareInstruction = (index: number) => {
        setForm({
            ...form,
            care_instructions: form.care_instructions.filter((_, i) => i !== index)
        });
    };

    const addPurchaseLink = () => {
        setForm({
            ...form,
            purchase_links: [...form.purchase_links, { platform: 'Shopee', url: '' }]
        });
    };

    const updatePurchaseLink = (index: number, field: 'platform' | 'url', value: string) => {
        const updated = [...form.purchase_links];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, purchase_links: updated });
    };

    const removePurchaseLink = (index: number) => {
        setForm({
            ...form,
            purchase_links: form.purchase_links.filter((_, i) => i !== index)
        });
    };

    const selectedLabel = labels.find(l => l.id === qrModalId);

    return (
        <AdminLayout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Labels</h1>
                        <p className="text-white/40 text-sm">デジタルラベル · 디지털 라벨</p>
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
                            onClick={() => { setShowForm(true); setEditingId(null); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-black text-sm font-bold hover:bg-[#00d4ff]/80 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Label
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mb-4 p-3 text-sm ${message.includes('berhasil') || message.includes('dibuat') || message.includes('diupdate') || message.includes('dihapus') || message.includes('disalin') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mb-8 bg-white/5 border border-white/10 p-6">
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-[#00d4ff]">
                            {editingId ? 'Edit Label' : 'New Label'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Nama Produk *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Harga</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Size</label>
                                    <select
                                        value={form.size}
                                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                    >
                                        <option value="">Pilih</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/40 mb-1">Color</label>
                                    <input
                                        type="text"
                                        value={form.color}
                                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/40 mb-1">Material</label>
                                    <input
                                        type="text"
                                        value={form.material}
                                        onChange={(e) => setForm({ ...form, material: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        placeholder="Cotton Combed 30s"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/40 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/40 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/40 mb-1">Story (Cerita Produk)</label>
                                <textarea
                                    value={form.story}
                                    onChange={(e) => setForm({ ...form, story: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white"
                                />
                            </div>

                            {/* Care Instructions */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-[#ff3366] font-bold">Petunjuk Perawatan</label>
                                    <button type="button" onClick={addCareInstruction} className="text-xs text-[#00d4ff] hover:underline">
                                        + Tambah
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {form.care_instructions.map((ci, i) => (
                                        <div key={i} className="flex gap-2">
                                            <select
                                                value={ci.icon}
                                                onChange={(e) => updateCareInstruction(i, 'icon', e.target.value)}
                                                className="bg-white/5 border border-white/10 px-2 py-1 text-sm text-white w-32"
                                            >
                                                {careIconOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={ci.text}
                                                onChange={(e) => updateCareInstruction(i, 'text', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-2 py-1 text-sm text-white"
                                                placeholder="Instruksi..."
                                            />
                                            <button type="button" onClick={() => removeCareInstruction(i)} className="text-red-400 hover:text-red-300">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Purchase Links */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-[#bbff00] font-bold">Link Pembelian</label>
                                    <button type="button" onClick={addPurchaseLink} className="text-xs text-[#00d4ff] hover:underline">
                                        + Tambah
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {form.purchase_links.map((pl, i) => (
                                        <div key={i} className="flex gap-2">
                                            <select
                                                value={pl.platform}
                                                onChange={(e) => updatePurchaseLink(i, 'platform', e.target.value)}
                                                className="bg-white/5 border border-white/10 px-2 py-1 text-sm text-white w-32"
                                            >
                                                <option value="Shopee">Shopee</option>
                                                <option value="TikTok Shop">TikTok Shop</option>
                                                <option value="Tokopedia">Tokopedia</option>
                                                <option value="WhatsApp">WhatsApp</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={pl.url}
                                                onChange={(e) => updatePurchaseLink(i, 'url', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-2 py-1 text-sm text-white"
                                                placeholder="https://..."
                                            />
                                            <button type="button" onClick={() => removePurchaseLink(i)} className="text-red-400 hover:text-red-300">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#00d4ff] text-black font-bold disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white font-bold"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Labels List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
                    </div>
                ) : labels.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                        Belum ada label. Klik Init untuk membuat sample.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {labels.map((label) => (
                            <div key={label.id} className="card-urban overflow-hidden">
                                <div className="flex items-center gap-4 p-4">
                                    {/* Image */}
                                    <div className="w-16 h-16 bg-white/5 flex-shrink-0 overflow-hidden">
                                        {label.image_url ? (
                                            <img src={label.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <QrCode className="w-6 h-6 text-white/20" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold truncate">{label.name}</h3>
                                            {!label.is_active && (
                                                <span className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-400">Inactive</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/40">
                                            <span className="font-mono text-[#00d4ff]">{label.code}</span>
                                            <span>{label.size}</span>
                                            <span>{label.scan_count} scans</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => generateQR(label)}
                                            className="p-2 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
                                            title="Generate QR"
                                        >
                                            <QrCode className="w-5 h-5" />
                                        </button>
                                        <a
                                            href={`/label/${label.code}`}
                                            target="_blank"
                                            className="p-2 text-[#bbff00] hover:bg-[#bbff00]/10 transition-colors"
                                            title="Preview"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </a>
                                        <button
                                            onClick={() => handleEdit(label)}
                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(label.id)}
                                            className="p-2 text-white/40 hover:text-[#ff3366] transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setExpandedId(expandedId === label.id ? null : label.id)}
                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {expandedId === label.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === label.id && (
                                    <div className="px-4 pb-4 pt-0 border-t border-white/5">
                                        <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                                            <div>
                                                <span className="text-white/40">Price:</span>
                                                <span className="ml-2 text-[#bbff00]">Rp {label.price.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40">Material:</span>
                                                <span className="ml-2">{label.material || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40">Color:</span>
                                                <span className="ml-2">{label.color || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40">Care Instructions:</span>
                                                <span className="ml-2">{label.care_instructions?.length || 0} items</span>
                                            </div>
                                        </div>
                                        {label.description && (
                                            <p className="mt-3 text-sm text-white/50">{label.description}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* QR Modal */}
                {qrModalId && selectedLabel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80" onClick={() => setQrModalId(null)} />
                        <div className="relative bg-[#141418] border border-white/10 p-6 max-w-sm w-full">
                            <button
                                onClick={() => setQrModalId(null)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="font-bold uppercase tracking-wider mb-4 text-[#00d4ff]">QR Code</h3>
                            <p className="text-sm text-white/50 mb-4">{selectedLabel.name}</p>

                            <div className="bg-white p-4 rounded mb-4">
                                <img src={qrDataUrl} alt="QR Code" className="w-full" />
                            </div>

                            <p className="text-xs text-white/30 mb-4 break-all">
                                {baseUrl}/label/{selectedLabel.code}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => downloadQR(selectedLabel.code)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00d4ff] text-black font-bold text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => copyUrl(selectedLabel.code)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white font-bold text-sm"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
