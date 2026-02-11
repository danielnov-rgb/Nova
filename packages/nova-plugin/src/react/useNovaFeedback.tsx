'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type FeedbackTriggerMode = 'floating' | 'overlay' | 'contextual';

export interface FeedbackTriggerOptions {
  featureId?: string;
  prompt?: string;
  placeholder?: string;
  /** For contextual mode - the element near which to show the button */
  anchorElement?: HTMLElement | null;
  /** For contextual mode - auto-dismiss after this many ms (default 5000) */
  autoDismissMs?: number;
}

interface FeedbackState {
  isOpen: boolean;
  mode: FeedbackTriggerMode;
  options: FeedbackTriggerOptions;
  anchorPosition?: { top: number; left: number };
}

interface NovaFeedbackContextValue {
  /** Trigger feedback in floating button mode (button appears, flashes) */
  triggerFloating: (options?: FeedbackTriggerOptions) => void;
  /** Trigger feedback in overlay mode (modal opens directly) */
  triggerOverlay: (options?: FeedbackTriggerOptions) => void;
  /** Trigger feedback in contextual mode (button near element) */
  triggerContextual: (options: FeedbackTriggerOptions & { anchorElement: HTMLElement }) => void;
  /** Close the feedback UI */
  close: () => void;
  /** Current feedback state */
  state: FeedbackState;
}

const NovaFeedbackContext = createContext<NovaFeedbackContextValue | null>(null);

export function useNovaFeedback(): NovaFeedbackContextValue {
  const context = useContext(NovaFeedbackContext);
  if (!context) {
    throw new Error('useNovaFeedback must be used within a NovaFeedbackProvider');
  }
  return context;
}

interface NovaFeedbackProviderProps {
  children: React.ReactNode;
  defaultPrompt?: string;
  defaultPlaceholder?: string;
  onSubmit?: (feedback: { rating?: number; comment: string; featureId?: string; mode: FeedbackTriggerMode }) => void;
}

