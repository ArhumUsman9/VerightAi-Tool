import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { Scanner } from './Scanner';
import { ResultsDashboard } from './ResultsDashboard';
import { ReportView } from './ReportView';
import { AnalysisStatus, AnalysisRequest, ForensicReport, MediaType, Verdict } from '../types';
import { runDeepfakeScan } from '../services/mockAnalysisService';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ForensicDashboardProps {
  onReportAvailable?: (report: ForensicReport) => void;
  externalReport?: ForensicReport | null;
  initialViewMode?: 'dashboard' | 'report';
  history?: ForensicReport[];
  onSelectHistory?: (id: string) => void;
}

export const ForensicDashboard: React.FC<ForensicDashboardProps> = ({
  onReportAvailable,
  externalReport = null,
  initialViewMode = 'dashboard',
  history = [],
  onSelectHistory,
}) => {
  const [status, setStatus] = useState<AnalysisStatus>(externalReport ? AnalysisStatus.COMPLETE : AnalysisStatus.IDLE);
  const [request, setRequest] = useState<AnalysisRequest | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(externalReport);
  const [viewMode, setViewMode] = useState<'dashboard' | 'report'>(initialViewMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelection = (file: File, type: MediaType) => {
    const url = URL.createObjectURL(file);

    if (type === MediaType.IMAGE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          startAnalysis(file, e.target.result as string, type);
        }
      };
      reader.readAsDataURL(file);
    } else {
      startAnalysis(file, url, type);
    }
  };

  const startAnalysis = async (file: File, previewUrl: string, type: MediaType) => {
    setRequest({
      file,
      previewUrl,
      mediaType: type,
    });
    setStatus(AnalysisStatus.SCANNING);
    setErrorMessage(null);

    try {
      const result = await runDeepfakeScan(file, previewUrl, type);
      setReport(result);
      setStatus(AnalysisStatus.COMPLETE);
      if (onReportAvailable) {
        onReportAvailable(result);
      }
    } catch (error: any) {
      console.error('Forensic Analysis Execution Error:', error);
      setErrorMessage(error?.message || 'Unexpected failure in forensic neural pipeline.');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setRequest(null);
    setReport(null);
    setViewMode('dashboard');
    setErrorMessage(null);
  };

  if (viewMode === 'report' && report) {
    return (
      <ReportView
        report={report}
        imageSrc={request?.previewUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=640'}
        onBack={() => setViewMode('dashboard')}
      />
    );
  }

  const activeReport = history && history.length > 0 && !report ? history[history.length - 1] : report;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Investigation History Sidebar */}
      {history && history.length > 0 && (
        <aside className="w-64 bg-[#111C2E] border-r border-[#263449] flex flex-col overflow-hidden shrink-0 hidden md:flex">
          <div className="p-4 border-b border-[#263449] flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Case History</h3>
            <span className="bg-[#18A999]/10 text-[#18A999] text-[10px] px-2 py-0.5 rounded border border-[#18A999]/20 font-mono">
              {history.length}
            </span>
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {history.map((h, i) => (
              <button
                key={h.caseId}
                onClick={() => {
                  if (onSelectHistory) onSelectHistory(h.caseId);
                  setReport(h);
                  setStatus(AnalysisStatus.COMPLETE);
                  setViewMode('dashboard');
                }}
                className={`w-full text-left p-3 rounded transition group ${
                  (activeReport?.caseId === h.caseId)
                    ? 'bg-[#172438] border border-[#263449]'
                    : 'hover:bg-[#172438]/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#18A999]">#{i + 1} // {h.caseId.substring(3)}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    h.verdict === Verdict.LIKELY_AI ? 'bg-[#E35D6A]' : 
                    h.verdict === Verdict.NO_STRONG_SYNTHETIC ? 'bg-[#20B486]' : 'bg-[#94A3B8]'
                  }`} />
                </div>
                <p className="text-[11px] font-medium text-[#F1F5F9] truncate group-hover:text-white">
                  {h.fileName}
                </p>
                <p className="text-[9px] text-[#94A3B8] font-mono mt-1">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))}
          </div>
          <div className="p-3 bg-[#0B1220] border-t border-[#263449]">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-2 py-2 text-[10px] font-bold text-[#F1F5F9] bg-[#172438] hover:bg-[#263449] border border-[#263449] rounded transition uppercase tracking-widest"
            >
              <RefreshCw className="h-3 w-3" />
              <span>New Investigation</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Analysis Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {status === AnalysisStatus.IDLE && (
          <UploadZone onFileSelected={handleFileSelection} />
        )}

        {status === AnalysisStatus.SCANNING && request && (
          <Scanner
            imageSrc={request.previewUrl}
            mediaType={request.mediaType}
          />
        )}

        {status === AnalysisStatus.COMPLETE && activeReport && (
          <ResultsDashboard
            report={activeReport}
            imageSrc={activeReport.caseId === report?.caseId ? request?.previewUrl : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=640'}
            onViewReport={() => setViewMode('report')}
            onReset={handleReset}
            history={history}
          />
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-md mx-auto mt-20 p-6 bg-[#172438] border border-[#E35D6A] rounded-lg text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#E35D6A]/10 border border-[#E35D6A]/30 flex items-center justify-center mx-auto">
              <AlertCircle className="h-5 w-5 text-[#E35D6A]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F1F5F9]">Forensic Examination Interrupted</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                {errorMessage || 'The forensic engine encountered an error processing the media artifact.'}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-[#111C2E] hover:bg-[#263449] border border-[#263449] rounded text-xs text-[#F1F5F9] font-medium transition"
            >
              Return to Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};