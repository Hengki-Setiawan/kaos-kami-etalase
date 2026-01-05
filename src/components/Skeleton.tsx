// Skeleton components for loading states

export function ProductCardSkeleton() {
    return (
        <div className="card-urban overflow-hidden animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-4 md:p-6 space-y-3">
                <div className="h-5 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-1/3" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function TextSkeleton({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
    return (
        <div className={`${width} ${height} bg-white/5 rounded animate-pulse`} />
    );
}

export function HeroSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-3 bg-white/5 rounded w-32" />
            <div className="space-y-2">
                <div className="h-12 md:h-16 bg-white/5 rounded w-3/4" />
                <div className="h-12 md:h-16 bg-white/5 rounded w-1/2" />
            </div>
            <div className="h-4 bg-white/5 rounded w-2/3" />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="card-urban p-6 animate-pulse">
            <div className="w-16 h-16 bg-white/5 rounded mx-auto mb-4" />
            <div className="h-4 bg-white/5 rounded w-24 mx-auto mb-2" />
            <div className="h-3 bg-white/5 rounded w-32 mx-auto" />
        </div>
    );
}

export function TestimonialSkeleton() {
    return (
        <div className="card-urban p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-full" />
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-24" />
                    <div className="h-3 bg-white/5 rounded w-16" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
            </div>
        </div>
    );
}
