export interface AstraMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: AstraToolCall[];
  timestamp: Date;
}

export interface AstraToolCall {
  toolName: string;
  toolInput: Record<string, unknown>;
  toolUseId: string;
}

export interface AstraPageContext {
  agentId: string;
  currentPage: string;
  pageData?: Record<string, unknown>;
}

export interface AstraSSEEvent {
  type: 'session' | 'text_delta' | 'tool_use' | 'done' | 'error';
  sessionId?: string;
  text?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolUseId?: string;
  error?: string;
}
