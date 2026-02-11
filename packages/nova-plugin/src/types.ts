/**
 * Nova Plugin Types
 */

export type EventType =
  | 'FEATURE_VIEW'
  | 'FEATURE_INTERACT'
  | 'FEATURE_COMPLETE'
  | 'FEATURE_ERROR'
  | 'FEATURE_EXIT'
  | 'PAGE_VIEW'
  | 'CUSTOM';

export interface NovaEvent {
  eventType: EventType;
  eventName: string;
  featureId?: string;
  sessionId: string;
  deviceId?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
}

export interface NovaTrackerConfig {
  /**
   * Your Nova API key from the admin dashboard
   */
  apiKey: string;

  /**
   * Nova API endpoint (defaults to Nova Cloud)
   */
  apiEndpoint?: string;

  /**
   * Number of events to batch before flushing (default: 10)
   */
  batchSize?: number;

  /**
   * Max time (ms) to wait before flushing (default: 5000)
   */
  flushInterval?: number;

  /**
   * Enable debug logging (default: false)
   */
  debug?: boolean;

  /**
   * Disable tracking entirely (useful for development)
   */
  disabled?: boolean;
}

export interface TrackerInstance {
  /**
   * Track a custom event
   */
  track: (
    featureId: string,
    eventName: string,
    metadata?: Record<string, unknown>,
  ) => void;

  /**
   * Track a feature view
   */
  trackView: (featureId: string, metadata?: Record<string, unknown>) => void;

  /**
   * Track feature interaction (click, input, etc.)
   */
  trackInteract: (
    featureId: string,
    action: string,
    metadata?: Record<string, unknown>,
  ) => void;

  /**
   * Track feature workflow completion
   */
  trackComplete: (
    featureId: string,
    metadata?: Record<string, unknown>,
  ) => void;

  /**
   * Track a feature error
   */
  trackError: (
    featureId: string,
    error: string | Error,
    metadata?: Record<string, unknown>,
  ) => void;

  /**
   * Track page view (no feature)
   */
  trackPageView: (metadata?: Record<string, unknown>) => void;

  /**
   * Manually flush the event queue
   */
  flush: () => Promise<void>;

  /**
   * Get the current session ID
   */
  getSessionId: () => string;

  /**
   * Set custom metadata for all future events
   */
  setGlobalMetadata: (metadata: Record<string, unknown>) => void;
}
