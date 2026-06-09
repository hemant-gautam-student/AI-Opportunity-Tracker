import { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Clock } from 'lucide-react';
import { CATEGORIES, STATUSES, INITIAL_OPPORTUNITY } from '../utils/constants';
import { validateOpportunity } from '../utils/validators';

export default function OpportunityForm({ editingOpportunity, onSave, onCancel }) {
  const [form, setForm] = useState(INITIAL_OPPORTUNITY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(editingOpportunity);

  // Populate form when editing
  useEffect(() => {
    if (editingOpportunity) {
      setForm(editingOpportunity);
      setErrors({});
    } else {
      setForm(INITIAL_OPPORTUNITY);
      setErrors({});
    }
  }, [editingOpportunity]);

  function handleChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Clear interview fields when status changes away from Interview
      if (field === 'status' && value !== 'Interview') {
        next.interviewDate = '';
        next.interviewTime = '';
      }
      return next;
    });
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateOpportunity(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      if (!isEditing) {
        setForm(INITIAL_OPPORTUNITY);
      }
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(INITIAL_OPPORTUNITY);
    setErrors({});
    onCancel?.();
  }

  const showInterviewFields = form.status === 'Interview';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
          {isEditing ? 'Edit Opportunity' : 'Add Opportunity'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opportunity Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Opportunity Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Software Engineering Intern"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.name
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Organization <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="e.g. Google"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.organization
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
            }`}
          />
          {errors.organization && (
            <p className="mt-1 text-xs text-red-500">{errors.organization}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.category
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
            }`}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Opportunity Link
          </label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => handleChange('link', e.target.value)}
            placeholder="https://..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.link
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
            }`}
          />
          {errors.link && (
            <p className="mt-1 text-xs text-red-500">{errors.link}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.status
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
            }`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-500">{errors.status}</p>
          )}
        </div>

        {/* Conditional Interview Fields */}
        {showInterviewFields && (
          <>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-violet-500" />
                  Interview Date <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="date"
                value={form.interviewDate}
                onChange={(e) => handleChange('interviewDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.interviewDate
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                    : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
                }`}
              />
              {errors.interviewDate && (
                <p className="mt-1 text-xs text-red-500">{errors.interviewDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  Interview Time <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="time"
                value={form.interviewTime}
                onChange={(e) => handleChange('interviewTime', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.interviewTime
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50'
                    : 'border-surface-200 dark:border-surface-700 focus:ring-primary-500/50'
                }`}
              />
              {errors.interviewTime && (
                <p className="mt-1 text-xs text-red-500">{errors.interviewTime}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-100 dark:border-surface-700">
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 text-sm font-medium rounded-xl text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/25"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Update' : 'Save Opportunity'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}