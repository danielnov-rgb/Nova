/**
 * Nova Plugin - Analytics tracking for Nova
 *
 * @example
 * ```ts
 * import { createNovaTracker } from '@nova/plugin';
 *
 * const tracker = createNovaTracker({
 *   apiKey: 'nova_your_api_key_here',
 * });
 *
 * // Track feature views
 * tracker.trackView('checkout-form');
 *
 * // Track interactions
 * tracker.trackInteract('checkout-form', 'click-submit');
 *
 * // Track completions
 * tracker.trackComplete('checkout-form', { orderTotal: 99.99 });
 *
 * // Track custom events
 * tracker.track('checkout-form', 'promo-applied', { code: 'SAVE20' });
 * ```
 */

export { NovaTracker, createNovaTracker } from './tracker';
export type {
  NovaTrackerConfig,
  NovaEvent,
  EventType,
  TrackerInstance,
} from './types';
