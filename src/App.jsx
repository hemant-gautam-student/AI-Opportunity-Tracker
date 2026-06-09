import { useState, useEffect, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import OpportunityForm from './components/OpportunityForm';
import OpportunityList from './components/OpportunityList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './utils/constants';
import { searchOpportunities, filterOpportunities } from './utils/validators';
import {
  createOpportunity as airtableCreate,
  updateOpportunity as airtableUpdate,
  deleteOpportunity as airtableDelete,
} from './services/airtableMcpService';
import {
  createInterviewEvent,
  updateInterviewEvent,
  deleteInterviewEvent,
} from './services/calendarMcpService';

function generateId() {
  return `opp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * AI Opportunity Tracker — Main Application
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                         App.jsx                               │
 * │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
 * │  │   State     │  │    UI        │  │   MCP Services      │   │
 * │  │  (localStorage)├→│  Components  │  │   (Airtable/Calendar)│  │
 * │  └─────────────┘  └──────────────┘  └─────────────────────┘   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Save Workflow:
 *   1. Validate form data
 *   2. Save to React state
 *   3. Persist to localStorage
 *   4. Invoke Airtable MCP service
 *   5. If status === 'Interview' → Create Google Calendar event via MCP
 */
export default function App() {
  // Theme
  const [dark, setDark] = useLocalStorage(STORAGE_KEYS.THEME, window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  // Opportunities
  const [opportunities, setOpportunities] = useLocalStorage(STORAGE_KEYS.OPPORTUNITIES, []);

  // UI State
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '' });

  // Derived data — search + filter pipeline
  const visibleOpportunities = useMemo(() => {
    const searched = searchOpportunities(opportunities, searchQuery);
    return filterOpportunities(searched, filters);
  }, [opportunities, searchQuery, filters]);

  /**
   * Handle Save (Create or Update)
   *
   * Workflow:
   *   Save to State → localStorage → Airtable MCP → (if Interview) Calendar MCP
   */
  const handleSave = useCallback(
    async (formData) => {
      const isEditing = Boolean(editingOpportunity);
      let savedOpp = null;

      if (isEditing) {
        // Update existing
        const updated = { ...editingOpportunity, ...formData };
        setOpportunities((prev) =>
          prev.map((o) => (o.id === editingOpportunity.id ? updated : o))
        );
        savedOpp = updated;

        // Airtable MCP: Update record
        await airtableUpdate(updated.airtableId || updated.id, updated);

        // Calendar MCP: Update or create event if interview
        if (updated.status === 'Interview') {
          if (updated.calendarEventId) {
            await updateInterviewEvent(updated.calendarEventId, updated);
          } else {
            const eventResult = await createInterviewEvent(updated);
            if (eventResult) {
              setOpportunities((prev) =>
                prev.map((o) =>
                  o.id === updated.id
                    ? { ...o, calendarEventId: eventResult.calendarEventId }
                    : o
                )
              );
              toast.success('Interview event created in Google Calendar');
            }
          }
        }

        setEditingOpportunity(null);
        toast.success('Opportunity updated successfully');
      } else {
        // Create new
        const newOpp = { ...formData, id: generateId(), createdAt: new Date().toISOString() };
        setOpportunities((prev) => [newOpp, ...prev]);
        savedOpp = newOpp;

        // Airtable MCP: Create record
        const result = await airtableCreate(newOpp);
        if (result?.airtableId) {
          setOpportunities((prev) =>
            prev.map((o) => (o.id === newOpp.id ? { ...o, airtableId: result.airtableId } : o))
          );
        }

        // Calendar MCP: Create event if interview
        if (newOpp.status === 'Interview') {
          const eventResult = await createInterviewEvent(newOpp);
          if (eventResult) {
            setOpportunities((prev) =>
              prev.map((o) =>
                o.id === newOpp.id
                  ? { ...o, calendarEventId: eventResult.calendarEventId }
                  : o
              )
            );
            toast.success('Interview event created in Google Calendar');
          }
        }

        toast.success('Opportunity added successfully');
      }

      // Debug log for MCP demonstration
      console.log('[Save Workflow] Completed for:', savedOpp?.name, {
        isEditing,
        airtableSync: true,
        calendarSync: savedOpp?.status === 'Interview',
      });
    },
    [editingOpportunity, setOpportunities]
  );

  // Edit
  const handleEdit = useCallback((opp) => {
    setEditingOpportunity(opp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Delete
  const handleDelete = useCallback(
    async (opp) => {
      setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));

      // Airtable MCP: Delete record
      await airtableDelete(opp.airtableId || opp.id);

      // Calendar MCP: Delete event if exists
      if (opp.calendarEventId) {
        await deleteInterviewEvent(opp.calendarEventId);
        toast.success('Interview event removed from calendar');
      }

      toast.success('Opportunity deleted');
    },
    [setOpportunities]
  );

  // Cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingOpportunity(null);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar dark={dark} onToggleTheme={() => setDark((d) => !d)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <StatsCards opportunities={opportunities} />

        {/* Form Section */}
        <OpportunityForm
          editingOpportunity={editingOpportunity}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* Opportunity Table */}
        <OpportunityList
          opportunities={visibleOpportunities}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 mt-12 py-6 text-center text-xs text-surface-400 dark:text-surface-500">
        AI Opportunity Tracker — Built with React, Vite & Tailwind CSS — MCP-First Demo
      </footer>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}