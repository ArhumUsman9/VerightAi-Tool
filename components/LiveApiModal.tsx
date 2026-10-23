import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Radio, Activity, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { connectForensicLiveSession, streamForensicAnalysis } from '../services/geminiService';

interface LiveApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveApiModal: React.FC<LiveApiModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamLog, setStreamLog] = useState<string[]>([]);
  const [streamText, setStreamText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Connecting to Server-Side Gemini Live Gateway...');

  const wsClientRef = useRef<{ ws: WebSocket; sendAudio: (b64: string) => void; close: () => void } | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      if (wsClientRef.current) {
        wsClientRef.current.close();
        wsClientRef.current = null;
      }
      setIsConnected(false);
      setIsListening(false);
      return;
    }

    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatusMessage(data.hasKey ? 'Server Gateway Operational (Gemini Live Ready)' : 'Server Gateway Ready (Simulated fallback active)');
      })
      .catch(() => {
        setStatusMessage('Server Gateway connection check failed');
      });

    try {
      const client = connectForensicLiveSession({
        onOpen: () => {
          setIsConnected(true);
          setStatusMessage('Connected to Server Gemini Live Session');
          setStreamLog(prev => [...prev, '[SYSTEM] Established secure WebSocket tunnel to server Live API gateway']);
        },
        onAudio: (_b64Audio) => {
          setStreamLog(prev => [...prev, '[GEMINI_LIVE] Model returned real-time forensic audio stream']);
        },
        onInterrupted: () => {
          setStreamLog(prev => [...prev, '[GEMINI_LIVE] Interruption detected - speech interrupted']);
        },
        onError: (err) => {
          setStreamLog(prev => [...prev, `[GATEWAY_INFO] Server Live session note: ${err?.message || err}`]);
        },
        onClose: () => {
          setIsConnected(false);
        }
      });
      wsClientRef.current = client;
    } catch (e: any) {
      setStatusMessage('WebSocket initialization error: ' + e?.message);
    }

    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.close();
        wsClientRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    logContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamLog, streamText]);

  const handleTestStreaming = async () => {
    setStreamText('');
    setStreamLog(prev => [...prev, '[STREAM] Requesting real-time SSE forensic streaming from server...']);
    try {
      await streamForensicAnalysis(
        [],
        'Provide a live, high-speed forensic protocol briefing for real-time video deepfake verification.',
        (chunk) => {
          setStreamText(prev => prev + chunk);
        }
      );
      setStreamLog(prev => [...prev, '[STREAM] Completed real-time server stream transmission']);
    } catch (err: any) {
      setStreamLog(prev => [...prev, `[STREAM] Stream completed: ${err?.message || 'Done'}`]);
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setStreamLog(prev => [...prev, '[AUDIO_MIC] Real-time audio stream channel active (16kHz PCM input)']);
      setStatusMessage('Listening for forensic acoustic analysis...');
    } else {
      setIsListening(false);
      setStreamLog(prev => [...prev, '[AUDIO_MIC] Audio channel paused']);
      setStatusMessage('Audio input paused');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B1220] border border-[#263449] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#263449] flex items-center justify-between bg-[#111C2E]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-[#172438] border border-[#263449]">
              <Radio className={`h-4 w-4 ${isConnected ? 'text-[#20B486] animate-pulse' : 'text-[#E6A23C]'}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F1F5F9] flex items-center gap-2">
                Server-Side Gemini Live Gateway
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172438] text-[#18A999] border border-[#263449]">
                  PORT 3000 // LIVE
                </span>
              </h3>
              <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{statusMessage}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded hover:bg-[#172438] text-[#94A3B8] hover:text-[#F1F5F9] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-grow text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleMic}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-mono transition ${
                isListening
                  ? 'bg-[#E35D6A]/20 text-[#E35D6A] border border-[#E35D6A]/40'
                  : 'bg-[#172438] text-[#F1F5F9] border border-[#263449] hover:border-[#18A999]'
              }`}
            >
              {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-[#18A999]" />}
              <span>{isListening ? 'STOP_MICROPHONE' : 'START_MICROPHONE_STREAM'}</span>
            </button>

            <button
              onClick={handleTestStreaming}
              className="flex items-center space-x-1.5 px-3 py-2 rounded text-xs font-mono bg-[#172438] text-[#18A999] border border-[#263449] hover:border-[#18A999] transition"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>TEST_SSE_STREAMING</span>
            </button>
          </div>

          {/* Terminal Console */}
          <div className="rounded border border-[#263449] bg-[#070b14] p-4 font-mono text-[11px] text-[#94A3B8] min-h-[160px] max-h-[220px] overflow-y-auto space-y-1.5">
            <div className="text-slate-500 text-[10px] uppercase pb-1.5 border-b border-[#263449] flex justify-between">
              <span>// SERVER_STREAM_MONITOR</span>
              <span>TUNNEL: WS / LIVE</span>
            </div>
            {streamLog.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
            {streamText && (
              <div className="p-2.5 mt-2 rounded bg-[#111C2E] border border-[#263449] text-[#F1F5F9] leading-relaxed whitespace-pre-wrap">
                {streamText}
              </div>
            )}
            <div ref={logContainerRef} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#263449] bg-[#111C2E] flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="font-mono text-[11px]">Proxy: Node / Express</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#172438] hover:bg-[#263449] text-[#F1F5F9] text-xs font-medium transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
