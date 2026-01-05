'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, AlertCircle, Layers, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    series: string;
    category: string;
    description: string;
    lore?: string;
    price?: number;
    image_url?: string;
    images?: string[];
    model?: string;
    material?: string;
    sizes?: string;
    stock?: number;
    purchase_links?: { platform: string; url: string }[];
}

interface Series {
    id: string;
    name: string;
    slug: string;
    theme_color: string;
    accent_color: string;
}

interface PurchaseLink {
    platform: string;
    url: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Attributes from API
    const [categories, setCategories] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const additionalFileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        name: string;
        series: string;
        category: string;
        description: string;
        lore: string;
        price: string | number;
        image_url: string;
        images: string[];
        model: string;
        material: string;
        sizes: string[];
        stock: string | number;
        shopee_link: string;
        tiktok_link: string;
    }>({
        name: '',
        series: '',
        category: 'T-Shirt',
        description: '',
        lore: '',
        price: '',
        image_url: '',
        images: [],
        model: '',
        material: '',
        sizes: [],
        stock: '',
        shopee_link: '',
        tiktok_link: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, seriesRes, catRes, modelRes, matRes, sizeRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/series'),
                    fetch('/api/attributes?type=category'),
                    fetch('/api/attributes?type=model'),
                    fetch('/api/attributes?type=material'),
                    fetch('/api/attributes?type=size')
                ]);

                const productsData = await productsRes.json();
                const seriesData = await seriesRes.json();
                const catData = await catRes.json();
                const modelData = await modelRes.json();
                const matData = await matRes.json();
                const sizeData = await sizeRes.json();

                setProducts(Array.isArray(productsData) ? productsData : []);
                setSeriesList(Array.isArray(seriesData) ? seriesData : []);

                setCategories(Array.isArray(catData) && catData.length > 0
                    ? catData.map((a: any) => a.value)
                    : ['T-Shirt', 'Hoodie', 'Accessories', 'Other']);

                setModels(Array.isArray(modelData) && modelData.length > 0
                    ? modelData.map((a: any) => a.value)
                    : ['Regular Fit', 'Oversize', 'Slim Fit']);

                setMaterials(Array.isArray(matData) && matData.length > 0
                    ? matData.map((a: any) => a.value)
                    : ['Cotton Combed 30s', 'Cotton Combed 24s', 'Fleece']);

                setAvailableSizes(Array.isArray(sizeData) && sizeData.length > 0
                    ? sizeData.map((a: any) => a.value)
                    : ['S', 'M', 'L', 'XL', 'XXL']);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Gagal memuat data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.series === filter);

    const handleOpenModal = (product?: Product) => {
        setError('');
        setSuccess('');

        if (product) {
            setEditingProduct(product);
            const sizesArray = product.sizes ? product.sizes.split(',').filter(s => s) : [];

            // Extract Shopee and TikTok links from purchase_links
            let shopeeLink = '';
            let tiktokLink = '';
            if (Array.isArray(product.purchase_links)) {
                const shopee = product.purchase_links.find(l => l.platform === 'Shopee');
                const tiktok = product.purchase_links.find(l => l.platform === 'TikTok Shop');
                shopeeLink = shopee?.url || '';
                tiktokLink = tiktok?.url || '';
            }

            setFormData({
                name: product.name,
                series: product.series,
                category: product.category || 'T-Shirt',
                description: product.description || '',
                lore: product.lore || '',
                price: product.price || '',
                image_url: product.image_url || '',
                images: product.images || [],
                model: product.model || '',
                material: product.material || '',
                sizes: sizesArray,
                stock: product.stock || '',
                shopee_link: shopeeLink,
                tiktok_link: tiktokLink
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                series: seriesList.length > 0 ? seriesList[0].slug : '',
                category: categories.length > 0 ? categories[0] : 'T-Shirt',
                description: '',
                lore: '',
                price: '',
                image_url: '',
                images: [],
                model: models.length > 0 ? models[0] : '',
                material: materials.length > 0 ? materials[0] : '',
                sizes: [],
                stock: '',
                shopee_link: '',
                tiktok_link: ''
            });
        }
        setShowModal(true);
    };

    const handleFileUpload = async (file: File, isMain: boolean = true) => {
        setUploading(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            });

            const result = await res.json();

            if (res.ok && result.url) {
                if (isMain) {
                    setFormData({ ...formData, image_url: result.url });
                } else {
                    setFormData({ ...formData, images: [...formData.images, result.url] });
                }
                setSuccess('Gambar berhasil diupload!');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(result.error || 'Gagal upload gambar');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Gagal upload gambar');
        } finally {
            setUploading(false);
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, true);
        }
    };

    const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleSizeToggle = (size: string) => {
        if (formData.sizes.includes(size)) {
            setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
        } else {
            setFormData({ ...formData, sizes: [...formData.sizes, size] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const method = editingProduct ? 'PUT' : 'POST';

            // Build purchase_links array from individual fields
            const purchaseLinks: PurchaseLink[] = [];
            if (formData.shopee_link) {
                purchaseLinks.push({ platform: 'Shopee', url: formData.shopee_link });
            }
            if (formData.tiktok_link) {
                purchaseLinks.push({ platform: 'TikTok Shop', url: formData.tiktok_link });
            }

            const payload = {
                name: formData.name,
                series: formData.series,
                category: formData.category,
                description: formData.description,
                lore: formData.lore,
                price: Number(formData.price) || 0,
                image_url: formData.image_url,
                images: formData.images,
                model: formData.model,
                material: formData.material,
                sizes: formData.sizes,
                stock: Number(formData.stock) || 0,
                purchase_links: purchaseLinks
            };

            const body = editingProduct
                ? { ...payload, id: editingProduct.id }
                : payload;

            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await res.json();

            if (res.ok) {
                setSuccess(editingProduct ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
                await fetchProducts();
                setTimeout(() => {
                    setShowModal(false);
                    setSuccess('');
                }, 1000);
            } else {
                setError(result.error || 'Gagal menyimpan produk');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Terjadi kesalahan. Cek console untuk detail.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Yakin ingin hapus "${name}"?`)) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            const result = await res.json();

            if (res.ok) {
                setSuccess('Produk berhasil dihapus!');
                await fetchProducts();
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError(result.error || 'Gagal menghapus produk');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Gagal menghapus produk');
        }
    };

    const getSeriesDetails = (slug: string) => {
        const series = seriesList.find(s => s.slug === slug);
        return {
            name: series ? series.name : slug,
            color: series ? series.accent_color : '#00d4ff',
            icon: Layers
        };
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">Products</h1>
                    <p className="text-white/40 text-sm">製品管理 · 제품 관리</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 text-green-400">
                    {success}
                </div>
            )}

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${filter === 'all'
                        ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                        }`}
                >
                    All
                </button>
                {seriesList.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setFilter(s.slug)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${filter === s.slug
                            ? 'bg-opacity-10'
                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                            }`}
                        style={filter === s.slug ? {
                            borderColor: s.accent_color,
                            backgroundColor: `${s.accent_color}20`,
                            color: s.accent_color
                        } : {}}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                    const { name: seriesName, color, icon: IconComponent } = getSeriesDetails(product.series);

                    return (
                        <div key={product.id} className="bg-[#141418] border border-white/5 overflow-hidden group">
                            <div
                                className="aspect-video flex items-center justify-center relative"
                                style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 50%)` }}
                            >
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <IconComponent className="w-12 h-12 opacity-20" style={{ color }} strokeWidth={1} />
                                )}
                                {product.stock !== undefined && product.stock > 0 && (
                                    <div className="absolute top-2 left-2 bg-green-500/80 px-2 py-1 rounded text-[10px] text-white font-bold">
                                        Stock: {product.stock}
                                    </div>
                                )}
                                {product.images && product.images.length > 0 && (
                                    <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white">
                                        +{product.images.length} images
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-white">{product.name}</h3>
                                        <p className="text-sm text-white/40 line-clamp-1">{product.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1"
                                            style={{ backgroundColor: `${color}20`, color }}
                                        >
                                            {seriesName}
                                        </span>
                                        {product.category && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/10 text-white/60">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Display sizes */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {product.sizes && product.sizes.split(',').map(size => (
                                        <span key={size} className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/50 rounded">{size}</span>
                                    ))}
                                </div>

                                {/* Purchase Links */}
                                {product.purchase_links && product.purchase_links.length > 0 && (
                                    <div className="flex gap-2 mb-2">
                                        {product.purchase_links.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1 ${link.platform === 'Shopee'
                                                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                                        : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30'
                                                    }`}
                                            >
                                                {link.platform}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                    <span className="text-sm font-bold" style={{ color }}>
                                        Rp {(product.price || 0).toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="p-2 text-white/30 hover:text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    {filter === 'all'
                        ? 'Belum ada produk. Klik "Add Product" untuk menambahkan.'
                        : `Tidak ada produk untuk filter ini.`}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141418] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-[#141418] z-10">
                            <h2 className="text-lg font-bold text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/40 hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mx-4 mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none"
                                    placeholder="Nama produk"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Series</label>
                                    <select
                                        value={formData.series}
                                        onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        style={{ color: '#fff' }}
                                    >
                                        {seriesList.length === 0 && <option value="">No Series</option>}
                                        {seriesList.map((s) => (
                                            <option key={s.id} value={s.slug} className="bg-[#1a1a1e] text-white">{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        style={{ color: '#fff' }}
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c} className="bg-[#1a1a1e] text-white">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Model</label>
                                    <select
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        style={{ color: '#fff' }}
                                    >
                                        <option value="" className="bg-[#1a1a1e] text-white">-- Pilih Model --</option>
                                        {models.map((m) => (
                                            <option key={m} value={m} className="bg-[#1a1a1e] text-white">{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Material</label>
                                    <select
                                        value={formData.material}
                                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        style={{ color: '#fff' }}
                                    >
                                        <option value="" className="bg-[#1a1a1e] text-white">-- Pilih Material --</option>
                                        {materials.map((m) => (
                                            <option key={m} value={m} className="bg-[#1a1a1e] text-white">{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Sizes Multi-select */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            type="button"
                                            key={size}
                                            onClick={() => handleSizeToggle(size)}
                                            className={`px-3 py-2 text-sm font-bold border transition-colors ${formData.sizes.includes(size)
                                                    ? 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff]'
                                                    : 'border-white/10 text-white/40 hover:border-white/30'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none resize-none"
                                    placeholder="Deskripsi produk"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Price (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        placeholder="150000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white focus:border-[#00d4ff] focus:outline-none"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            {/* Main Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Main Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleMainImageChange}
                                    className="hidden"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white hover:border-[#00d4ff] transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Upload Gambar
                                    </button>
                                    {formData.image_url && (
                                        <div className="flex items-center gap-2 px-3 bg-white/5 rounded">
                                            <img src={formData.image_url} alt="" className="w-8 h-8 object-cover rounded" />
                                            <span className="text-xs text-white/60 truncate max-w-[150px]">{formData.image_url.split('/').pop()}</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="text-white/40 hover:text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Additional Images</label>
                                <input
                                    ref={additionalFileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleAdditionalImageChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => additionalFileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white hover:border-[#00d4ff] transition-colors disabled:opacity-50 mb-2"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Tambah Gambar
                                </button>
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={img} alt="" className="w-full aspect-square object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Purchase Links - Shopee & TikTok Shop */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40">Purchase Links</label>

                                <div>
                                    <label className="block text-xs text-orange-400 mb-1">🛒 Shopee</label>
                                    <input
                                        type="text"
                                        value={formData.shopee_link}
                                        onChange={(e) => setFormData({ ...formData, shopee_link: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-orange-500/30 text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
                                        placeholder="https://shopee.co.id/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-pink-400 mb-1">🎵 TikTok Shop</label>
                                    <input
                                        type="text"
                                        value={formData.tiktok_link}
                                        onChange={(e) => setFormData({ ...formData, tiktok_link: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#1a1a1e] border border-pink-500/30 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none"
                                        placeholder="https://www.tiktok.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-white/10 text-white/60 font-bold uppercase tracking-wider hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    disabled={saving || uploading}
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingProduct ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
