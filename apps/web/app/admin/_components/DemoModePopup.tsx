'use client';

import { useEffect, useState } from 'react';
import { PRODUCT_TEAM, DemoModeError } from '../_lib/permissions';

interface DemoModePopupProps {
  error: DemoModeError | null;
  onClose: () => void;
}

export function DemoModePopup({ error, onClose }: DemoModePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    }
  }, [error]);

  if (!error || !isVisible) return null;

  const contacts = error.contactTeam || PRODUCT_TEAM;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Demo Mode</h2>
          <p className="text-purple-100">
            You're exploring Nova in preview mode
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {error.message || "Changes won't be saved in demo mode. Contact the product team for full access."}
          </p>

          {/* Contact cards */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
              Contact for access:
            </p>
            <div className="grid gap-2">
              {contacts.map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}?subject=Nova Access Request`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {contact.email}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage demo mode popup state
 */
export function useDemoModePopup() {
  const [error, setError] = useState<DemoModeError | null>(null);

  const showDemoError = (err: DemoModeError) => {
    setError(err);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    showDemoError,
    clearError,
  };
}

export default DemoModePopup;
