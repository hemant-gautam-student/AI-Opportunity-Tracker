import { Briefcase, Send, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';

const statsConfig = [
  { key: 'total', label: 'Total', icon: Briefcase, color: 'bg-primary-500' },
  { key: 'applied', label: 'Applied', icon: Send, color: 'bg-sky-500' },
  { key: 'interview', label: 'Interviews', icon: CalendarCheck, color: 'bg-violet-500' },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2, color: 'bg-green-500' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
];

export default function StatsCards({ opportunities }) {
  const counts = {
    total: opportunities.length,
    applied: opportunities.filter((o) => o.status === 'Applied').length,
    interview: opportunities.filter((o) => o.status === 'Interview').length,
    accepted: opportunities.filter((o) => o.status === 'Accepted').length,
    rejected: opportunities.filter((o) => o.status === 'Rejected').length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        const count = counts[stat.key];

        return (
          <div
            key={stat.key}
            className="relative bg-white dark:bg-surface-800 rounded-2xl p-4 shadow-sm border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${stat.color} text-white shadow-lg`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums">
                  {count}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}