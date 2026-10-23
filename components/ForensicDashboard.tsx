import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { Scanner } from './Scanner';
import { ResultsDashboard } from './ResultsDashboard';
import { ReportView } from './ReportView';
import { AnalysisStatus, AnalysisRequest, ForensicReport, MediaType } from '../types';
import { runDeepfakeScan } from '../services/mockAnalysisService';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ForensicDashboardProps {
  onReportAvailable?: (report: ForensicReport) => void;
  externalReport?: ForensicReport | null;
  initialViewMode?: 'dashboard' | 'report';
}

export const ForensicDashboard: React.FC<ForensicDashboardProps> = ({
  onReportAvailable,
  externalReport = null,
  initialViewMode = 'dashboard',
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

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {status === AnalysisStatus.IDLE && (
        <UploadZone onFileSelected={handleFileSelection} />
      )}

      {status === AnalysisStatus.SCANNING && request && (
        <Scanner
          imageSrc={request.previewUrl}
          mediaType={request.mediaType}
        />
      )}

      {status === AnalysisStatus.COMPLETE && report && (
        <ResultsDashboard
          report={report}
          imageSrc={request?.previewUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=640'}
          onViewReport={() => setViewMode('report')}
          onReset={handleReset}
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
  );
};