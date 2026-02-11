/**
 * Nova Plugin - React Integration
 *
 * @example
 * ```tsx
 * import { NovaProvider, useNova } from '@nova/plugin/react';
 *
 * function App() {
 *   return (
 *     <NovaProvider apiKey="nova_your_api_key">
 *       <MyApp />
 *     </NovaProvider>
 *   );
 * }
 *
 * function CheckoutForm() {
 *   const nova = useNova();
 *
 *   useEffect(() => {
 *     nova.trackView('checkout-form');
 *   }, []);
 *
 *   const handleSubmit = () => {
 *     nova.trackComplete('checkout-form');
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */

export { NovaProvider, useNova, NovaContext } from './NovaProvider';
export { useNovaTracker } from './useNovaTracker';
export { NovaFeature } from './NovaFeature';
export { NovaFeedbackWidget } from './NovaFeedbackWidget';
export { NovaFeedbackProvider, useNovaFeedback } from './useNovaFeedback';
export type { FeedbackTriggerMode, FeedbackTriggerOptions } from './useNovaFeedback';
