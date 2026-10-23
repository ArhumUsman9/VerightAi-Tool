import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Activity, Lock, Layers, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { fetchModelMetadata } from '../services/geminiService';

interface OverviewDashboardProps {
  onStartScan: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onStartScan }) => {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<string>('ONLINE');

  useEffect(() => {
    fetchModelMetadata()
      .then((data) => setModelInfo(data))
      .catch(() => setHealthStatus('DEGRADED'));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#18A999] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#20B486] animate-pulse"></span>
            <span>ENGINE STATUS: {healthStatus} // v3.2 PRODUCTION</span>
          </div>
          <h2 className="text-xl font-bold text-[#F1F5F9] tracking-tight">
            Verisight Shield Forensic Platform
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-2xl mt-1 leading-relaxed">
            Multi-signal digital image forensics and open-weight AI-generated media detection combining raw pixel tensor inference, container metadata inspection, and explainable courtroom reasoning.
          </p>
        </div>

        <button
          onClick={onStartScan}
          className="px-5 py-2.5 bg-[#18A999] hover:bg-[#18A999]/90 text-white rounded text-xs font-semibold shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <span>Open Analysis Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Model & Architecture Status (Real specifications, no fabricated metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dedicated Neural Classifier */}
        <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#94A3B8]">Neural Tensor Classifier</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/30">
              OPEN WEIGHTS
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#F1F5F9] font-mono">
            {modelInfo?.neuralDetectorModel || 'onnx-community/ai-image-detect-distilled-ONNX'}
          </h3>

          <div className="space-y-1 text-xs text-[#94A3B8]">
            <p><strong className="text-[#F1F5F9]">Architecture:</strong> {modelInfo?.neuralArchitecture || 'Distilled Vision Transformer (ONNX Runtime)'}</p>
            <p><strong className="text-[#F1F5F9]">Inference Domain:</strong> 224x224 RGB Normalized Tensor</p>
            <p><strong className="text-[#F1F5F9]">License:</strong> {modelInfo?.neuralDetectorLicense || 'Apache 2.0 Open Source'}</p>
          </div>
        </div>

        {/* Gemma 4 Courtroom Reasoning Engine */}
        <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#94A3B8]">Reasoning & XAI Model</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
              GEMMA 4
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#F1F5F9] font-mono">
            {modelInfo?.primaryGemmaModel || 'gemma-4-31b-it'}
          </h3>

          <div className="space-y-1 text-xs text-[#94A3B8]">
            <p><strong className="text-[#F1F5F9]">Fallback Engine:</strong> {modelInfo?.fallbackGemmaModel || 'gemma-4-26b-a4b-it'}</p>
            <p><strong className="text-[#F1F5F9]">Linguistic Support:</strong> English & Urdu (اردو خلاصہ)</p>
            <p><strong className="text-[#F1F5F9]">Admissibility Standard:</strong> FRE Rule 901 & Daubert</p>
          </div>
        </div>

        {/* Sandboxed Privacy Architecture */}
        <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#94A3B8]">Privacy & Safety State</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18A999]/10 text-[#18A999] border border-[#18A999]/30">
              ACTIVE
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[#F1F5F9]">
            In-Memory Non-Retention Sandbox
          </h3>

          <div className="space-y-1 text-xs text-[#94A3B8]">
            <p><strong className="text-[#F1F5F9]">Storage Policy:</strong> Zero persistent disk/database storage</p>
            <p><strong className="text-[#F1F5F9]">Cryptographic Hash:</strong> SHA-256 Calculated on Ingest</p>
            <p><strong className="text-[#F1F5F9]">C2PA Provenance:</strong> JUMBF Claim Box Inspector</p>
          </div>
        </div>
      </div>

      {/* Forensic Methodology Cards */}
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] pb-3 border-b border-[#263449]">
          Multi-Signal Detection Pipeline Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="font-mono text-[10px] text-[#18A999] uppercase block font-bold">Signal Vector 01</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Pixel Tensor Inference</h4>
            <p className="text-[#94A3B8] leading-relaxed">
              Real open-weight vision model evaluates raw RGB pixel distribution for latent generative patterns.
            </p>
          </div>

          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="font-mono text-[10px] text-[#3B82F6] uppercase block font-bold">Signal Vector 02</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Container Metadata & EXIF</h4>
            <p className="text-[#94A3B8] leading-relaxed">
              Deep inspection of TIFF, XMP, IPTC, and generative software tags (Midjourney, DALL-E, SD, Firefly).
            </p>
          </div>

          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="font-mono text-[10px] text-[#20B486] uppercase block font-bold">Signal Vector 03</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">C2PA Provenance</h4>
            <p className="text-[#94A3B8] leading-relaxed">
              Verification of cryptographically signed Content Credentials manifests and claim generator chains.
            </p>
          </div>

          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="font-mono text-[10px] text-[#E6A23C] uppercase block font-bold">Signal Vector 04</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Spectral & Noise Residuals</h4>
            <p className="text-[#94A3B8] leading-relaxed">
              2D DCT frequency lattice audit detecting 8x8 diffusion upsampling grids and Poisson-Gaussian noise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
