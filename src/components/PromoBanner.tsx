'use client';

import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';

export function PromoBanner() {
    const [settings, setSettings] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error('Failed to load promo settings:', err);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        if (!settings) return;

        // Check if promo is turned on at all
        if (!settings.promo_active) {
            setIsVisible(false);
            return;
        }

        // Check dates
        const now = new Date();
        const start = settings.promo_start_date ? new Date(settings.promo_start_date) : null;
        const end = settings.promo_end_date ? new Date(settings.promo_end_date) : null;

        if (start && now < start) {
            setIsVisible(false);
            return;
        }

        if (end && now > end) {
            setIsVisible(false);
            return;
        }

        setIsVisible(true);
    }, [settings]);

    if (!isVisible || !settings?.promo_text) return null;

    return (
        <a
            href={settings.promo_link || '#'}
            className="bg-[#bbff00] text-black w-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#bbff00]/90 transition-colors z-[100] cursor-pointer"
        >
            <Tag className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">{settings.promo_text}</span>
        </a>
    );
}
