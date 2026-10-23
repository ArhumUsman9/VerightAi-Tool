import React, { useState } from 'react';
import { Header } from './components/Header';
import { ForensicDashboard } from './components/ForensicDashboard';
import { OverviewDashboard } from './components/OverviewDashboard';
import { SkillsWorkspace } from './components/SkillsWorkspace';
import { VictimSafetyView } from './components/VictimSafetyView';
import { Technology } from './components/Technology';
import { PageView, ForensicReport } from './types';
import { ShieldCheck, Lock, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('workspace');
  const [activeReport, setActiveReport] = useState<ForensicReport | null>(null);

  const handleReportAvailable = (report: ForensicReport) => {
    setActiveReport(report);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'workspace':
        return (
          <ForensicDashboard
            onReportAvailable={handleReportAvailable}
            externalReport={activeReport}
            initialViewMode="dashboard"
          />
        );
      case 'overview':
        return <OverviewDashboard onStartScan={() => setCurrentPage('workspace')} />;
      case 'report':
        if (activeReport) {
          return (
            <ForensicDashboard
              externalReport={activeReport}
              initialViewMode="report"
            />
          );
        }
        return (
          <div className="max-w-xl mx-auto mt-20 p-8 bg-[#172438] rounded-lg border border-[#263449] text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#111C2E] border border-[#263449] flex items-center justify-center mx-auto text-[#18A999]">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-[#F1F5F9]">No Active Evidence Case Selected</h3>
            <p className="text-xs text-[#94A3B8]">
              Analyze an image, video sequence, or audio sample in the workspace to generate an official court-ready report.
            </p>
            <button
              onClick={() => setCurrentPage('workspace')}
              className="px-4 py-2 bg-[#18A999] hover:bg-[#18A999]/90 text-white rounded text-xs font-semibold transition"
            >
              Go to Analysis Workspace
            </button>
          </div>
        );
      case 'skills':
        return <SkillsWorkspace />;
      case 'safety':
        return <VictimSafetyView />;
      case 'technology':
        return <Technology />;
      default:
        return <ForensicDashboard onReportAvailable={handleReportAvailable} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-[#F1F5F9] font-sans">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        hasActiveReport={Boolean(activeReport)}
      />

      <main className="flex-grow">
        {renderPage()}
      </main>

      <footer className="border-t border-[#263449] py-5 mt-auto bg-[#0B1220] text-xs font-mono text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-[#18A999]" />
            <span>&copy; {new Date().getFullYear()} Verisight Shield Forensic Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>DAUBERT & FRE RULE 901 COMPLIANCE</span>
            <span>•</span>
            <span>C2PA / CONTENT CREDENTIALS ENGINE</span>
            <span>•</span>
            <span className="text-[#20B486]">ZERO_PERSISTENT_STORAGE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
