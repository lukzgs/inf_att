/**
 * Skeleton Loading Components
 * 
 * Componentes de loading skeleton para diferentes layouts,
 * proporcionando melhor feedback visual durante carregamento.
 */

// Base Skeleton Component
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-base-300 rounded ${className}`}
      role="status"
      aria-label="Carregando..."
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

// Card Skeleton (para StatCard, CourseCard, etc.)
export function CardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Table Skeleton (para CoursesListPage)
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
      <table className="table w-full">
        <thead>
          <tr className="border-b border-base-300">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="bg-base-200">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mobile Card List Skeleton (para CoursesListPage mobile)
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-16 flex-shrink-0" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-4 sm:p-6 space-y-6">
        {/* Title */}
        <Skeleton className="h-8 w-48 mx-auto" />

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Field 1 */}
          <div className="form-control">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Field 2 */}
          <div className="form-control">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        {/* Buttons */}
        <div className="form-control gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton (3 cards)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

// List Page Skeleton (combines header + table/cards)
export function ListPageSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-32 sm:w-40" />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <TableSkeleton rows={5} cols={4} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <CardListSkeleton count={5} />
      </div>
    </div>
  );
}

// Text Lines Skeleton (para parágrafos, descrições)
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}
