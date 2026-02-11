'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createNovaTracker, type NovaTrackerConfig, type TrackerInstance } from '../index';

/**
 * Context for Nova tracker
 */
export const NovaContext = createContext<TrackerInstance | null>(null);

export interface NovaProviderProps extends NovaTrackerConfig {
  children: ReactNode;
}

/**
 * Nova Provider - Wrap your app to enable tracking
 *
 * @example
 * ```tsx
 * <NovaProvider apiKey="nova_your_api_key">
 *   <App />
 * </NovaProvider>
 * ```
 */
export function NovaProvider({
  children,
  apiKey,
  ...config
}: NovaProviderProps): React.ReactElement {
  const tracker = useMemo(
    () => createNovaTracker({ apiKey, ...config }),
    [apiKey, config.apiEndpoint, config.disabled],
  );

  return (
    <NovaContext.Provider value={tracker}>
      {children}
    </NovaContext.Provider>
  );
}

/**
 * Hook to access the Nova tracker
 *
 * @throws Error if used outside NovaProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const nova = useNova();
 *   nova.trackView('my-feature');
 * }
 * ```
 */
export function useNova(): TrackerInstance {
  const tracker = useContext(NovaContext);
  if (!tracker) {
    throw new Error('useNova must be used within a NovaProvider');
  }
  return tracker;
}
