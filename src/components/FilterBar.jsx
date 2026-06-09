import { Filter, X } from 'lucide-react';
import { CATEGORIES, STATUSES } from '../utils/constants';

export default function FilterBar({ filters, onChange }) {
  const hasFilters = filters.category || filters.status;

  function clearFilters() {
    onChange({ category: '', status: '' });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters</span>
      </div>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="px-3 py-2 text-sm rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 text-sm rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}