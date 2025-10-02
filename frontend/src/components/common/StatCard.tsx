import type { IconType } from 'react-icons';

interface StatCardProps {
  icon: IconType;
  label: string;
  value: string | number;
  colorClass: string;
}

export default function StatCard({ icon: Icon, label, value, colorClass }: StatCardProps) {
  return (
    <div className={`card bg-base-100 shadow-md border border-base-300 ${colorClass}`}>
      <div className="card-body p-4 sm:p-6 flex-row items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <Icon size={28} className="sm:w-8 sm:h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="card-title text-2xl sm:text-3xl font-bold mb-1">{value}</h2>
          <p className="text-sm sm:text-base opacity-90 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
}
