'use client';

import { useState, useEffect } from 'react';
import { NovaProvider, NovaFeature, useNova, NovaFeedbackWidget, NovaFeedbackProvider, useNovaFeedback } from '@nova/plugin/react';

// Demo components that use tracking
function DemoLoginForm() {
  const nova = useNova();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nova.trackComplete('demo-login-form', { email });
  };

  return (
    <NovaFeature featureId="demo-login-form" className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Login Form (Auto-tracks view on mount)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              nova.trackInteract('demo-login-form', 'email-input');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Sign In (tracks complete)
        </button>
      </form>
    </NovaFeature>
  );
}

function DemoPricingCards() {
  const nova = useNova();

  const plans = [
    { id: 'free', name: 'Free', price: '$0', features: ['5 projects', 'Basic analytics'] },
    { id: 'pro', name: 'Pro', price: '$29', features: ['Unlimited projects', 'Advanced analytics', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated account manager', 'SLA'] },
  ];

  return (
    <NovaFeature featureId="demo-pricing" trackOnVisible className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Pricing Cards (Tracks when 50% visible)</h3>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-semibold text-lg">{plan.name}</h4>
            <p className="text-2xl font-bold my-2">{plan.price}</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => nova.trackInteract('demo-pricing', `select-${plan.id}`, { plan: plan.id })}
              className="mt-4 w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </NovaFeature>
  );
}

function DemoButtons() {
  const nova = useNova();
  const feedback = useNovaFeedback();
  const [clickCount, setClickCount] = useState(0);

  return (
    <NovaFeature featureId="demo-cta-buttons" className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">CTA Buttons (Feedback Trigger Modes)</h3>
      <p className="text-sm text-gray-500 mb-4">Each button demonstrates a different feedback trigger mode</p>
      <div className="flex gap-4">
        {/* Mode 1: Floating Button */}
        <button
          onClick={() => {
            setClickCount((c) => c + 1);
            nova.trackInteract('demo-cta-buttons', 'primary-click', { clickCount: clickCount + 1 });
            feedback.triggerFloating({
              featureId: 'demo-cta-buttons',
              prompt: 'How do you like our primary CTA?',
              placeholder: 'Tell us about your experience...',
            });
          }}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
        >
          Mode 1: Floating ({clickCount})
        </button>

        {/* Mode 2: Overlay Modal */}
        <button
          onClick={() => {
            nova.trackInteract('demo-cta-buttons', 'secondary-click');
            feedback.triggerOverlay({
              featureId: 'demo-cta-buttons',
              prompt: 'Quick feedback on this action?',
              placeholder: 'Your thoughts...',
            });
          }}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
        >
          Mode 2: Overlay
        </button>

        {/* Mode 3: Contextual Button */}
        <button
          id="contextual-trigger"
          onClick={(e) => {
            nova.trackInteract('demo-cta-buttons', 'contextual-click');
            feedback.triggerContextual({
              featureId: 'demo-cta-buttons',
              prompt: 'Was this action helpful?',
              placeholder: 'Let us know...',
              anchorElement: e.currentTarget,
              autoDismissMs: 5000,
            });
          }}
          className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition"
        >
          Mode 3: Contextual
        </button>
      </div>
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p><strong>Mode 1:</strong> Floating N button appears at bottom-right with flash</p>
        <p><strong>Mode 2:</strong> Modal opens directly as an overlay</p>
        <p><strong>Mode 3:</strong> Contextual button appears near click, auto-dismisses in 5s</p>
      </div>
    </NovaFeature>
  );
}

function EventLog() {
  const [events, setEvents] = useState<Array<{ time: string; type: string; feature: string; action: string }>>([]);

  useEffect(() => {
    // Intercept fetch calls to log events
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      if (typeof url === 'string' && url.includes('/plugin/events') && options?.body) {
        try {
          const body = JSON.parse(options.body as string);
          const newEvents = body.events.map((e: any) => ({
            time: new Date().toLocaleTimeString(),
            type: e.eventType,
            feature: e.featureId || 'n/a',
            action: e.eventName,
          }));
          setEvents((prev) => [...newEvents, ...prev].slice(0, 20));
        } catch {}
      }
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm h-64 overflow-auto">
      <div className="text-gray-500 mb-2">// Event Log (intercepted API calls)</div>
      {events.length === 0 ? (
        <div className="text-gray-500">Waiting for events...</div>
      ) : (
        events.map((e, i) => (
          <div key={i} className="py-1 border-b border-gray-800">
            <span className="text-gray-500">{e.time}</span>{' '}
            <span className="text-yellow-400">[{e.type}]</span>{' '}
            <span className="text-cyan-400">{e.feature}</span>{' '}
            <span className="text-white">→ {e.action}</span>
          </div>
        ))
      )}
    </div>
  );
}

function PluginStatus({ apiKey }: { apiKey: string }) {
  const nova = useNova();
  const sessionId = nova.getSessionId();

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-indigo-900 mb-2">Plugin Status</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Session ID:</span>
          <code className="ml-2 bg-white px-2 py-1 rounded text-xs">{sessionId}</code>
        </div>
        <div>
          <span className="text-gray-600">API Key:</span>
          <code className="ml-2 bg-white px-2 py-1 rounded text-xs">{apiKey.slice(0, 12)}...</code>
        </div>
        <div>
          <span className="text-gray-600">Endpoint:</span>
          <code className="ml-2 bg-white px-2 py-1 rounded text-xs">http://localhost:3001/api</code>
        </div>
        <div>
          <span className="text-gray-600">Status:</span>
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ● Active
          </span>
        </div>
      </div>
    </div>
  );
}

function DemoContent({ apiKey }: { apiKey: string }) {
  return (
    <NovaProvider apiKey={apiKey} apiEndpoint="http://localhost:3001/api" debug>
      <NovaFeedbackProvider
        defaultPrompt="How can we improve your experience?"
        defaultPlaceholder="Share your thoughts..."
        onSubmit={(feedback) => {
          console.log('Feedback submitted:', feedback);
        }}
      >
        <PluginStatus apiKey={apiKey} />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <DemoLoginForm />
          <DemoButtons />
        </div>

        <div className="mb-6">
          <DemoPricingCards />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Live Event Stream</h3>
          <EventLog />
        </div>

        {/* Original Nova Feedback Widget - still available as standalone */}
        <NovaFeedbackWidget
          featureId="demo-page"
          prompt="How is the plugin demo experience?"
          placeholder="Tell us what you think about this demo..."
          onSubmit={(feedback) => {
            console.log('Standalone widget feedback:', feedback);
          }}
        />
      </NovaFeedbackProvider>
    </NovaProvider>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nova_admin_token');
}

export default function PluginDemoPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the API key from the plugin config via backend API
    async function fetchConfig() {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/plugin/config`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch plugin config');
        const data = await res.json();
        setApiKey(data.apiKey);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load config');
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Plugin Demo</h1>
        <p className="text-gray-600 mt-1">
          Interactive demo to test Nova plugin tracking. Interact with the components below and watch events stream in real-time.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plugin configuration...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure you have a PluginConfig created for your tenant.
          </p>
        </div>
      )}

      {apiKey && <DemoContent apiKey={apiKey} />}
    </div>
  );
}
