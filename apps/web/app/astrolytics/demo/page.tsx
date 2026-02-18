'use client';

import { useState, useEffect } from 'react';
import { NovaProvider, NovaFeature, useNova, NovaFeedbackWidget, NovaFeedbackProvider, useNovaFeedback } from '@nova/plugin/react';

function DemoLoginForm() {
  const nova = useNova();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nova.trackComplete('demo-login-form', { email });
  };

  return (
    <NovaFeature featureId="demo-login-form" className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-base font-semibold text-white mb-4">Login Form</h3>
      <p className="text-xs text-gray-500 mb-4">Auto-tracks view on mount</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              nova.trackInteract('demo-login-form', 'email-input');
            }}
            className="block w-full rounded-lg border border-gray-600 bg-gray-900 text-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-gray-500"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-900 text-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-gray-500"
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          Sign In (tracks complete)
        </button>
      </form>
    </NovaFeature>
  );
}

function DemoButtons() {
  const nova = useNova();
  const feedback = useNovaFeedback();
  const [clickCount, setClickCount] = useState(0);

  return (
    <NovaFeature featureId="demo-cta-buttons" className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-base font-semibold text-white mb-1">Feedback Triggers</h3>
      <p className="text-xs text-gray-500 mb-5">Each button demonstrates a different feedback trigger mode</p>
      <div className="flex flex-col gap-3">
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
          className="bg-green-600 text-white py-2.5 px-5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          Floating Button ({clickCount})
        </button>

        <button
          onClick={() => {
            nova.trackInteract('demo-cta-buttons', 'secondary-click');
            feedback.triggerOverlay({
              featureId: 'demo-cta-buttons',
              prompt: 'Quick feedback on this action?',
              placeholder: 'Your thoughts...',
            });
          }}
          className="bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Overlay Modal
        </button>

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
          className="bg-purple-600 text-white py-2.5 px-5 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          Contextual (auto-dismiss 5s)
        </button>
      </div>
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
    <NovaFeature featureId="demo-pricing" trackOnVisible className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-base font-semibold text-white mb-1">Pricing Cards</h3>
      <p className="text-xs text-gray-500 mb-4">Tracks when 50% visible in viewport</p>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition bg-gray-900">
            <h4 className="font-semibold text-white">{plan.name}</h4>
            <p className="text-2xl font-bold text-white my-2">{plan.price}</p>
            <ul className="text-sm text-gray-400 space-y-1 mb-4">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => nova.trackInteract('demo-pricing', `select-${plan.id}`, { plan: plan.id })}
              className="w-full bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 transition text-sm"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </NovaFeature>
  );
}

function EventLog() {
  const [events, setEvents] = useState<Array<{ time: string; type: string; feature: string; action: string }>>([]);

  useEffect(() => {
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
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm h-64 overflow-auto">
      <div className="text-gray-600 mb-2">// Event Log (intercepted API calls)</div>
      {events.length === 0 ? (
        <div className="text-gray-600">Waiting for events...</div>
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
        {/* Status bar */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400">Plugin Active</span>
          </div>
          <div className="text-gray-500">
            API Key: <code className="text-gray-300">{apiKey.slice(0, 12)}...</code>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DemoLoginForm />
          <DemoButtons />
        </div>

        <div className="mb-6">
          <DemoPricingCards />
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-3">Live Event Stream</h3>
          <EventLog />
        </div>

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
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Plugin Demo</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Interact with the components below and watch Nova ask for feedback in real-time.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
          <p className="mt-4 text-gray-500">Loading plugin configuration...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Make sure you have a PluginConfig created for your tenant.
          </p>
        </div>
      )}

      {apiKey && <DemoContent apiKey={apiKey} />}
    </div>
  );
}
