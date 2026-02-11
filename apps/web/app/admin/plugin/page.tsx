'use client';

import { useState, useEffect } from 'react';
import { pluginApi, type PluginConfig, type UpdatePluginConfigDto } from '../_lib/api';

export default function PluginConfigPage() {
  const [config, setConfig] = useState<PluginConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showApiKey, setShowApiKey] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await pluginApi.getConfig();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plugin config');
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleToggleEnabled = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);

    try {
      const updated = await pluginApi.updateConfig({ isEnabled: !config.isEnabled });
      setConfig(updated);
      setSuccess(`Plugin ${updated.isEnabled ? 'enabled' : 'disabled'}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
    } finally {
      setSaving(false);
    }
  };

  const handleAddOrigin = async () => {
    if (!config || !newOrigin.trim()) return;

    // Validate origin format
    try {
      new URL(newOrigin.trim());
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await pluginApi.updateConfig({
        allowedOrigins: [...config.allowedOrigins, newOrigin.trim()],
      });
      setConfig(updated);
      setNewOrigin('');
      setSuccess('Origin added');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add origin');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveOrigin = async (origin: string) => {
    if (!config) return;
    setSaving(true);
    setError(null);

    try {
      const updated = await pluginApi.updateConfig({
        allowedOrigins: config.allowedOrigins.filter((o) => o !== origin),
      });
      setConfig(updated);
      setSuccess('Origin removed');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove origin');
    } finally {
      setSaving(false);
    }
  };

  const handleRotateApiKey = async () => {
    if (!confirm('Are you sure? This will invalidate the current API key immediately.')) return;

    setSaving(true);
    setError(null);

    try {
      const result = await pluginApi.rotateApiKey();
      setConfig((prev) => (prev ? { ...prev, apiKey: result.apiKey } : null));
      setShowApiKey(true);
      setSuccess('API key rotated. Make sure to update your plugin configuration!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rotate API key');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading plugin configuration...
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Failed to load plugin configuration
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nova Plugin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure analytics tracking for your application
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Plugin Status
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {config.isEnabled
                    ? 'Plugin is active and receiving events'
                    : 'Plugin is disabled. Events will be rejected.'}
                </p>
              </div>
              <button
                onClick={handleToggleEnabled}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.isEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              API Key
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use this key to authenticate your Nova plugin. Keep it secret!
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm overflow-x-auto">
                {showApiKey ? config.apiKey : '••••••••••••••••••••••••••••••••'}
              </div>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {showApiKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => copyToClipboard(config.apiKey)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleRotateApiKey}
              disabled={saving}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Rotate API Key
            </button>
          </div>

          {/* Allowed Origins */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Allowed Origins
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Configure which domains can send events to Nova. Leave empty to allow all origins.
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newOrigin}
                onChange={(e) => setNewOrigin(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleAddOrigin}
                disabled={saving || !newOrigin.trim()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {config.allowedOrigins.length > 0 ? (
              <ul className="space-y-2">
                {config.allowedOrigins.map((origin) => (
                  <li
                    key={origin}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white font-mono text-sm">
                      {origin}
                    </span>
                    <button
                      onClick={() => handleRemoveOrigin(origin)}
                      disabled={saving}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No origins configured - all origins are allowed
              </p>
            )}
          </div>

          {/* Installation */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Installation
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  1. Install the package
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm text-green-400">npm install @nova/plugin</code>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  2. Initialize the tracker
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-sm text-green-400">{`import { createNovaTracker } from '@nova/plugin';

const nova = createNovaTracker({
  apiKey: '${config.apiKey}',
});

// Track feature views
nova.trackView('my-feature');

// Track completions
nova.trackComplete('checkout-form');`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  React Integration
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-sm text-green-400">{`import { NovaProvider, useNova } from '@nova/plugin/react';

function App() {
  return (
    <NovaProvider apiKey="${config.apiKey}">
      <YourApp />
    </NovaProvider>
  );
}

function MyComponent() {
  const nova = useNova();

  useEffect(() => {
    nova.trackView('my-component');
  }, []);
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
