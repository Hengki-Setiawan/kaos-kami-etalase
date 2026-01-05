'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const { signIn, user, loading } = useAdmin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user && !loading) {
            router.push('/admin');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const result = await signIn(email, password);

        if (result.error) {
            setError(result.error);
            setSubmitting(false);
        } else {
            router.push('/admin');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#ff3366] flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                        Admin Login
                    </h1>
                    <p className="text-sm text-white/40 mt-2">
                        管理者ログイン · 관리자 로그인
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff3366] text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-[#00d4ff] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Back link */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-sm text-white/30 hover:text-white transition-colors"
                    >
                        ← Back to site
                    </Link>
                </div>
            </div>
        </div>
    );
}
