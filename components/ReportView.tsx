import React, { useEffect, useState } from 'react';
import { ForensicReport, Verdict } from '../types';
import { ShieldCheck, Download, ArrowLeft, Printer, Hash, Shield, FileText, CheckCircle, AlertTriangle, Info, HeartHandshake } from 'lucide-react';

interface ReportViewProps {
  report: ForensicReport;
  imageSrc: string;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, imageSrc, onBack }) => {
  const [includeUrdu, setIncludeUrdu] = useState(true);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = `Verisight_Forensic_Report_${report.caseId}`;
    return () => {
      document.title = originalTitle;
    };
  }, [report.caseId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      ...report,
      exportTimestamp: new Date().toISOString(),
      evidentiaryStandard: 'Federal Rules of Evidence Rule 901 & Daubert standard',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Verisight_Forensic_Report_${report.caseId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] pb-20 print:bg-white print:text-black print:pb-0">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-[#111C2E] border-b border-[#263449] sticky top-0 z-50 px-4 py-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Investigation Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs text-[#94A3B8] cursor-pointer">
            <input
              type="checkbox"
              checked={includeUrdu}
              onChange={(e) => setIncludeUrdu(e.target.checked)}
              className="rounded bg-[#172438] border-[#263449] text-[#18A999] focus:ring-0"
            />
            <span>Include Urdu Translation</span>
          </label>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-1.5 text-xs font-mono bg-[#172438] hover:bg-[#263449] text-[#F1F5F9] rounded border border-[#263449] transition"
          >
            Download JSON
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-[#18A999] hover:bg-[#18A999]/90 text-white rounded transition shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div
        id="printable-report"
        className="max-w-[210mm] mx-auto bg-white text-slate-900 min-h-[297mm] p-12 mt-6 shadow-2xl rounded-sm print:shadow-none print:mt-0 print:p-0 print:max-w-none print:w-full"
      >
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 mb-1">
              <ShieldCheck className="h-7 w-7 text-slate-900" />
              <span className="text-xl font-bold tracking-tight">VERISIGHT SHIELD FORENSIC LABORATORY</span>
            </div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Digital Forensics & AI Media Authenticity Division
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <p className="font-bold text-slate-800">OFFICIAL FORENSIC EXAMINATION REPORT</p>
            <p className="text-slate-500">CASE ID: {report.caseId}</p>
            <p className="text-slate-500">DATE: {new Date(report.timestamp).toLocaleString()}</p>
          </div>
        </div>

        {/* Chain of Custody & Hash */}
        <div className="mb-6 p-3 bg-slate-100 rounded border border-slate-200 flex flex-wrap justify-between items-center text-xs font-mono text-slate-700 gap-2">
          <div>
            <span className="text-slate-500">EXHIBIT FILENAME:</span> <strong>{report.fileName}</strong> ({report.fileSize})
          </div>
          <div>
            <span className="text-slate-500">SHA-256 HASH:</span> <span className="font-bold">{report.fileHash}</span>
          </div>
        </div>

        {/* Executive Verdict Box */}
        <div className="mb-6 p-5 rounded-lg border-2 border-slate-900 bg-slate-50">
          <div className="grid grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                Primary Evidentiary Classification
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {report.verdict}
              </p>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                Policy Rule: {report.decisionRule}
              </p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600">Statistical Confidence:</span>
                <span className="font-bold text-slate-900">{report.confidence}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900" style={{ width: `${report.confidence}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                {report.uncertaintyExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Exhibit & Metadata Section */}
        <div className="mb-6 grid grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200">
              Container & Provenance Inspection
            </h3>
            <table className="w-full text-xs text-slate-700">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-500 font-medium">Declared Camera</td>
                  <td className="py-1">{report.metadata.make ? `${report.metadata.make} ${report.metadata.model || ''}` : 'No Camera Hardware Declared'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-500 font-medium">Software / Generator</td>
                  <td className="py-1">{report.metadata.software || 'None Declared'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-500 font-medium">Exposure Metadata</td>
                  <td className="py-1">{report.metadata.iso ? `ISO ${report.metadata.iso}, f/${report.metadata.fNumber || '?'}, ${report.metadata.exposureTime || ''}` : 'None Available'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-500 font-medium">C2PA Credentials</td>
                  <td className="py-1 font-mono">{report.metadata.c2paStatus}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 text-slate-500 font-medium">Observed EXIF Tags</td>
                  <td className="py-1">{report.metadata.rawTagsCount} tags extracted</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200">
              Visual Evidence & Anomaly Heatmap
            </h3>
            <div className="grid grid-cols-2 gap-2 h-44">
              <div className="bg-slate-100 border border-slate-200 rounded p-1 flex flex-col items-center justify-center relative">
                <span className="absolute top-1 left-1 text-[8px] font-mono text-slate-400">ORIGINAL</span>
                <img src={imageSrc} alt="Exhibit" className="h-full object-contain max-h-40" />
              </div>
              <div className="bg-slate-900 border border-slate-200 rounded p-1 flex flex-col items-center justify-center relative">
                <span className="absolute top-1 left-1 text-[8px] font-mono text-slate-400">HEATMAP</span>
                {report.heatmapData ? (
                  <img src={report.heatmapData} alt="Heatmap" className="h-full object-contain max-h-40" />
                ) : (
                  <div className="text-[10px] text-slate-600 font-mono">Heatmap Unavailable</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Neural Classifier Specification */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200">
            Dedicated Open-Weight Neural Classifier Audit
          </h3>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 grid grid-cols-2 gap-4">
            <div>
              <p><strong className="text-slate-900">Model:</strong> {report.neuralClassifier.modelName} ({report.neuralClassifier.modelVersion})</p>
              <p><strong className="text-slate-900">Architecture:</strong> {report.neuralClassifier.architecture}</p>
              <p><strong className="text-slate-900">License:</strong> {report.neuralClassifier.license}</p>
            </div>
            <div>
              <p><strong className="text-slate-900">Synthetic Probability:</strong> {(report.neuralClassifier.fakeProbability * 100).toFixed(1)}%</p>
              <p><strong className="text-slate-900">Organic Probability:</strong> {(report.neuralClassifier.realProbability * 100).toFixed(1)}%</p>
              <p><strong className="text-slate-900">Inference Status:</strong> {report.neuralClassifier.status} ({report.neuralClassifier.inferenceTimeMs}ms)</p>
            </div>
          </div>
        </div>

        {/* Domain Analysis Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200">
            Multi-Domain Physical & Digital Breakdown
          </h3>
          <table className="w-full text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase text-left">
                <th className="py-1">Vector</th>
                <th className="py-1">Status</th>
                <th className="py-1 text-center">Score</th>
                <th className="py-1">Forensic Finding</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium">Biological / Anatomy</td>
                <td className="py-2"><span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-200">{report.domainAnalysis.biological.status}</span></td>
                <td className="py-2 text-center font-mono">{report.domainAnalysis.biological.score}%</td>
                <td className="py-2 text-slate-600 italic">{report.domainAnalysis.biological.details}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium">Digital Artifacts</td>
                <td className="py-2"><span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-200">{report.domainAnalysis.digital.status}</span></td>
                <td className="py-2 text-center font-mono">{report.domainAnalysis.digital.score}%</td>
                <td className="py-2 text-slate-600 italic">{report.domainAnalysis.digital.details}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium">Physics & Lighting</td>
                <td className="py-2"><span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-200">{report.domainAnalysis.physics.status}</span></td>
                <td className="py-2 text-center font-mono">{report.domainAnalysis.physics.score}%</td>
                <td className="py-2 text-slate-600 italic">{report.domainAnalysis.physics.details}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Narrative & Findings */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200">
            Forensic Expert Witness Narrative (English)
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            {report.explanation}
          </p>

          {includeUrdu && report.urduExplanation && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                فرانزک خلاصہ (Urdu Evidence Summary):
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-sans text-right" dir="rtl">
                {report.urduExplanation}
              </p>
            </div>
          )}

          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
            {report.findings.map((f, i) => (
              <li key={i}><strong className="text-slate-900">Observation {i + 1}:</strong> {f}</li>
            ))}
          </ul>
        </div>

        {/* Victim Safety & Evidence Preservation Guidance */}
        {report.victimSafetyGuidance && report.victimSafetyGuidance.length > 0 && (
          <div className="mb-6 p-4 rounded bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-2 flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-slate-700" />
              Evidence Preservation & Digital Safety Checklist
            </h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {report.victimSafetyGuidance.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer & Certification */}
        <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">Verisight Shield Forensic Intelligence</p>
            <p className="text-[10px] font-mono">Governed by FRE Rule 901 & Daubert Admissibility Criteria</p>
          </div>
          <div className="text-right font-mono text-[10px]">
            <p>CRYPTOGRAPHIC SIGNATURE VALIDATED</p>
            <p>DIGEST: {report.fileHash.substring(0, 24)}...</p>
          </div>
        </div>

      </div>

    </div>
  );
};