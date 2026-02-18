"use client";

import { useState, useCallback, useRef } from "react";
import { getToken } from "../../_lib/auth";
import { dispatchAstraAction } from "./astra-events";
import type { AstraMessage, AstraPageContext, AstraSSEEvent } from "./astra-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function useAstraChat(pageContext: AstraPageContext) {
  const [messages, setMessages] = useState<AstraMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming || !content.trim()) return;

    // Add user message
    const userMsg: AstraMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: AstraMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      toolCalls: [],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: content.trim(),
          sessionId: sessionIdRef.current,
          pageContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const event: AstraSSEEvent = JSON.parse(data);

            switch (event.type) {
              case "session":
                sessionIdRef.current = event.sessionId!;
                break;

              case "text_delta":
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: m.content + event.text }
                      : m
                  )
                );
                break;

              case "tool_use":
                dispatchAstraAction({
                  type: event.toolName!,
                  payload: event.toolInput!,
                });
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? {
                          ...m,
                          toolCalls: [
                            ...(m.toolCalls || []),
                            {
                              toolName: event.toolName!,
                              toolInput: event.toolInput!,
                              toolUseId: event.toolUseId!,
                            },
                          ],
                        }
                      : m
                  )
                );
                break;

              case "error":
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: m.content || `Error: ${event.error}` }
                      : m
                  )
                );
                break;
            }
          } catch {
            // Skip malformed SSE events
          }
        }
      }
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't connect. Please check the API server is running." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, pageContext]);

  const clearChat = useCallback(() => {
    setMessages([]);
    sessionIdRef.current = null;
  }, []);

  return { messages, isStreaming, sendMessage, clearChat };
}
