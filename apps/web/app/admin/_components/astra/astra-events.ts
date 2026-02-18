"use client";

import { useEffect } from "react";

export const ASTRA_ACTION_EVENT = "astra:action";

export interface AstraAction {
  type: string;
  payload: Record<string, unknown>;
}

export function dispatchAstraAction(action: AstraAction) {
  window.dispatchEvent(
    new CustomEvent(ASTRA_ACTION_EVENT, { detail: action })
  );
}

export function useAstraActions(handler: (action: AstraAction) => void) {
  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<AstraAction>;
      handler(customEvent.detail);
    };
    window.addEventListener(ASTRA_ACTION_EVENT, listener);
    return () => window.removeEventListener(ASTRA_ACTION_EVENT, listener);
  }, [handler]);
}
