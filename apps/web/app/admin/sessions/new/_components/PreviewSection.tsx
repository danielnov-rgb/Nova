"use client";

interface PreviewSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export function PreviewSection({ title, onEdit, children }: PreviewSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
