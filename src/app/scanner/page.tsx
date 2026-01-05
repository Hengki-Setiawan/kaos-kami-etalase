'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Camera, AlertCircle, CheckCircle, QrCode, Scan } from 'lucide-react';
import Link from 'next/link';

export default function ScannerPage() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    const startQRScanner = async () => {
        setError(null);
        setResult(null);

        try {
            const html5QrCode = new Html5Qrcode('qr-reader');
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    stopQRScanner();
                    setResult(decodedText);
                    if (decodedText.includes('/label')) {
                        setTimeout(() => {
                            window.location.href = decodedText;
                        }, 1500);
                    }
                },
                () => { }
            );
            setScanning(true);
        } catch (err) {
            console.error('Error starting scanner:', err);
            setError('Tidak bisa mengakses kamera. Pastikan kamu sudah memberikan izin.');
        }
    };

    const stopQRScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
        setScanning(false);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-[#00d4ff]/50">
                            <QrCode className="w-10 h-10 text-[#00d4ff]" />
                        </div>
                        <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                            スキャン · 스캔
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                            SCAN <span className="text-[#00d4ff]">QR</span>
                        </h1>
                        <p className="text-white/50 max-w-md mx-auto">
                            Arahkan kamera ke QR code pada label kaos untuk melihat label digital.
                        </p>
                    </div>

                    {/* Scanner */}
                    <div className="border border-white/10 overflow-hidden mb-8">
                        <div
                            id="qr-reader"
                            className="aspect-square bg-[#141414]"
                            style={{ display: scanning ? 'block' : 'none' }}
                        />

                        {!scanning && !result && (
                            <div className="aspect-square bg-[#141414] flex flex-col items-center justify-center">
                                <Camera className="w-16 h-16 text-white/10 mb-4" strokeWidth={1} />
                                <p className="text-sm text-white/30 uppercase tracking-wider">
                                    Ready to Scan
                                </p>
                            </div>
                        )}

                        {result && (
                            <div className="aspect-square bg-[#141414] flex flex-col items-center justify-center p-8">
                                <CheckCircle className="w-16 h-16 text-[#bbff00] mb-4" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">DETECTED!</h3>
                                <p className="text-sm text-white/50 text-center mb-4 break-all max-w-sm">
                                    {result.length > 80 ? result.substring(0, 80) + '...' : result}
                                </p>
                                {result.includes('/label') && (
                                    <p className="text-[#bbff00] text-sm font-bold uppercase tracking-wider">
                                        Redirecting...
                                    </p>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-[#ff3366]/10 border-t border-[#ff3366]/30">
                                <div className="flex items-center gap-3 text-[#ff3366]">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-4">
                        {!scanning && !result && (
                            <button onClick={startQRScanner} className="btn-urban w-full">
                                <Camera className="w-5 h-5" />
                                START SCAN
                            </button>
                        )}

                        {scanning && (
                            <button onClick={stopQRScanner} className="btn-outline-urban w-full">
                                STOP SCAN
                            </button>
                        )}

                        {result && (
                            <button
                                onClick={() => {
                                    setResult(null);
                                    startQRScanner();
                                }}
                                className="btn-urban w-full"
                            >
                                <Scan className="w-5 h-5" />
                                SCAN AGAIN
                            </button>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-12 p-6 border border-white/10">
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-white/80">
                            Cara Menggunakan:
                        </h3>
                        <ol className="text-sm text-white/40 space-y-2">
                            <li className="flex gap-3">
                                <span className="text-[#00d4ff] font-bold">01</span>
                                Klik "Start Scan"
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#00d4ff] font-bold">02</span>
                                Izinkan akses kamera
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#00d4ff] font-bold">03</span>
                                Arahkan ke QR label
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#00d4ff] font-bold">04</span>
                                Lihat label digital
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
