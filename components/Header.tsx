import React from 'react';
import { ShieldCheck, Lock, Cpu, Layers, BookOpen, HeartHandshake, Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  hasActiveReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, hasActiveReport }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems: { id: PageView; label: string; icon: any; badge?: string }[] = [
    { id: 'workspace', label: 'Analysis Workspace', icon: Layers },
    { id: 'overview', label: 'System Overview', icon: Cpu },
    { id: 'report', label: 'Evidence Report', icon: ShieldCheck, badge: hasActiveReport ? 'Active' : undefined },
    { id: 'skills', label: 'Agent Skills', icon: BookOpen },
    { id: 'safety', label: 'Digital Safety & Privacy', icon: HeartHandshake },
  ];

  return (
    <header className="border-b border-[#263449] bg-[#0B1220]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group select-none"
          onClick={() => onNavigate('workspace')}
        >
          <div className="bg-[#172438] p-2 rounded-lg border border-[#263449] group-hover:border-[#18A999] transition-colors">
            <ShieldCheck className="h-5 w-5 text-[#18A999]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold tracking-tight text-[#F1F5F9]">Verisight Shield</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#172438] border border-[#263449] text-[#18A999]">
                v3.2
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] font-mono tracking-wider uppercase">
              Digital Forensics & AI Media Detection
            </p>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-150 relative
                  ${isActive 
                    ? 'text-[#F1F5F9] bg-[#172438] border border-[#263449] shadow-sm' 
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111C2E]'
                  }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#18A999]' : 'text-[#94A3B8]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#18A999]/20 text-[#18A999] border border-[#18A999]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Privacy & Engine Badges */}
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <div className="flex items-center text-[#20B486] space-x-1.5 bg-[#172438] px-2.5 py-1 rounded border border-[#263449]">
            <Lock className="h-3 w-3 text-[#20B486]" />
            <span className="font-mono text-[10px]">SANDBOX_MEM // ZERO_RETENTION</span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] bg-[#172438] rounded border border-[#263449]"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0B1220] border-b border-[#263449] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium text-left
                  ${isActive 
                    ? 'text-white bg-[#172438] border border-[#263449]' 
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="h-4 w-4 text-[#18A999]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#18A999]/20 text-[#18A999]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
