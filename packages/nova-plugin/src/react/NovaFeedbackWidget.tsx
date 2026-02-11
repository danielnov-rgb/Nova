'use client';

import React, { useState, useEffect } from 'react';
import { useNova } from './NovaProvider';

export interface NovaFeedbackWidgetProps {
  /**
   * Position of the widget on screen
   */
  position?: 'bottom-right' | 'bottom-left';

  /**
   * Feature ID to associate feedback with (optional)
   */
  featureId?: string;

  /**
   * Custom prompt for the feedback modal
   */
  prompt?: string;

  /**
   * Placeholder text for feedback input
   */
  placeholder?: string;

  /**
   * Called when feedback is submitted
   */
  onSubmit?: (feedback: { rating?: number; comment: string; featureId?: string }) => void;
}

/**
 * Nova Feedback Widget - Floating button that opens a feedback modal
 *
 * @example
 * ```tsx
 * <NovaFeedbackWidget
 *   featureId="checkout-flow"
 *   prompt="How was your checkout experience?"
 * />
 * ```
 */
export function NovaFeedbackWidget({
  position = 'bottom-right',
  featureId,
  prompt = 'How can we improve your experience?',
  placeholder = 'Share your thoughts...',
  onSubmit,
}: NovaFeedbackWidgetProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const tracker = useNova();

  // Track widget view when it mounts
  useEffect(() => {
    tracker.track('nova-feedback-widget', 'view', { featureId });
  }, [tracker, featureId]);

  const handleOpen = () => {
    setIsOpen(true);
    tracker.track('nova-feedback-widget', 'open', { featureId });
  };

  const handleClose = () => {
    setIsOpen(false);
    setRating(null);
    setComment('');
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim() && rating === null) return;

    setIsSubmitting(true);

    // Track the feedback submission
    tracker.track('nova-feedback-widget', 'submit', {
      featureId,
      rating,
      hasComment: !!comment.trim(),
    });

    // Call custom handler if provided
    if (onSubmit) {
      onSubmit({ rating: rating ?? undefined, comment, featureId });
    }

    setIsSubmitting(false);
    setSubmitted(true);

    // Auto-close after showing success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const positionClasses = position === 'bottom-right'
    ? 'right-6 bottom-6'
    : 'left-6 bottom-6';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="nova-feedback-button"
        style={{
          position: 'fixed',
          [position === 'bottom-right' ? 'right' : 'left']: '24px',
          bottom: '24px',
          zIndex: 9998,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(14, 165, 233, 0.5), 0 0 60px rgba(14, 165, 233, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)';
        }}
        aria-label="Give feedback"
      >
        {/* Pulsing ring */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(14, 165, 233, 0.5)',
            animation: 'nova-pulse 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            animation: 'nova-pulse 2s ease-in-out 0.5s infinite',
          }}
        />

        {/* N Logo */}
        <span
          style={{
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 50%, #0369a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          N
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            style={{
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              margin: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(14, 165, 233, 0.15)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                  Thank you!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
                  Your feedback helps us improve.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 50%, #0369a1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      N
                    </span>
                    <span style={{ color: 'white', fontWeight: 600 }}>Feedback</span>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Prompt */}
                <p style={{ color: '#e2e8f0', fontSize: '15px', marginBottom: '16px' }}>{prompt}</p>

                {/* Rating */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>How would you rate your experience?</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transition: 'transform 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill={rating && star <= rating ? '#0ea5e9' : 'none'}
                          stroke={rating && star <= rating ? '#0ea5e9' : '#64748b'}
                          strokeWidth="1.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!comment.trim() && rating === null)}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSubmitting || (!comment.trim() && rating === null) ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || (!comment.trim() && rating === null) ? 0.5 : 1,
                    transition: 'opacity 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && (comment.trim() || rating !== null)) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {/* Powered by Nova */}
                <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', marginTop: '16px' }}>
                  Powered by Nova
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes nova-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
}
