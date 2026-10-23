import React from 'react';
import { Cpu, Layers, Database, Code, Zap, Shield, FileCheck } from 'lucide-react';

export const Technology: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="pb-6 border-b border-[#263449]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#18A999] uppercase tracking-wider mb-2">
          <Cpu className="h-4 w-4" />
          <span>Forensic Architecture & Methodology</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
          Multi-Signal Evidence Fusion Architecture
        </h2>
        <p className="text-xs text-[#94A3B8] max-w-3xl mt-1.5 leading-relaxed">
          Verisight Shield rejects simplistic single-score heuristics. Our forensic pipeline combines raw pixel tensor neural inference, container metadata inspection, frequency-domain lattice audits, and C2PA provenance validation.
        </p>
      </div>

      {/* Layer Pipeline Flow */}
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] pb-3 mb-4 border-b border-[#263449]">
          Four-Tier Evidence Evaluation Engine
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#111C2E] rounded border border-[#263449] space-y-2">
            <span className="text-[10px] font-mono text-[#18A999] block font-bold">TIER 1</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Ingest & Hashing</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              SHA-256 cryptographic chain-of-custody digest calculation in sandboxed memory.
            </p>
          </div>

          <div className="p-4 bg-[#111C2E] rounded border border-[#263449] space-y-2">
            <span className="text-[10px] font-mono text-[#3B82F6] block font-bold">TIER 2</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Metadata & C2PA</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              EXIF, XMP, IPTC parsing with JUMBF C2PA Content Credentials signature validation.
            </p>
          </div>

          <div className="p-4 bg-[#111C2E] rounded border border-[#263449] space-y-2">
            <span className="text-[10px] font-mono text-[#20B486] block font-bold">TIER 3</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Neural & Frequency</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Distilled Vision Transformer tensor inference alongside 2D DCT spectral residual grids.
            </p>
          </div>

          <div className="p-4 bg-[#111C2E] rounded border border-[#263449] space-y-2">
            <span className="text-[10px] font-mono text-[#E6A23C] block font-bold">TIER 4</span>
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Gemma 4 XAI</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Bilingual English & Urdu courtroom-ready reasoning under FRE Rule 901 & Daubert standard.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Technical Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#172438] p-6 rounded-lg border border-[#263449] space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#F1F5F9]">
            <Layers className="h-4 w-4 text-[#18A999]" />
            <span>2D Spectral Residual Lattice Analysis</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Latent diffusion models (SDXL, Midjourney, Flux) rely on periodic deconvolution or pixel-shuffle upsamplers. In frequency domain representations, this generates high-frequency lattice grids that do not exist in optical camera sensors.
          </p>
        </div>

        <div className="bg-[#172438] p-6 rounded-lg border border-[#263449] space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#F1F5F9]">
            <Cpu className="h-4 w-4 text-[#3B82F6]" />
            <span>Dedicated Open-Weight Vision Model</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            We integrate <code>onnx-community/ai-image-detect-distilled-ONNX</code>, a distilled vision transformer trained specifically to differentiate synthetic diffusion distributions from organic photography across 224x224 RGB tensors.
          </p>
        </div>

        <div className="bg-[#172438] p-6 rounded-lg border border-[#263449] space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#F1F5F9]">
            <Shield className="h-4 w-4 text-[#20B486]" />
            <span>Poisson-Gaussian Noise Floor Model</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Authentic optical camera sensors exhibit photon shot noise proportional to the square root of local pixel luminance. Synthetic models produce either smoothed gradients or uniform noise decoupled from light levels.
          </p>
        </div>

        <div className="bg-[#172438] p-6 rounded-lg border border-[#263449] space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#F1F5F9]">
            <FileCheck className="h-4 w-4 text-[#E6A23C]" />
            <span>FRE 901 & Daubert Admissibility</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            In compliance with Federal Rules of Evidence Rule 901 and FRE Rule 702, every finding is accompanied by verifiable mathematical scores, verifiable SHA-256 custody, and an explanation of uncertainty boundaries.
          </p>
        </div>
      </div>
    </div>
  );
};