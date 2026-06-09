import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or organization..."
        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}