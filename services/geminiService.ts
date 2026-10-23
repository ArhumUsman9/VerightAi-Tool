import { ForensicReport, Verdict } from '../types';

/**
 * Executes real forensic analysis on the server via /api/forensics/analyze
 */
export const analyzeMediaOnServer = async (
  input: string | string[],
  fileName: string,
  mediaType: string = 'IMAGE'
): Promise<ForensicReport> => {
  const response = await fetch('/api/forensics/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input,
      fileName,
      mediaType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Server analysis failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as ForensicReport;
};

/**
 * Backward compatibility alias
 */
export const analyzeImageWithGemini = async (
  input: string | string[],
  mediaType: string = 'IMAGE'
): Promise<ForensicReport> => {
  return analyzeMediaOnServer(input, 'investigation_artifact.jpg', mediaType);
};

/**
 * Streams forensic analysis narrative from server SSE route
 */
export const streamForensicAnalysis = async (
  input: string | string[],
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const response = await fetch('/api/forensics/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, prompt }),
  });

  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') return;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) onChunk(parsed.text);
        } catch (_) {}
      }
    }
  }
};

/**
 * Connects to the server-side Gemini Live API WebSocket endpoint
 */
export const connectForensicLiveSession = (callbacks: {
  onAudio?: (base64Audio: string) => void;
  onInterrupted?: () => void;
  onError?: (err: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
}): { ws: WebSocket; sendAudio: (base64Pcm: string) => void; close: () => void } => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/live`);

  ws.onopen = () => {
    callbacks.onOpen?.();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.audio && callbacks.onAudio) {
        callbacks.onAudio(data.audio);
      }
      if (data.interrupted && callbacks.onInterrupted) {
        callbacks.onInterrupted();
      }
      if (data.error && callbacks.onError) {
        callbacks.onError(data.error);
      }
    } catch (e) {
      console.error('Failed to parse Live WS message:', e);
    }
  };

  ws.onerror = (e) => {
    callbacks.onError?.(e);
  };

  ws.onclose = () => {
    callbacks.onClose?.();
  };

  return {
    ws,
    sendAudio: (base64Pcm: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ audio: base64Pcm }));
      }
    },
    close: () => {
      ws.close();
    }
  };
};

/**
 * Sends an interactive cross-examination question to Gemma 4
 */
export const crossExamineForensicEvidence = async (params: {
  query: string;
  caseId: string;
  verdict: Verdict;
  authenticityScore: number;
  domainAnalysis: any;
  findings: string[];
  metadata?: any;
}): Promise<{ answer: string; model: string; isLive: boolean; timestamp: string }> => {
  const response = await fetch('/api/gemma/inquest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${response.status}`);
  }

  return response.json();
};

/**
 * Retrieves AI model & detector metadata from the server
 */
export const fetchModelMetadata = async () => {
  const response = await fetch('/api/model-info');
  if (!response.ok) {
    throw new Error('Failed to retrieve model info');
  }
  return response.json();
};

/**
 * Retrieves Agent Skills from the server
 */
export const fetchAgentSkills = async () => {
  const response = await fetch('/api/skills');
  if (!response.ok) {
    throw new Error('Failed to retrieve agent skills');
  }
  return response.json();
};

/**
 * Validates a custom Agent Skill definition
 */
export const validateCustomSkill = async (content: string) => {
  const response = await fetch('/api/skills/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
};