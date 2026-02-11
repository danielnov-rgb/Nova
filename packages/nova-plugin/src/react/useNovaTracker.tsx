'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useNova } from './NovaProvider';
import type { TrackerInstance } from '../types';

export interface UseNovaTrackerOptions {
  /**
   * The feature ID to track
   */
  featureId: string;

  /**
   * Automatically track view on mount (default: true)
   */
  trackView?: boolean;

  /**
   * Additional metadata to include with all events
   */
  metadata?: Record<string, unknown>;
}

export interface UseNovaTrackerReturn {
  /**
   * Track a custom event for this feature
   */
  track: (eventName: string, metadata?: Record<string, unknown>) => void;

  /**
   * Track an interaction for this feature
   */
  trackInteract: (action: string, metadata?: Record<string, unknown>) => void;

  /**
   * Track completion for this feature
   */
  trackComplete: (metadata?: Record<string, unknown>) => void;

  /**
   * Track an error for this feature
   */
  trackError: (error: string | Error, metadata?: Record<string, unknown>) => void;

  /**
   * The underlying tracker instance
   */
  tracker: TrackerInstance;
}

/**
 * Hook for tracking a specific feature
 *
 * @example
 * ```tsx
 * function CheckoutForm() {
 *   const { track, trackComplete } = useNovaTracker({
 *     featureId: 'checkout-form',
 *   });
 *
 *   const handlePromoCode = (code: string) => {
 *     track('promo-applied', { code });
 *   };
 *
 *   const handleSubmit = () => {
 *     trackComplete({ orderTotal: 99.99 });
 *   };
 *
 *   return <form>...</form>;
 * }
 * ```
 */
export function useNovaTracker(options: UseNovaTrackerOptions): UseNovaTrackerReturn {
  const { featureId, trackView = true, metadata: baseMetadata } = options;
  const tracker = useNova();
  const hasTrackedView = useRef(false);

  // Track view on mount (once)
  useEffect(() => {
    if (trackView && !hasTrackedView.current) {
      hasTrackedView.current = true;
      tracker.trackView(featureId, baseMetadata);
    }
  }, [featureId, trackView, tracker, baseMetadata]);

  const track = useCallback(
    (eventName: string, metadata?: Record<string, unknown>) => {
      tracker.track(featureId, eventName, { ...baseMetadata, ...metadata });
    },
    [tracker, featureId, baseMetadata],
  );

  const trackInteract = useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      tracker.trackInteract(featureId, action, { ...baseMetadata, ...metadata });
    },
    [tracker, featureId, baseMetadata],
  );

  const trackComplete = useCallback(
    (metadata?: Record<string, unknown>) => {
      tracker.trackComplete(featureId, { ...baseMetadata, ...metadata });
    },
    [tracker, featureId, baseMetadata],
  );

  const trackError = useCallback(
    (error: string | Error, metadata?: Record<string, unknown>) => {
      tracker.trackError(featureId, error, { ...baseMetadata, ...metadata });
    },
    [tracker, featureId, baseMetadata],
  );

  return {
    track,
    trackInteract,
    trackComplete,
    trackError,
    tracker,
  };
}
