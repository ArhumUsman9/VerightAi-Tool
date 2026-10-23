import React from 'react';
import { HeartHandshake, Shield, Lock, FileText, CheckCircle, ExternalLink, AlertTriangle, Phone, HelpCircle } from 'lucide-react';

export const VictimSafetyView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#263449]">
        <div className="flex items-center space-x-2 text-[#18A999] text-xs font-mono uppercase tracking-wider mb-2">
          <HeartHandshake className="h-4 w-4" />
          <span>Survivor Protection & Privacy Protocol</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
          Privacy Safeguards & Women's Digital Safety
        </h2>
        <p className="text-xs text-[#94A3B8] max-w-3xl mt-1.5 leading-relaxed">
          Verisight Shield is engineered with trauma-informed privacy principles to safeguard individuals targeted by non-consensual synthetic imagery (deepfakes), sextortion, and malicious digital impersonation.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#172438] p-5 rounded-lg border border-[#263449] space-y-2">
          <div className="w-8 h-8 rounded bg-[#20B486]/10 border border-[#20B486]/30 flex items-center justify-center mb-3">
            <Lock className="h-4 w-4 text-[#20B486]" />
          </div>
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Zero Persistent Storage</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Uploaded evidence is analyzed strictly in transient memory. Raw pixels, frames, and audio streams are never saved to local disks, cloud buckets, or databases.
          </p>
        </div>

        <div className="bg-[#172438] p-5 rounded-lg border border-[#263449] space-y-2">
          <div className="w-8 h-8 rounded bg-[#18A999]/10 border border-[#18A999]/30 flex items-center justify-center mb-3">
            <Shield className="h-4 w-4 text-[#18A999]" />
          </div>
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Local Sandbox Inference</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Neural classification and metadata extraction execute in the controlled application environment, preventing transmission of sensitive media to external third parties.
          </p>
        </div>

        <div className="bg-[#172438] p-5 rounded-lg border border-[#263449] space-y-2">
          <div className="w-8 h-8 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center mb-3">
            <FileText className="h-4 w-4 text-[#3B82F6]" />
          </div>
          <h3 className="text-sm font-semibold text-[#F1F5F9]">PII & GPS Redaction</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Exported forensic reports automatically sanitize personal phone numbers, geographic coordinates, and sensitive EXIF fields before courtroom or public presentation.
          </p>
        </div>
      </div>

      {/* Actionable Step-by-Step Response Guide */}
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] pb-3 border-b border-[#263449]">
          Emergency Action Plan for Non-Consensual Imagery & Extortion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#94A3B8]">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">01</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Preserve Original File Hashes First</h4>
                <p className="leading-relaxed">
                  Do not delete the original file or rename it. Generate its SHA-256 cryptographic hash using Verisight Shield to establish unbroken chain of custody for legal authorities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">02</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Document Contextual Metadata</h4>
                <p className="leading-relaxed">
                  Capture full-screen uncropped screenshots showing sender phone numbers, handles, platform URLs, and direct message timestamps. Keep original message threads unblocked until logged.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">03</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Do Not Negotiate with Extortionists</h4>
                <p className="leading-relaxed">
                  Financial or sexual extortion demands escalate when paid. Cut communication once evidence has been logged and immediately report to trusted cybercrime reporting hotlines.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">04</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Hash Submission to StopNCII.org</h4>
                <p className="leading-relaxed">
                  Submit cryptographic perceptual hashes (pHashes) directly from your device to StopNCII.org (adults) or TakeItDown.ncmec.org (under 18) to prevent sharing across Meta, TikTok, OnlyFans, and Reddit without uploading the actual image.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">05</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Legal Action under FRE 901 & Daubert</h4>
                <p className="leading-relaxed">
                  Download the official Verisight Shield Forensic Report. The document includes technical neural probability, Fourier spectral lattice residuals, and verifiable Daubert standards accepted by cyber courts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="font-mono text-sm font-bold text-[#18A999] shrink-0">06</span>
              <div>
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Seek Trauma & Legal Support</h4>
                <p className="leading-relaxed">
                  Reach out to recognized digital rights foundations and helplines for trauma counseling and legal representation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recognized Helplines & Reporting Channels */}
      <div className="bg-[#172438] rounded-lg border border-[#263449] p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] pb-3 border-b border-[#263449]">
          Authorized Cybercrime & Crisis Hotlines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="text-xs font-semibold text-[#F1F5F9] block">StopNCII.org</span>
            <p className="text-[11px] text-[#94A3B8]">
              Cross-platform hash-based prevention against non-consensual intimate image distribution for adults.
            </p>
            <a
              href="https://stopncii.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-[#18A999] hover:underline pt-1"
            >
              <span>Visit Portal</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>

          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="text-xs font-semibold text-[#F1F5F9] block">Take It Down (NCMEC)</span>
            <p className="text-[11px] text-[#94A3B8]">
              Confidential tool designed to help remove explicit images taken of individuals under 18 from the internet.
            </p>
            <a
              href="https://takeitdown.ncmec.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-[#18A999] hover:underline pt-1"
            >
              <span>Visit Portal</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>

          <div className="bg-[#111C2E] p-4 rounded border border-[#263449] space-y-2">
            <span className="text-xs font-semibold text-[#F1F5F9] block">FIA Cybercrime Helpline</span>
            <p className="text-[11px] text-[#94A3B8]">
              National Cyber Crime Investigation Agency (Helpline 1991 / Digital Rights Foundation Helpline: 0800-39999).
            </p>
            <span className="text-xs font-mono text-[#20B486] block pt-1">
              Dial 1991 (Toll-Free)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
