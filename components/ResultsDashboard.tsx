import React, { useState } from 'react';
import { ForensicReport, Verdict, MediaType } from '../types';
import { 
  FileText, AlertTriangle, CheckCircle, HelpCircle, Layers, Cpu, Eye, Zap, 
  Send, Sparkles, Scale, Hash, Shield, Info, Languages, AlertCircle, RefreshCw, ZoomIn
} from 'lucide-react';
import { crossExamineForensicEvidence } from '../services/geminiService';

interface ResultsDashboardProps {
  report: ForensicReport;
  imageSrc: string;
  onViewReport: () => void;
  onReset: () => void;
  history?: ForensicReport[];
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report, imageSrc, onViewReport, onReset, history }) => {
  const [activeFilter, setActiveFilter] = useState<'normal' | 'ela' | 'noise' | 'heatmap'>('normal');
  const [languageMode, setLanguageMode] = useState<'en' | 'ur'>('en');
  const [inquestQuery, setInquestQuery] = useState('');
  const [isInquestLoading, setIsInquestLoading] = useState(false);
  const [inquestResponse, setInquestResponse] = useState<{ answer: string; model: string; isLive: boolean; timestamp: string } | null>(null);
  const [inquestError, setInquestError] = useState<string | null>(null);

  const isAi = report.verdict === Verdict.LIKELY_AI;
  const isSuspicious = report.verdict === Verdict.POSSIBLE_MANIPULATION;
  const isAuthentic = report.verdict === Verdict.NO_STRONG_SYNTHETIC;
  const isInconclusive = report.verdict === Verdict.INCONCLUSIVE;

  // Exact color mapping
  const verdictConfig = {
    [Verdict.LIKELY_AI]: {
      textColor: 'text-[#E35D6A]',
      bgColor: 'bg-[#E35D6A]/10',
      borderColor: 'border-[#E35D6A]',
      badgeBg: 'bg-[#E35D6A]',
      icon: AlertTriangle,
      label: 'Likely AI-Generated',
    },
    [Verdict.POSSIBLE_MANIPULATION]: {
      textColor: 'text-[#E6A23C]',
      bgColor: 'bg-[#E6A23C]/10',
      borderColor: 'border-[#E6A23C]',
      badgeBg: 'bg-[#E6A23C]',
      icon: AlertCircle,
      label: 'Possible Manipulation',
    },
    [Verdict.NO_STRONG_SYNTHETIC]: {
      textColor: 'text-[#20B486]',
      bgColor: 'bg-[#20B486]/10',
      borderColor: 'border-[#20B486]',
      badgeBg: 'bg-[#20B486]',
      icon: CheckCircle,
      label: 'No Strong Synthetic Indicators Detected',
    },
    [Verdict.INCONCLUSIVE]: {
      textColor: 'text-[#94A3B8]',
      bgColor: 'bg-[#172438]',
      borderColor: 'border-[#263449]',
      badgeBg: 'bg-[#94A3B8]',
      icon: HelpCircle,
      label: 'Inconclusive — Insufficient Evidence',
    },
  }[report.verdict];

  const VerdictIcon = verdictConfig.icon;

  const handleInquestSubmit = async (queryText: string) => {
    if (!queryText.trim() || isInquestLoading) return;
    setIsInquestLoading(true);
    setInquestError(null);
    try {
      const res = await crossExamineForensicEvidence({
        query: queryText.trim(),
        caseId: report.caseId,
        verdict: report.verdict,
        authenticityScore: report.authenticityScore,
        domainAnalysis: report.domainAnalysis,
        findings: report.findings,
        metadata: report.metadata,
      });
      setInquestResponse(res);
    } catch (err: any) {
      setInquestError(err?.message || 'Cross-examination query failed.');
    } finally {
      setIsInquestLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Bar: Case ID, Cryptographic Hash, Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#263449] gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-[#F1F5F9] tracking-tight">Forensic Examination Dashboard</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172438] border border-[#263449] text-[#18A999]">
              FRE 901 COMPLIANT
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#94A3B8] mt-1.5">
            <span>CASE: <strong className="text-[#F1F5F9]">{report.caseId}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3 text-[#18A999]" />
              SHA-256: <strong className="text-[#F1F5F9]">{report.fileHash.substring(0, 16)}...</strong>
            </span>
            <span>•</span>
            <span>FORMAT: <strong className="text-[#F1F5F9]">{report.resolution || 'N/A'}</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] bg-[#172438] hover:bg-[#111C2E] border border-[#263449] rounded transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>New Scan</span>
          </button>
          <button
            type="button"
            onClick={onViewReport}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#18A999] hover:bg-[#18A999]/90 rounded transition shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Official Evidence Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Visual Exhibit & Verdict Banner (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Classification Banner */}
          <div className={`p-5 rounded-lg border ${verdictConfig.borderColor} ${verdictConfig.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                Standardized Forensic Classification
              </span>
              <VerdictIcon className={`h-5 w-5 ${verdictConfig.textColor}`} />
            </div>

            <h3 className={`text-xl font-bold tracking-tight ${verdictConfig.textColor} mb-3`}>
              {report.verdict}
            </h3>

            {/* Confidence metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#94A3B8]">Detector Confidence Index</span>
                <span className="font-mono font-semibold text-[#F1F5F9]">{report.confidence}%</span>
              </div>
              <div className="w-full bg-[#0B1220] h-1.5 rounded-full overflow-hidden border border-[#263449]">
                <div
                  className={`h-full ${
                    isAi ? 'bg-[#E35D6A]' : isSuspicious ? 'bg-[#E6A23C]' : isAuthentic ? 'bg-[#20B486]' : 'bg-[#94A3B8]'
                  } transition-all duration-700`}
                  style={{ width: `${report.confidence}%` }}
                />
              </div>
            </div>

            {/* Decision Rule Explainer */}
            <div className="mt-3.5 pt-3 border-t border-[#263449] text-[11px] text-[#94A3B8] leading-tight">
              <span className="text-[#F1F5F9] font-mono font-medium block mb-0.5">Policy Rule Triggered:</span>
              {report.decisionRule}
            </div>
          </div>

          {/* Interactive Visual Exhibit Viewport */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] overflow-hidden">
            <div className="p-3 bg-[#111C2E] border-b border-[#263449] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#F1F5F9]">VISUAL_EXHIBIT</span>
                <span className="text-[10px] font-mono text-[#94A3B8]">({report.fileSize})</span>
              </div>
              
              {/* Filter toggles */}
              <div className="flex space-x-1">
                {(['normal', 'ela', 'noise', 'heatmap'] as const).map((filter) => {
                  if (filter === 'heatmap' && !report.heatmapData) return null;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition ${
                        activeFilter === filter
                          ? 'bg-[#18A999] text-white'
                          : 'bg-[#172438] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#263449]'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Viewport */}
            <div className="relative bg-[#0B1220] min-h-[300px] max-h-[420px] flex items-center justify-center p-3 overflow-hidden">
              <img
                src={activeFilter === 'heatmap' && report.heatmapData ? report.heatmapData : imageSrc}
                alt="Analyzed Exhibit"
                className={`max-h-[380px] w-auto object-contain transition-all duration-300 ${
                  activeFilter === 'ela'
                    ? 'filter contrast-200 saturate-200 hue-rotate-90 invert'
                    : activeFilter === 'noise'
                    ? 'filter contrast-150 grayscale'
                    : ''
                }`}
              />
              {activeFilter === 'ela' && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#E6A23C] border border-[#E6A23C]/40">
                  ELA DIFFERENCE RESIDUALS (COMPRESSION ANOMALIES)
                </div>
              )}
              {activeFilter === 'noise' && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#18A999] border border-[#18A999]/40">
                  HIGH-PASS NOISE SPECTRUM (BAYER PATTERN AUDIT)
                </div>
              )}
              {activeFilter === 'heatmap' && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#E35D6A] border border-[#E35D6A]/40">
                  SPATIAL ANOMALY HEATMAP (ELA DIFFERENTIAL)
                </div>
              )}
            </div>
          </div>

          {/* Dedicated Neural Classifier Output Card */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-[#18A999]" />
                <span className="text-xs font-semibold text-[#F1F5F9]">Dedicated Open-Weight Classifier</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                report.neuralClassifier.status === 'SUCCESS' ? 'bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/30' : 'bg-[#E6A23C]/10 text-[#E6A23C]'
              }`}>
                {report.neuralClassifier.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Model Identifier</span>
                <span className="text-[#F1F5F9] font-medium text-[11px] truncate block" title={report.neuralClassifier.modelName}>
                  {report.neuralClassifier.modelName}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Inference Latency</span>
                <span className="text-[#F1F5F9] font-mono text-[11px]">
                  {report.neuralClassifier.inferenceTimeMs} ms (ONNX)
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Synthetic / Fake Probability</span>
                <span className={`font-mono text-base font-bold ${
                  report.neuralClassifier.fakeProbability > 0.6 ? 'text-[#E35D6A]' : 'text-[#F1F5F9]'
                }`}>
                  {(report.neuralClassifier.fakeProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Organic / Real Probability</span>
                <span className={`font-mono text-base font-bold ${
                  report.neuralClassifier.realProbability > 0.6 ? 'text-[#20B486]' : 'text-[#F1F5F9]'
                }`}>
                  {(report.neuralClassifier.realProbability * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#263449] text-[10px] text-[#94A3B8] space-y-1">
              <div>
                <strong className="text-[#F1F5F9]">License:</strong> {report.neuralClassifier.license}
              </div>
              <div>
                <strong className="text-[#F1F5F9]">Preprocessing:</strong> {report.neuralClassifier.preprocessing}
              </div>
              <div>
                <strong className="text-[#F1F5F9]">Documented Limitations:</strong> {report.neuralClassifier.limitations}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Deep Forensic Evidence & Reasoning (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Metadata & Provenance Card */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-[#3B82F6]" />
                <h4 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                  Container Forensics & C2PA Provenance
                </h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                report.metadata.c2paStatus === 'VALID_CREDENTIALS'
                  ? 'bg-[#20B486]/10 text-[#20B486] border-[#20B486]/30'
                  : report.metadata.c2paStatus === 'UNVERIFIED_MANIFEST'
                  ? 'bg-[#E6A23C]/10 text-[#E6A23C] border-[#E6A23C]/30'
                  : 'bg-[#111C2E] text-[#94A3B8] border-[#263449]'
              }`}>
                {report.metadata.c2paStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Camera Make/Model</span>
                <span className="text-[#F1F5F9] font-medium">
                  {report.metadata.make ? `${report.metadata.make} ${report.metadata.model || ''}` : 'None Observed'}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Software Tool</span>
                <span className={`font-medium ${report.metadata.isSoftwareAiFlagged ? 'text-[#E35D6A]' : 'text-[#F1F5F9]'}`}>
                  {report.metadata.software || 'None Declared'}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">Capture Settings</span>
                <span className="text-[#F1F5F9] font-mono">
                  {report.metadata.iso ? `ISO ${report.metadata.iso} • f/${report.metadata.fNumber || '?'}` : 'No Exposure Tags'}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] font-mono block">C2PA Manifest</span>
                <span className="text-[#F1F5F9]">
                  {report.metadata.c2paManifestPresent ? 'Manifest Box Embedded' : 'No Signature Found'}
                </span>
              </div>
            </div>

            {/* Inconsistency flags */}
            {report.metadata.inconsistencies.length > 0 && (
              <div className="p-3 bg-[#0B1220] rounded border border-[#263449] space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-[#E6A23C] block font-semibold">
                  Audited Container Inconsistencies ({report.metadata.inconsistencies.length})
                </span>
                {report.metadata.inconsistencies.map((inc, i) => (
                  <div key={i} className="text-[#F1F5F9] flex items-start space-x-2 text-[11px]">
                    <span className="text-[#E6A23C] font-mono mt-0.5">•</span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Domain Integrity Matrix */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-5">
            <h4 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#18A999]" />
              Domain Integrity Vectors
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Biological / Anatomy', icon: Eye, data: report.domainAnalysis.biological },
                { title: 'Digital Artifacts', icon: Cpu, data: report.domainAnalysis.digital },
                { title: 'Physics & Optics', icon: Zap, data: report.domainAnalysis.physics },
              ].map((domain, i) => {
                const Icon = domain.icon;
                const statusColor = domain.data.status === 'PASS' ? 'text-[#20B486] bg-[#20B486]/10' : domain.data.status === 'WARN' ? 'text-[#E6A23C] bg-[#E6A23C]/10' : 'text-[#E35D6A] bg-[#E35D6A]/10';

                return (
                  <div key={i} className="bg-[#111C2E] p-3.5 rounded border border-[#263449] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-medium text-[#F1F5F9]">
                          <Icon className="h-3.5 w-3.5 text-[#18A999]" />
                          <span>{domain.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${statusColor}`}>
                          {domain.data.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] leading-snug mb-3">
                        {domain.data.details}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#263449]/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#94A3B8] text-[10px]">INTEGRITY</span>
                      <span className="text-[#F1F5F9] font-bold">{domain.data.score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gemma 4 Courtroom Reasoning & Bilingual Narrative */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-[#18A999]" />
                <h4 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                  Gemma 4 Courtroom Reasoning & Explanation
                </h4>
              </div>

              {/* English / Urdu Toggle */}
              <div className="flex items-center space-x-1 bg-[#111C2E] p-0.5 rounded border border-[#263449]">
                <button
                  type="button"
                  onClick={() => setLanguageMode('en')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition ${
                    languageMode === 'en' ? 'bg-[#18A999] text-white' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageMode('ur')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition ${
                    languageMode === 'ur' ? 'bg-[#18A999] text-white' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  اردو (Urdu)
                </button>
              </div>
            </div>

            {/* Narrative text */}
            <div className="p-3.5 bg-[#111C2E] rounded border border-[#263449]">
              {languageMode === 'en' ? (
                <p className="text-xs text-[#F1F5F9] leading-relaxed">
                  {report.explanation}
                </p>
              ) : (
                <p className="text-sm text-[#F1F5F9] leading-relaxed font-sans text-right" dir="rtl">
                  {report.urduExplanation || report.explanation}
                </p>
              )}
            </div>

            {/* Key Findings Checklist */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                Corroborated Forensic Findings:
              </span>
              {report.findings.map((f, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-[#F1F5F9]">
                  <span className="text-[#18A999] font-mono mt-0.5">[{i + 1}]</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Uncertainty Explanation */}
            <div className="p-2.5 bg-[#0B1220] rounded border border-[#263449] text-[11px] text-[#94A3B8] flex items-start space-x-2">
              <Info className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F1F5F9]">Uncertainty & Boundaries: </strong>
                {report.uncertaintyExplanation}
              </div>
            </div>
          </div>

          {/* Interactive Inquest & Cross-Examination */}
          <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <Scale className="h-4 w-4 text-[#3B82F6]" />
                <h4 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                  Investigator Cross-Examination & Inquest (Gemma 4)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">DAUBERT EXPERT WITNESS</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                'Does this satisfy Daubert / FRE 901 court admissibility?',
                'Explain the 8x8 latent diffusion lattice evidence',
                'What are the limitations of stripped metadata?',
                'اس فرانزک ثبوت کی قانونی حیثیت کیا ہے؟'
              ].map((queryPrompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInquestQuery(queryPrompt);
                    handleInquestSubmit(queryPrompt);
                  }}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#111C2E] hover:bg-[#263449] border border-[#263449] text-[#94A3B8] hover:text-[#F1F5F9] transition"
                >
                  {queryPrompt}
                </button>
              ))}
            </div>

            {/* Query Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInquestSubmit(inquestQuery);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inquestQuery}
                onChange={(e) => setInquestQuery(e.target.value)}
                placeholder="Query Gemma 4 about case admissibility, noise metrics, or legal criteria..."
                className="flex-grow bg-[#111C2E] border border-[#263449] rounded px-3 py-2 text-xs text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#18A999]"
              />
              <button
                type="submit"
                disabled={isInquestLoading || !inquestQuery.trim()}
                className="px-4 py-2 bg-[#18A999] hover:bg-[#18A999]/90 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isInquestLoading ? 'Analyzing...' : 'Inquest'}</span>
              </button>
            </form>

            {/* Response card */}
            {inquestResponse && (
              <div className="p-3.5 bg-[#0B1220] rounded border border-[#263449] space-y-1.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#263449] pb-1.5">
                  <span className="font-mono text-[10px] text-[#18A999]">
                    EXPERT WITNESS AUDIT // {inquestResponse.model}
                  </span>
                  <span className="font-mono text-[10px]">
                    {new Date(inquestResponse.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[#F1F5F9] leading-relaxed">
                  {inquestResponse.answer}
                </p>
              </div>
            )}

            {inquestError && (
              <div className="p-3 bg-[#E35D6A]/10 border border-[#E35D6A]/30 rounded text-xs text-[#E35D6A]">
                {inquestError}
              </div>
            )}
          </div>

          {/* Comparative Timeline Insights (Contextual contrast between AI/Real) */}
          {history && history.length > 1 && (
            <div className="bg-[#172438] rounded-lg border border-[#263449] p-5 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#263449]">
                <Layers className="h-4 w-4 text-[#18A999]" />
                <h4 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider">
                  Comparative Forensic Insight
                </h4>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Platform has identified <strong className="text-[#F1F5F9]">{history.length}</strong> linked investigations in the current session.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {history.filter(h => h.caseId !== report.caseId).slice(-2).map((h) => {
                    const isContrast = h.verdict !== report.verdict;
                    return (
                      <div key={h.caseId} className={`p-3 rounded border ${isContrast ? 'bg-[#18A999]/5 border-[#18A999]/20' : 'bg-[#111C2E] border-[#263449]'} text-[10px]`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[#18A999]">REF: {h.caseId}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            h.verdict === Verdict.LIKELY_AI ? 'text-[#E35D6A] bg-[#E35D6A]/10' : 'text-[#20B486] bg-[#20B486]/10'
                          }`}>
                            {h.verdict === Verdict.LIKELY_AI ? 'AI' : 'REAL'}
                          </span>
                        </div>
                        <p className="text-[#F1F5F9] font-medium truncate">{h.fileName}</p>
                        {isContrast && (
                          <p className="text-[#94A3B8] mt-2 italic leading-snug">
                            {report.verdict === Verdict.NO_STRONG_SYNTHETIC 
                              ? `Contrast: Unlike ${h.caseId} (Synthetic), this exhibit shows consistent sensor noise and lacks the 8x8 upsampling lattice.`
                              : `Contrast: Unlike ${h.caseId} (Authentic), this exhibit demonstrates clear neural synthetic signatures and frequency domain anomalies.`
                            }
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};