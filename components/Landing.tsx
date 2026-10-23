import React, { useState } from 'react';
import { ArrowRight, Shield, Fingerprint, Eye, Database, Lock, Cpu, Sparkles } from 'lucide-react';
import { LiveApiModal } from './LiveApiModal';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [showLiveModal, setShowLiveModal] = useState(false);

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-64px)] flex flex-col justify-center bg-[#0B1220]">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#172438] border border-[#263449] rounded-full px-3.5 py-1 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#18A999] animate-pulse"></span>
          <span className="text-[11px] font-mono text-[#18A999] tracking-wide uppercase">
            Forensic Engine Operational // Open-Weight ONNX + Gemma 4
          </span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F1F5F9] mb-6 leading-tight">
          Trust Nothing.<br />
          <span className="text-[#18A999]">Verify Everything with Evidence.</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-base text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed">
          The enterprise standard for digital image forensics and AI-generated media detection. Verisight Shield evaluates raw pixel tensors, container metadata, and C2PA provenance without fabricated scores or misleading claims.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3 bg-[#18A999] hover:bg-[#18A999]/90 text-white rounded font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Launch Analysis Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowLiveModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#172438] hover:bg-[#111C2E] text-[#F1F5F9] border border-[#263449] rounded font-medium text-sm transition-all"
          >
            Live Gemini API Inquest
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-[#111C2E] border-t border-[#263449]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#172438] border border-[#263449] space-y-3">
              <div className="w-10 h-10 rounded bg-[#111C2E] border border-[#263449] flex items-center justify-center text-[#18A999]">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Open-Weight Neural Tensor Inference</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Real pixel inference using <code>onnx-community/ai-image-detect-distilled-ONNX</code> to detect subtle generative diffusion distributions.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-[#172438] border border-[#263449] space-y-3">
              <div className="w-10 h-10 rounded bg-[#111C2E] border border-[#263449] flex items-center justify-center text-[#3B82F6]">
                <Fingerprint className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Container & C2PA Provenance</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Full EXIF, XMP, and JUMBF claim validation identifying software generator tags, missing Bayer sensor EXIF, and signed certificates.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-[#172438] border border-[#263449] space-y-3">
              <div className="w-10 h-10 rounded bg-[#111C2E] border border-[#263449] flex items-center justify-center text-[#20B486]">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Zero-Storage Survivor Safety</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Strict in-memory processing protecting individuals facing image-based abuse, with instant SHA-256 evidence hashing and StopNCII guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live API Modal */}
      <LiveApiModal isOpen={showLiveModal} onClose={() => setShowLiveModal(false)} />
    </div>
  );
};
