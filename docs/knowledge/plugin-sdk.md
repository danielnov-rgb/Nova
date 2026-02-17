# Nova Plugin SDK & Agent CLI

Documentation for `@nova/plugin` analytics SDK and `nova-agent` CLI tool.

---

## @nova/plugin - Analytics Tracking SDK
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Comprehensive analysis of packages/nova-plugin -->

### Core Tracker

```typescript
import { createNovaTracker } from '@nova/plugin';

const tracker = createNovaTracker({
  apiKey: 'nova_xxx',
  apiEndpoint: 'https://api.nova.app',  // default
  batchSize: 10,                         // events before auto-flush
  flushInterval: 5000,                   // ms between flushes
  debug: false,
  disabled: false,
});

tracker.trackView('feature-id', metadata?);
tracker.trackInteract('feature-id', 'action-name', metadata?);
tracker.trackComplete('feature-id', metadata?);
tracker.trackError('feature-id', error, metadata?);
tracker.trackPageView(metadata?);
tracker.track('feature-id', 'custom-event', metadata?);
tracker.flush();  // Manual flush
tracker.setGlobalMetadata({ userId: '123' });
```

**Session management:** UUID v4 stored in `sessionStorage`.
**Auto-enrichment:** pageUrl, userAgent, referrer, timestamp added to all events.
**Batching:** Events queue until batchSize reached or flushInterval timer fires.
**Flush triggers:** batchSize, timer, `visibilitychange`, `pagehide` events.
**Error handling:** Failed events re-queued for retry.

---

### React Integration
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: React hooks and components from nova-plugin/react -->

**NovaProvider** - Context wrapper:
```tsx
import { NovaProvider } from '@nova/plugin/react';

<NovaProvider apiKey={key} apiEndpoint={url} disabled={isDev}>
  <App />
</NovaProvider>
```

**NovaFeature** - Auto-tracking component:
```tsx
import { NovaFeature } from '@nova/plugin/react';

<NovaFeature
  featureId="checkout-form"
  trackView={true}          // Track on mount (default true)
  trackOnVisible={false}    // Track when 50% visible via IntersectionObserver
  metadata={{ page: 'cart' }}
  className="optional-class"
>
  <CheckoutForm />
</NovaFeature>
```
Renders `<div data-nova-feature={featureId}>`. Prevents duplicate view tracking.

**useNova** - Raw tracker access:
```tsx
const tracker = useNova();
tracker.trackInteract('feature', 'click', { item: 'buy' });
```

**useNovaTracker** - Feature-scoped tracking:
```tsx
const { trackInteract, trackComplete, trackError } = useNovaTracker({
  featureId: 'checkout',
  trackView: true,
  metadata: { page: 'cart' },
});

trackInteract('submit', { total: 99 });  // featureId auto-included
```

---

### Feedback System
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: In-app feedback widget from nova-plugin -->

```tsx
import { NovaFeedbackProvider, NovaFeedbackWidget, useNovaFeedback } from '@nova/plugin/react';

// Wrap app
<NovaFeedbackProvider>
  <NovaFeedbackWidget />
  <App />
</NovaFeedbackProvider>

// Trigger programmatically
const feedback = useNovaFeedback();
feedback.trigger('floating', { featureId: 'checkout', prompt: 'How was checkout?' });
feedback.trigger('overlay', { featureId: 'search' });
feedback.trigger('contextual', { anchorElement: buttonRef.current, autoDismissMs: 5000 });
```

**Trigger modes:**
- `floating` - Button in bottom-right corner (56px circle)
- `overlay` - Modal opens immediately
- `contextual` - Button near anchor element, auto-dismisses

**Modal features:** Star rating (1-5), comment textarea, submission callback, success screen (2s dismiss).

---

## nova-agent - CLI Feature Discovery
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Comprehensive analysis of packages/nova-agent -->

### Commands

```bash
nova-agent auth --api-key <key> --endpoint <url>
nova-agent discover [path] [options]
nova-agent config
```

### Discovery Pipeline

1. **Framework detection** (from package.json): next, nuxt, vue, angular, react
2. **AST analysis** (Babel parser): exports, hooks, interactions, forms, child components
3. **Feature generation**: Page-level + child features (forms, modals, cards)
4. **Output**: Feature table + optional JSON file

### Discover Options

```bash
nova-agent discover . \
  --framework nextjs \    # Override auto-detection
  --dry-run \             # Preview only
  --sync \                # Push features to Nova API
  --instrument \          # Generate tracking code
  --branch nova/instrumentation \
  --output features.json
```

### What Discovery Finds

**Page sources:**
- App Router: `app/**/page.{tsx,jsx,ts,js}`
- Pages Router: `pages/**/*.{tsx,jsx,ts,js}`
- React Router: `<Route>` elements in App.jsx

**Per-component analysis:**
- Exported functions/components
- Hook calls (`useXxx`)
- DOM interactions (`onClick`, `onSubmit`, etc.)
- Child components (capitalized JSX)
- Form detection

**Feature types:** page, section, component, form, action, modal

### Code Generation (--instrument)

Generates:
1. `components/providers/NovaProvider.tsx` - 'use client' wrapper reading from env
2. Updated root layout wrapping children in `<NovaProvider>`
3. `.env.example` with `NEXT_PUBLIC_NOVA_API_KEY`

### API Sync (--sync)

POST to `/plugin/features/bulk-import` with `x-nova-api-key` header.
Returns: `{ created, updated, skipped, errors }`.

### Git Workflow (--instrument + --branch)

1. Verify clean working tree
2. Create/checkout branch
3. Write generated files
4. `git add` + `git commit` with descriptive message
5. `git push -u origin branchName` (handles push failures gracefully)

### Configuration

Stored via `conf` library (~/.config/nova-agent/config.json):
```typescript
{
  apiKey?: string,
  apiEndpoint: 'http://localhost:3001/api',  // default
  defaultBranch: 'nova/feature-instrumentation'
}
```
