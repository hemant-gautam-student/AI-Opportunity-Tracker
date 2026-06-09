import { Moon, Sun, Briefcase } from 'lucide-react';

export default function Navbar({ dark, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/25">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-tight">
                AI Opportunity Tracker
              </h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Track & manage your career pipeline
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}