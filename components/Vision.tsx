import React from 'react';
import { Target, Users, Globe, Shield } from 'lucide-react';

export const Vision: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="pb-6 border-b border-[#263449]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#18A999] uppercase tracking-wider mb-2">
          <Target className="h-4 w-4" />
          <span>Mission & Public Interest</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">Our Mission & Principles</h2>
        <p className="text-xs text-[#94A3B8] max-w-3xl mt-1.5 leading-relaxed">
          In an era where visual media can be synthesized in milliseconds, Verisight Shield stands as an evidentiary bridge between raw data and verifiable forensic reality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs text-[#94A3B8] leading-relaxed">
          <p>
            Image-based abuse, deepfake extortion, and malicious visual disinformation represent severe threats to human rights, corporate integrity, and the rule of law.
          </p>
          <p>
            Our objective is not to offer deceptive binary assurances or claims of 100% certainty where mathematics does not support it. Instead, we deliver defensible multi-signal forensic science, verifiable cryptographic chain of custody, and open-weight neural transparency.
          </p>
        </div>

        <div className="bg-[#172438] p-6 rounded-lg border border-[#263449]">
          <blockquote className="text-xs italic text-[#F1F5F9] mb-4 leading-relaxed">
            "Forensics is not about producing a single black-box score. It is about presenting testable, verifiable physical and digital evidence that withstands courtroom scrutiny."
          </blockquote>
          <div className="flex items-center space-x-3 pt-3 border-t border-[#263449]">
            <div className="w-8 h-8 rounded bg-[#111C2E] border border-[#263449] flex items-center justify-center text-[#18A999]">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F1F5F9]">Arhum Usman</div>
              <div className="text-[10px] font-mono text-[#18A999]">Founder & Chief Scientist</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#263449]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] mb-4">Core Sectors Served</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#172438] p-5 rounded border border-[#263449] space-y-2">
            <Globe className="h-4 w-4 text-[#3B82F6]" />
            <h4 className="text-xs font-bold text-[#F1F5F9]">Journalism & Newsrooms</h4>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Pre-publication source material authentication and generative artifact discovery.
            </p>
          </div>

          <div className="bg-[#172438] p-5 rounded border border-[#263449] space-y-2">
            <Users className="h-4 w-4 text-[#18A999]" />
            <h4 className="text-xs font-bold text-[#F1F5F9]">Legal & Civil Rights</h4>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              FRE Rule 901 and Daubert-compliant evidence reports for courtroom admissibility.
            </p>
          </div>

          <div className="bg-[#172438] p-5 rounded border border-[#263449] space-y-2">
            <Target className="h-4 w-4 text-[#20B486]" />
            <h4 className="text-xs font-bold text-[#F1F5F9]">Digital Safety & Advocacy</h4>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Empowering survivors of image-based abuse with hash preservation and reporting tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
