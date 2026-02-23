'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, LogIn, Loader2, AlertCircle } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: number;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (id: string) => {
        if (!confirm('Are you sure you want to promote this user to Admin?')) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/users/${id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'admin' })
            });
            if (!res.ok) throw new Error('Failed to promote user');

            // Refresh list
            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleImpersonate = async (id: string) => {
        if (!confirm('You are about to login as this user. Continue?')) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/users/${id}/impersonate`, {
                method: 'POST'
            });
            if (!res.ok) throw new Error('Failed to create sign-in token');
            const data = await res.json();

            // Redirect to token URL
            window.location.href = data.url;
        } catch (err: any) {
            alert(err.message);
            setActionLoading(null);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">User Management</h1>
                    <p className="text-sm text-white/40">Manage your store&apos;s users</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <Users className="w-5 h-5 text-[#00d4ff]" />
                    <span className="text-white font-bold">{users.length} Users</span>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="bg-[#141418] border border-white/5 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">User</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Role</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 flex items-center justify-center text-[#00d4ff] font-bold">
                                                {u.email?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">
                                                    {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : 'Unknown'}
                                                </div>
                                                <div className="text-xs text-white/50">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white/60 whitespace-nowrap">
                                        {new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${u.role === 'admin'
                                                ? 'bg-[#bbff00]/10 text-[#bbff00] border border-[#bbff00]/20'
                                                : 'bg-white/5 text-white/50 border border-white/10'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handlePromote(u.id)}
                                                    disabled={actionLoading === u.id}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#bbff00]/10 text-[#bbff00] hover:bg-[#bbff00]/20 border border-[#bbff00]/30 rounded transition-colors text-xs font-bold disabled:opacity-50"
                                                >
                                                    {actionLoading === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                                                    Promote
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleImpersonate(u.id)}
                                                disabled={actionLoading === u.id}
                                                title="Login as this user"
                                                className="flex items-center gap-2 px-3 py-1.5 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded transition-colors text-xs font-bold disabled:opacity-50"
                                            >
                                                <LogIn className="w-3 h-3" />
                                                Login As
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-8 text-center text-white/40 text-sm">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
