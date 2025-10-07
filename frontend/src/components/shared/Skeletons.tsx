/**
 * Card skeleton for loading states
 */
export function CardSkeleton() {
  return (
    <div className="premium-card p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
        <div className="h-8 bg-base-300 rounded w-3/4"></div>
        <div className="h-3 bg-base-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}

/**
 * Table skeleton for loading states
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-4">
          <div className="h-12 bg-base-300 rounded flex-1"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Chart skeleton for loading states
 */
export function ChartSkeleton() {
  return (
    <div className="premium-card p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-base-300 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-40 bg-base-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 border-b border-base-300">
      <div className="w-12 h-12 bg-base-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-300 rounded w-3/4"></div>
        <div className="h-3 bg-base-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

/**
 * Dashboard skeleton (multiple cards)
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
