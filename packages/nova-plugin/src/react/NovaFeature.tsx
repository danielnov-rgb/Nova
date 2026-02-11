'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import { useNova } from './NovaProvider';

export interface NovaFeatureProps {
  /**
   * The feature ID to track
   */
  featureId: string;

  /**
   * Child elements to render
   */
  children: ReactNode;

  /**
   * Track view when component mounts (default: true)
   */
  trackView?: boolean;

  /**
   * Track view when component becomes visible in viewport
   */
  trackOnVisible?: boolean;

  /**
   * Additional metadata to include with view event
   */
  metadata?: Record<string, unknown>;

  /**
   * Additional props to pass to wrapper element
   */
  className?: string;
}

/**
 * Wrapper component that automatically tracks feature views
 *
 * @example
 * ```tsx
 * <NovaFeature featureId="pricing-table">
 *   <PricingTable />
 * </NovaFeature>
 *
 * // Track when visible in viewport
 * <NovaFeature featureId="hero-section" trackOnVisible>
 *   <HeroSection />
 * </NovaFeature>
 * ```
 */
export function NovaFeature({
  featureId,
  children,
  trackView = true,
  trackOnVisible = false,
  metadata,
  className,
}: NovaFeatureProps): React.ReactElement {
  const tracker = useNova();
  const ref = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  // Track on mount
  useEffect(() => {
    if (trackView && !trackOnVisible && !hasTrackedView.current) {
      hasTrackedView.current = true;
      tracker.trackView(featureId, metadata);
    }
  }, [featureId, trackView, trackOnVisible, tracker, metadata]);

  // Track on visibility
  useEffect(() => {
    if (!trackOnVisible || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            tracker.trackView(featureId, metadata);
          }
        });
      },
      { threshold: 0.5 }, // Track when 50% visible
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [featureId, trackOnVisible, tracker, metadata]);

  return (
    <div ref={ref} className={className} data-nova-feature={featureId}>
      {children}
    </div>
  );
}
