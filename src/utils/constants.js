export const CATEGORIES = [
  'Internship',
  'Job',
  'Hackathon',
  'Fellowship',
  'Freelance',
  'Builder Program',
];

export const STATUSES = [
  'Interested',
  'Applied',
  'Interview',
  'Rejected',
  'Accepted',
];

export const CATEGORY_COLORS = {
  Internship: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  Job: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Hackathon: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  Fellowship: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  Freelance: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  'Builder Program': { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
};

export const STATUS_COLORS = {
  Interested: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  Applied: { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-300' },
  Interview: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
  Rejected: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300' },
  Accepted: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300' },
};

export const STORAGE_KEYS = {
  OPPORTUNITIES: 'ai-tracker-opportunities',
  THEME: 'ai-tracker-theme',
};

export const INITIAL_OPPORTUNITY = {
  name: '',
  organization: '',
  link: '',
  category: '',
  status: 'Interested',
  interviewDate: '',
  interviewTime: '',
};