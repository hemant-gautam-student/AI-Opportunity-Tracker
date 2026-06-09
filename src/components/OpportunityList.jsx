import { useState } from 'react';
import { Pencil, Trash2, ExternalLink, Calendar, Clock, ChevronUp, ChevronDown, Inbox } from 'lucide-react';
import { CATEGORY_COLORS, STATUS_COLORS } from '../utils/constants';
import ConfirmDialog from './ConfirmDialog';

function SortIcon({ field, currentSort, currentDir }) {
  if (field !== currentSort) {
    return (
      <span className="inline-flex flex-col ml-1 opacity-30">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </span>
    );
  }
  return currentDir === 'asc' ? (
    <ChevronUp className="inline w-3.5 h-3.5 ml-1" />
  ) : (
    <ChevronDown className="inline w-3.5 h-3.5 ml-1" />
  );
}

export default function OpportunityList({ opportunities, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const sorted = [...opportunities].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = (a[sortField] || '').toLowerCase();
    const bVal = (b[sortField] || '').toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function confirmDelete() {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm p-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
          <Inbox className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
          No opportunities yet
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
          Add your first opportunity using the form above to start tracking your career pipeline.
        </p>
      </div>
    );
  }

  const columns = [
    { key: 'name', label: 'Opportunity', sortable: true },
    { key: 'organization', label: 'Organization', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'interviewDate', label: 'Interview', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <>
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-700">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider text-left ${
                      col.sortable ? 'cursor-pointer select-none hover:text-surface-700 dark:hover:text-surface-200' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {col.sortable && (
                        <SortIcon field={col.key} currentSort={sortField} currentDir={sortDir} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {sorted.map((opp) => {
                const catColors = CATEGORY_COLORS[opp.category] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
                const statusColors = STATUS_COLORS[opp.status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };

                return (
                  <tr
                    key={opp.id}
                    className="hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors group"
                  >
                    {/* Opportunity Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-surface-900 dark:text-white truncate max-w-[200px]">
                          {opp.name}
                        </span>
                        {opp.link && (
                          <a
                            href={opp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg text-surface-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Open link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Organization */}
                    <td className="px-4 py-3.5 text-sm text-surface-700 dark:text-surface-300">
                      {opp.organization}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${catColors.bg} ${catColors.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${catColors.dot}`} />
                        {opp.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                        {opp.status}
                      </span>
                    </td>

                    {/* Interview Info */}
                    <td className="px-4 py-3.5 text-sm text-surface-500 dark:text-surface-400">
                      {opp.interviewDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{opp.interviewDate}</span>
                          {opp.interviewTime && (
                            <>
                              <Clock className="w-3.5 h-3.5 ml-1" />
                              <span>{opp.interviewTime}</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-surface-300 dark:text-surface-600">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(opp)}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(opp)}
                          className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-700 text-xs text-surface-500 dark:text-surface-400">
          Showing {sorted.length} of {opportunities.length} opportunities
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Opportunity"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}