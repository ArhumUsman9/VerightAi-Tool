import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Code, Plus, AlertCircle, FileText, Sparkles, Terminal } from 'lucide-react';
import { AgentSkillDefinition } from '../types';
import { fetchAgentSkills, validateCustomSkill } from '../services/geminiService';

export const SkillsWorkspace: React.FC = () => {
  const [skills, setSkills] = useState<AgentSkillDefinition[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<AgentSkillDefinition | null>(null);
  const [customSkillContent, setCustomSkillContent] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message?: string; error?: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgentSkills()
      .then((data) => {
        if (data && data.skills) {
          setSkills(data.skills);
          if (data.skills.length > 0) {
            setSelectedSkill(data.skills[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load skills:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleValidateCustom = async () => {
    if (!customSkillContent.trim() || isValidating) return;
    setIsValidating(true);
    setValidationResult(null);

    try {
      const res = await validateCustomSkill(customSkillContent);
      setValidationResult(res);
      if (res.valid) {
        const newSkill: AgentSkillDefinition = {
          id: `custom-${Date.now()}`,
          name: res.name || 'Custom Skill',
          description: res.description || 'Custom forensic rule',
          status: 'CUSTOM',
          version: '1.0.0',
          content: customSkillContent,
        };
        setSkills((prev) => [...prev, newSkill]);
        setSelectedSkill(newSkill);
      }
    } catch (e: any) {
      setValidationResult({ valid: false, error: e?.message || 'Validation request failed' });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="pb-6 mb-6 border-b border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Agent Skills & Forensic Workflows</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Predefined forensic protocols governing triage, metadata extraction, C2PA provenance, and survivor safety.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#18A999] bg-[#172438] px-3 py-1 rounded border border-[#263449]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>4 ACTIVE SKILLS ENFORCED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Skill List & Custom Skill Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-4">
            <span className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider block mb-3">
              Standard Forensic Skills
            </span>

            {isLoading ? (
              <div className="p-4 text-xs text-[#94A3B8] font-mono">Loading skills catalog...</div>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => {
                  const isSelected = selectedSkill?.id === skill.id;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        isSelected
                          ? 'bg-[#111C2E] border-[#18A999] shadow-sm'
                          : 'bg-[#111C2E]/50 border-[#263449] hover:border-[#18A999]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#F1F5F9] font-mono">{skill.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          skill.status === 'CUSTOM' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-[#20B486]/20 text-[#20B486]'
                        }`}>
                          {skill.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                        {skill.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Skill Validator */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
              <span className="text-xs font-semibold text-[#F1F5F9] flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-[#18A999]" />
                Register Custom Agent Skill
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8]">YAML FRONTMATTER</span>
            </div>

            <p className="text-[11px] text-[#94A3B8]">
              Paste a custom <code>SKILL.md</code> definition with frontmatter (<code>name</code>, <code>description</code>) to validate and register:
            </p>

            <textarea
              rows={6}
              value={customSkillContent}
              onChange={(e) => setCustomSkillContent(e.target.value)}
              placeholder={`---
name: custom-deepfake-filter
description: Specialized verification protocol for synthesized video clips.
---
# Custom Protocol
...`}
              className="w-full bg-[#111C2E] border border-[#263449] rounded p-2.5 text-xs text-[#F1F5F9] font-mono placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#18A999]"
            />

            <button
              type="button"
              onClick={handleValidateCustom}
              disabled={isValidating || !customSkillContent.trim()}
              className="w-full py-2 bg-[#18A999] hover:bg-[#18A999]/90 disabled:opacity-50 text-white rounded text-xs font-semibold transition"
            >
              {isValidating ? 'Validating Frontmatter...' : 'Validate & Register Skill'}
            </button>

            {validationResult && (
              <div className={`p-2.5 rounded text-xs border ${
                validationResult.valid
                  ? 'bg-[#20B486]/10 text-[#20B486] border-[#20B486]/30'
                  : 'bg-[#E35D6A]/10 text-[#E35D6A] border-[#E35D6A]/30'
              }`}>
                {validationResult.valid ? validationResult.message : validationResult.error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Skill Viewer & Execution Checklist (7 cols) */}
        <div className="lg:col-span-7">
          {selectedSkill ? (
            <div className="bg-[#172438] rounded-lg border border-[#263449] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
                <div>
                  <h3 className="text-base font-bold text-[#F1F5F9] font-mono">
                    /skills/{selectedSkill.id}/SKILL.md
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{selectedSkill.description}</p>
                </div>
                <span className="text-xs font-mono text-[#18A999] bg-[#111C2E] px-2.5 py-1 rounded border border-[#263449]">
                  v{selectedSkill.version}
                </span>
              </div>

              {/* Raw / Formatted Content */}
              <div className="p-4 bg-[#0B1220] rounded border border-[#263449] text-xs font-mono text-[#F1F5F9] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {selectedSkill.content || 'No content loaded for this skill.'}
              </div>

              <div className="pt-3 border-t border-[#263449] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Enforced by Gemma 4 Forensic Reasoning Engine</span>
                <span className="text-[#20B486] font-mono flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Skill Active in Pipeline
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-[#172438] rounded-lg border border-[#263449] p-12 text-center text-xs text-[#94A3B8]">
              Select a skill from the directory to inspect its operational instructions.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
