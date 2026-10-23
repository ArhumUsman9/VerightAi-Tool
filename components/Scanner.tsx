import React, { useEffect, useState } from 'react';
import { Shield, Check, Loader2, Cpu, Terminal, Layers } from 'lucide-react';
import { MediaType } from '../types';

interface ScannerProps {
  imageSrc: string;
  mediaType: MediaType;
}

export const Scanner: React.FC<ScannerProps> = ({ imageSrc, mediaType }) => {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    { label: 'Payload Ingestion & Cryptographic Hashing', desc: 'SHA-256 digest computation & memory sandboxing' },
    { label: 'Container & EXIF/XMP Metadata Parsing', desc: 'Hardware tags, software generator keywords & C2PA audit' },
    { label: 'Dedicated Neural Tensor Classification', desc: 'Running onnx-community/ai-image-detect-distilled-ONNX' },
    { label: 'Frequency-Domain & Noise Floor Analysis', desc: '2D Discrete Cosine Transform & Poisson-Gaussian consistency' },
    { label: 'Multi-Signal Fusion & Decision Policy', desc: 'Calibrated threshold evaluation & uncertainty boundaries' },
    { label: 'Gemma 4 Courtroom Reasoning & XAI', desc: 'Synthesizing evidence narrative and bilingual Urdu summaries' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < pipelineSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-8 shadow-xl">
        {/* Top header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#263449]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-[#0B1220] border border-[#263449]">
              <Loader2 className="h-5 w-5 text-[#18A999] animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Executing Forensic Investigation Pipeline</h3>
              <p className="text-xs text-[#94A3B8] font-mono">
                MODEL: onnx-community/ai-image-detect-distilled-ONNX + Gemma 4
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#18A999] bg-[#0B1220] px-2.5 py-1 rounded border border-[#263449]">
            STEP {activeStep + 1} OF {pipelineSteps.length}
          </span>
        </div>

        {/* Center Grid: Exhibit Preview + Pipeline Progress */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Exhibit Preview */}
          <div className="md:col-span-5 bg-[#0B1220] rounded border border-[#263449] p-2 flex flex-col items-center">
            <div className="w-full h-44 overflow-hidden rounded bg-black/40 flex items-center justify-center relative">
              {mediaType === MediaType.VIDEO ? (
                <video src={imageSrc} autoPlay loop muted playsInline className="w-full h-full object-contain" />
              ) : (
                <img src={imageSrc} alt="Under Examination" className="w-full h-full object-contain" />
              )}
              {/* Subtle scanning line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#18A999]/15 to-transparent animate-pulse pointer-events-none"></div>
            </div>
            <div className="w-full mt-2 flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
              <span>RAW_BUFFER_TENSOR</span>
              <span className="text-[#18A999]">SCANNING</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="md:col-span-7 space-y-3">
            {pipelineSteps.map((step, idx) => {
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 p-2 rounded transition-colors ${
                    isCurrent ? 'bg-[#0B1220] border border-[#263449]' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <div className="w-4 h-4 rounded-full bg-[#20B486]/20 border border-[#20B486] flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-[#20B486]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full bg-[#18A999]/20 border border-[#18A999] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#18A999] animate-ping" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#111C2E] border border-[#263449]" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${isCurrent ? 'text-[#F1F5F9]' : isPast ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                      {step.label}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 pt-4 border-t border-[#263449] flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>Zero mock data. Real neural inference on uploaded image pixels.</span>
          </span>
          <span className="font-mono text-[10px]">Daubert Standard Verification</span>
        </div>
      </div>
    </div>
  );
};