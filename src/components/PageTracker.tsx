'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
            return;
        }

        // Get page name from pathname
        const pageName = pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean).join(' > ');

        // Track page view
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: pageName, path: pathname })
        }).catch(() => {
            // Silently fail - analytics shouldn't break the site
        });
    }, [pathname]);

    return null;
}
