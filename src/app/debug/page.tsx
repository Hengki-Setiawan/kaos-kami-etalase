'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
    const [status, setStatus] = useState('Idle');
    const [envInfo, setEnvInfo] = useState<any>({});
    const [error, setError] = useState('');

    useEffect(() => {
        // Check env vars (safely)
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        setEnvInfo({
            urlLength: url?.length || 0,
            urlStart: url ? url.substring(0, 8) + '...' : 'undefined',
            keyLength: key?.length || 0,
            keyStart: key ? key.substring(0, 5) + '...' : 'undefined',
        });
    }, []);

    const testConnection = async () => {
        setStatus('Testing...');
        setError('');
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            setStatus('Success! Connection working.');
            console.log('Connection success:', data);
        } catch (err: any) {
            console.error('Connection error:', err);
            setStatus('Failed');
            setError(err.message || JSON.stringify(err));
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <h1 className="text-2xl font-bold mb-6 text-[#00d4ff]">Debug Connection</h1>

            <div className="space-y-4 mb-8 border border-white/10 p-4 rounded">
                <h2 className="font-bold text-[#bbff00]">Environment Variables</h2>
                <div>
                    <p>URL: {envInfo.urlStart} (Length: {envInfo.urlLength})</p>
                    <p>Key: {envInfo.keyStart} (Length: {envInfo.keyLength})</p>
                </div>
                <p className="text-xs text-white/50">
                    *If URL is "undefined", you need to set env vars in Vercel and REDEPLOY.
                </p>
            </div>

            <button
                onClick={testConnection}
                className="px-6 py-2 bg-[#00d4ff] text-black font-bold rounded hover:bg-[#00d4ff]/80 mb-6"
            >
                Test Supabase Connection
            </button>

            {status && (
                <div className={`p-4 rounded border ${status.includes('Success') ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5'}`}>
                    <p className="font-bold mb-2">Status: {status}</p>
                    {error && (
                        <div className="text-red-400 break-all">
                            Error: {error}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/10">
                <h2 className="font-bold text-[#ff3366] mb-4">Test Login (Auth Check)</h2>
                <div className="space-y-4 max-w-sm">
                    <input
                        type="email"
                        placeholder="Email"
                        id="debug-email"
                        className="w-full bg-white/10 p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="debug-password"
                        className="w-full bg-white/10 p-2 rounded"
                    />
                    <button
                        onClick={async () => {
                            const email = (document.getElementById('debug-email') as HTMLInputElement).value;
                            const password = (document.getElementById('debug-password') as HTMLInputElement).value;
                            setStatus('Testing Login...');
                            try {
                                const { data, error } = await supabase.auth.signInWithPassword({
                                    email,
                                    password
                                });
                                if (error) throw error;
                                setStatus('Login Success! User: ' + data.user.email);
                            } catch (err: any) {
                                console.error(err);
                                setStatus('Login Failed');
                                setError(JSON.stringify(err, null, 2));
                            }
                        }}
                        className="px-6 py-2 bg-[#ff3366] text-white font-bold rounded hover:bg-[#ff3366]/80"
                    >
                        Test Login
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
                <h2 className="font-bold text-[#bbff00] mb-4">Network Connectivity Test</h2>
                <button
                    onClick={async () => {
                        setStatus('Testing Network...');
                        try {
                            const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/health';
                            const res = await fetch(url);
                            const text = await res.text();
                            setStatus(`Network Test: ${res.status} ${res.statusText}`);
                            setError(`Response: ${text}`);
                        } catch (err: any) {
                            setStatus('Network Test Failed (Status 0)');
                            setError('Possible CORS or AdBlocker issue. ' + err.message);
                        }
                    }}
                    className="px-6 py-2 bg-[#bbff00] text-black font-bold rounded hover:bg-[#bbff00]/80"
                >
                    Test Health Endpoint
                </button>
            </div>
        </div>
    );
}
