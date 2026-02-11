import type {
  NovaTrackerConfig,
  NovaEvent,
  EventType,
  TrackerInstance,
} from './types';

const DEFAULT_API_ENDPOINT = 'https://api.nova.app';
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_FLUSH_INTERVAL = 5000;
const SESSION_STORAGE_KEY = 'nova_session_id';

/**
 * Generate a random UUID v4
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateUUID();
  }

  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    // sessionStorage not available (private browsing, etc.)
    return generateUUID();
  }
}

/**
 * Nova Analytics Tracker
 *
 * Usage:
 * ```ts
 * const tracker = createNovaTracker({ apiKey: 'your-api-key' });
 * tracker.trackView('checkout-form');
 * tracker.track('checkout-form', 'submit', { cartTotal: 99.99 });
 * ```
 */
export class NovaTracker implements TrackerInstance {
  private config: Required<
    Pick<NovaTrackerConfig, 'apiEndpoint' | 'batchSize' | 'flushInterval' | 'debug' | 'disabled'>
  > & { apiKey: string };
  private queue: NovaEvent[] = [];
  private sessionId: string;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private globalMetadata: Record<string, unknown> = {};
  private isFlushing = false;

  constructor(config: NovaTrackerConfig) {
    this.config = {
      apiKey: config.apiKey,
      apiEndpoint: config.apiEndpoint || DEFAULT_API_ENDPOINT,
      batchSize: config.batchSize || DEFAULT_BATCH_SIZE,
      flushInterval: config.flushInterval || DEFAULT_FLUSH_INTERVAL,
      debug: config.debug || false,
      disabled: config.disabled || false,
    };

    this.sessionId = getSessionId();
    this.startFlushTimer();

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
      window.addEventListener('pagehide', () => this.flush());
    }

    this.log('Nova tracker initialized', { sessionId: this.sessionId });
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[Nova]', ...args);
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private enqueue(event: Omit<NovaEvent, 'sessionId'>): void {
    if (this.config.disabled) {
      return;
    }

    const fullEvent: NovaEvent = {
      ...event,
      sessionId: this.sessionId,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      occurredAt: new Date().toISOString(),
      metadata: {
        ...this.globalMetadata,
        ...event.metadata,
      },
    };

    this.queue.push(fullEvent);
    this.log('Event queued', fullEvent);

    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing || this.config.disabled) {
      return;
    }

    this.isFlushing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(`${this.config.apiEndpoint}/plugin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nova-api-key': this.config.apiKey,
        },
        body: JSON.stringify({ events }),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.log('Events flushed successfully', { count: events.length });
    } catch (error) {
      // Re-queue failed events
      this.queue = [...events, ...this.queue];
      this.log('Failed to flush events, re-queued', error);
    } finally {
      this.isFlushing = false;
    }
  }

  track(
    featureId: string,
    eventName: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.enqueue({
      eventType: 'CUSTOM',
      eventName,
      featureId,
      metadata,
    });
  }

  trackView(featureId: string, metadata?: Record<string, unknown>): void {
    this.enqueue({
      eventType: 'FEATURE_VIEW',
      eventName: 'view',
      featureId,
      metadata,
    });
  }

  trackInteract(
    featureId: string,
    action: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.enqueue({
      eventType: 'FEATURE_INTERACT',
      eventName: action,
      featureId,
      metadata,
    });
  }

  trackComplete(featureId: string, metadata?: Record<string, unknown>): void {
    this.enqueue({
      eventType: 'FEATURE_COMPLETE',
      eventName: 'complete',
      featureId,
      metadata,
    });
  }

  trackError(
    featureId: string,
    error: string | Error,
    metadata?: Record<string, unknown>,
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.enqueue({
      eventType: 'FEATURE_ERROR',
      eventName: 'error',
      featureId,
      metadata: {
        ...metadata,
        error: errorMessage,
        stack: errorStack,
      },
    });
  }

  trackPageView(metadata?: Record<string, unknown>): void {
    this.enqueue({
      eventType: 'PAGE_VIEW',
      eventName: 'pageview',
      metadata,
    });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  setGlobalMetadata(metadata: Record<string, unknown>): void {
    this.globalMetadata = { ...this.globalMetadata, ...metadata };
  }
}

/**
 * Create a new Nova tracker instance
 */
export function createNovaTracker(config: NovaTrackerConfig): TrackerInstance {
  return new NovaTracker(config);
}