export function NovaFeedbackProvider({
  children,
  defaultPrompt = 'How can we improve your experience?',
  defaultPlaceholder = 'Share your thoughts...',
  onSubmit,
}: NovaFeedbackProviderProps): React.ReactElement {
  const [state, setState] = useState<FeedbackState>({
    isOpen: false,
    mode: 'floating',
    options: {},
  });

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [flashFloating, setFlashFloating] = useState(false);
  const [showContextualButton, setShowContextualButton] = useState(false);
  const [flashContextual, setFlashContextual] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contextualTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    setShowFloatingButton(false);
    setShowContextualButton(false);
    setRating(null);
    setComment('');
    setSubmitted(false);
    if (contextualTimeoutRef.current) {
      clearTimeout(contextualTimeoutRef.current);
    }
  }, []);

  const triggerFloating = useCallback((options: FeedbackTriggerOptions = {}) => {
    setState({
      isOpen: false,
      mode: 'floating',
      options,
    });
    setShowFloatingButton(true);
    setFlashFloating(true);
    // Extended flash duration for dramatic entrance (2 seconds)
    setTimeout(() => setFlashFloating(false), 2000);
  }, []);

  const triggerOverlay = useCallback((options: FeedbackTriggerOptions = {}) => {
    setState({
      isOpen: true,
      mode: 'overlay',
      options,
    });
  }, []);

  const triggerContextual = useCallback((options: FeedbackTriggerOptions & { anchorElement: HTMLElement }) => {
    const rect = options.anchorElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    setState({
      isOpen: false,
      mode: 'contextual',
      options,
      anchorPosition: {
        top: rect.bottom + scrollTop + 8,
        left: rect.left + scrollLeft + rect.width / 2,
      },
    });
    setShowContextualButton(true);
    setFlashContextual(true);
    setTimeout(() => setFlashContextual(false), 600);

    // Auto-dismiss
    if (contextualTimeoutRef.current) {
      clearTimeout(contextualTimeoutRef.current);
    }
    contextualTimeoutRef.current = setTimeout(() => {
      setShowContextualButton(false);
    }, options.autoDismissMs || 5000);
  }, []);

  const openModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
    setShowContextualButton(false);
    if (contextualTimeoutRef.current) {
      clearTimeout(contextualTimeoutRef.current);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!comment.trim() && rating === null) return;

    setIsSubmitting(true);

    if (onSubmit) {
      onSubmit({
        rating: rating ?? undefined,
        comment,
        featureId: state.options.featureId,
        mode: state.mode,
      });
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      close();
    }, 2000);
  }, [comment, rating, state.options.featureId, state.mode, onSubmit, close]);

  const prompt = state.options.prompt || defaultPrompt;
  const placeholder = state.options.placeholder || defaultPlaceholder;

  return (
    <NovaFeedbackContext.Provider value={{ triggerFloating, triggerOverlay, triggerContextual, close, state }}>
      {children}

      {/* Floating Button (Mode 1) */}
      {showFloatingButton && !state.isOpen && (
        <button
          onClick={openModal}
          style={{
            position: 'fixed',
            right: '24px',
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
            boxShadow: flashFloating
              ? '0 0 80px rgba(14, 165, 233, 1), 0 0 150px rgba(14, 165, 233, 0.8), 0 0 200px rgba(56, 189, 248, 0.6)'
              : '0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2)',
            transition: 'transform 0.2s, box-shadow 0.3s',
            animation: flashFloating ? 'nova-entrance-flash 2s ease-out' : undefined,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Give feedback"
        >
          {/* Explosive entrance waves - only show during flash */}
          {flashFloating && (
            <>
              <span
                style={{
                  position: 'absolute',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid rgba(14, 165, 233, 0.8)',
                  animation: 'nova-explode-wave 1.5s ease-out forwards',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid rgba(56, 189, 248, 0.7)',
                  animation: 'nova-explode-wave 1.5s ease-out 0.2s forwards',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid rgba(125, 211, 252, 0.6)',
                  animation: 'nova-explode-wave 1.5s ease-out 0.4s forwards',
                }}
              />
            </>
          )}
          {/* Regular pulsing rings (after entrance) */}
          {!flashFloating && (
            <>
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
            </>
          )}
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
      )}

      {/* Contextual Button (Mode 3) */}
      {showContextualButton && state.anchorPosition && !state.isOpen && (
        <button
          onClick={openModal}
          style={{
            position: 'absolute',
            top: `${state.anchorPosition.top}px`,
            left: `${state.anchorPosition.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9998,
            padding: '8px 16px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: flashContextual
              ? '0 0 30px rgba(14, 165, 233, 0.9), 0 0 60px rgba(14, 165, 233, 0.6)'
              : '0 4px 20px rgba(14, 165, 233, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.3s, opacity 0.3s',
            animation: flashContextual ? 'nova-flash-bright 0.6s ease-out' : 'nova-fade-in 0.3s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          }}
          aria-label="Give feedback"
        >
          {/* N Logo */}
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 50%, #0369a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            N
          </span>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>
            Share feedback
          </span>
        </button>
      )}

      {/* Modal Overlay (All modes) */}
      {state.isOpen && (
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
          onClick={close}
        >
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
              animation: 'nova-modal-in 0.2s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
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
                    onClick={close}
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
        @keyframes nova-entrance-flash {
          0% {
            transform: scale(0.5);
            box-shadow: 0 0 100px rgba(14, 165, 233, 1), 0 0 200px rgba(14, 165, 233, 0.9), 0 0 300px rgba(56, 189, 248, 0.7);
          }
          15% {
            transform: scale(1.2);
            box-shadow: 0 0 120px rgba(14, 165, 233, 1), 0 0 250px rgba(14, 165, 233, 0.85), 0 0 350px rgba(56, 189, 248, 0.6);
          }
          30% {
            transform: scale(1);
            box-shadow: 0 0 100px rgba(14, 165, 233, 0.9), 0 0 200px rgba(14, 165, 233, 0.7), 0 0 280px rgba(56, 189, 248, 0.5);
          }
          50% {
            box-shadow: 0 0 80px rgba(14, 165, 233, 0.7), 0 0 150px rgba(14, 165, 233, 0.5), 0 0 200px rgba(56, 189, 248, 0.3);
          }
          100% {
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2);
          }
        }
        @keyframes nova-explode-wave {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 30px rgba(14, 165, 233, 0.8);
          }
          100% {
            transform: scale(6);
            opacity: 0;
            box-shadow: 0 0 60px rgba(14, 165, 233, 0);
          }
        }
        @keyframes nova-flash-bright {
          0% {
            box-shadow: 0 0 60px rgba(14, 165, 233, 1), 0 0 120px rgba(14, 165, 233, 0.8);
          }
          100% {
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.2);
          }
        }
        @keyframes nova-fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes nova-modal-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </NovaFeedbackContext.Provider>
  );
}
