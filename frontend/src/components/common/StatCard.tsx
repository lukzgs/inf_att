import type { IconType } from 'react-icons';

interface StatCardProps {
  icon: IconType;
  label: string;
  value: string | number;
  colorClass: string;
}

export default function StatCard({ icon: Icon, label, value, colorClass }: StatCardProps) {
  return (
    <div className={`card bg-base-100 shadow-md ${colorClass}`}>
      <div className="card-body flex-row items-center">
        <div className="mr-4">
          <Icon size={32} />
        </div>
        <div>
          <h2 className="card-title text-3xl font-bold">{value}</h2>
          <p className="text-base-content/80">{label}</p>
        </div>
      </div>
    </div>
  );
}
