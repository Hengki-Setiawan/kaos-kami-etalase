'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'solid';
    hover?: boolean;
}

export function Card({
    className,
    variant = 'default',
    hover = true,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl transition-all duration-300',
                variant === 'default' && 'bg-white/[0.03] border border-white/[0.08]',
                variant === 'glass' && 'glass',
                variant === 'solid' && 'bg-gray-900 border border-gray-800',
                hover && 'hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardImage({
    src,
    alt,
    className
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    return (
        <div className={cn('overflow-hidden rounded-t-2xl', className)}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>
    );
}

export function CardContent({
    className,
    children
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn('p-5', className)}>
            {children}
        </div>
    );
}

export function CardTitle({
    className,
    children
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <h3 className={cn('text-lg font-bold text-white mb-2', className)}>
            {children}
        </h3>
    );
}

export function CardDescription({
    className,
    children
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <p className={cn('text-sm text-gray-400', className)}>
            {children}
        </p>
    );
}
