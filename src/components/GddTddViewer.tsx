import { useState } from 'react';
import { gddTddSections } from '../data/gdd_tdd';
import { Language } from '../i18n';
import { FileText, Database, ShieldAlert, Award, ArrowUpRight, Copy, Check, Terminal } from 'lucide-react';

interface GddTddViewerProps {
  language: Language;
}

export default function GddTddViewer({ language }: GddTddViewerProps) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const icons = [
    <FileText className="w-5 h-5" id="gdd-icon-file" />,
    <Award className="w-5 h-5" id="gdd-icon-award" />,
    <Database className="w-5 h-5" id="gdd-icon-db" />,
    <ShieldAlert className="w-5 h-5" id="gdd-icon-shield" />
  ];

  const handleCopySpec = () => {
    const fullSpec = gddTddSections
      .map(s => `=== ${language === 'en' ? s.titleEn : s.titleTh} ===\n\n${language === 'en' ? s.contentEn : s.contentTh}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullSpec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col" id="gdd-tdd-panel">
      {/* Header bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="gdd-header-container">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              DESIGN CORES INTERFACE <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-400/30">v1.4 Spec</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'en' 
                ? "Active Technical & Game Design Specifications (GDD / TDD)"
                : "เอกสารข้อมูลสรุปโครงสร้างทางเทคนิคและสติปัญญาการเล่นเกม (GDD / TDD)"}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySpec}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
          id="gdd-btn-copy"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Spec!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Specs</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden" id="gdd-main-grid">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-slate-950 border-r border-slate-900 p-4 overflow-y-auto space-y-2 lg:max-h-[600px]" id="gdd-sidebar">
          <div className="text-slate-500 font-mono text-[10px] font-bold tracking-widest uppercase px-2 mb-2">
            {language === 'en' ? "Document Indexes" : "ดัชนีหัวข้อเอกสาร"}
          </div>

          {gddTddSections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between group ${
                activeSection === idx
                  ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/55 hover:bg-slate-900/100 text-slate-300 border border-slate-800/60'
              }`}
              id={`gdd-nav-item-${idx}`}
            >
              <div className="flex items-center gap-3">
                <span className={activeSection === idx ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}>
                  {icons[idx] || <FileText className="w-5 h-5" />}
                </span>
                <span className="text-sm font-medium tracking-tight truncate max-w-[200px]">
                  {language === 'en' ? sec.titleEn : sec.titleTh}
                </span>
              </div>
              <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === idx ? 'text-white' : 'text-slate-500'}`} />
            </button>
          ))}

          {/* Quick Technical Summary Card */}
          <div className="mt-6 p-4 rounded-xl border border-dashed border-emerald-500/20 bg-emerald-500/5 space-y-2" id="gdd-tech-highlights-card">
            <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              🛡️ BOT PREVENTION GATE
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'en'
                ? "The game compiles custom SVG layout filters on-the-fly and analyzes mouse-move trajectory intervals (biometric noise profiling) to guarantee cheat immunity up to 100k peak DAU."
                : "ระบบทำการวิเคราะห์คลื่นพลังชีวภาพและจังหวะลาก (Jitter) เพื่อบล็อกกลุ่มแฮกเกอร์อัตโนมัติได้อย่างเสถียร รองรับขีดจำกัดแสนคนต่อวันโดยปราศจากอาการแล็ก"}
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 p-6 overflow-y-auto lg:max-h-[600px] bg-slate-900/20" id="gdd-content-panel">
          <div className="prose prose-invert max-w-none space-y-6 text-slate-300" id="gdd-active-prose-body">
            {/* Title heading */}
            <h2 className="text-xl md:text-2xl font-black text-slate-100 border-b border-slate-800 pb-3 font-mono flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-sm">
                SEC 0{activeSection + 1}
              </span>
              {language === 'en' 
                ? gddTddSections[activeSection].titleEn 
                : gddTddSections[activeSection].titleTh}
            </h2>

            {/* Main content body rendered cleanly with customized markdown tags */}
            <div className="space-y-4 text-sm leading-relaxed" id="gdd-rendered-body">
              {/* Parse headers and code segments visually */}
              {(language === 'en' 
                ? gddTddSections[activeSection].contentEn 
                : gddTddSections[activeSection].contentTh
              ).split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-lg font-bold font-mono text-emerald-400 pt-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('* **')) {
                  return (
                    <div key={pIdx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 mb-2 font-mono text-xs">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="mb-1">{line}</div>
                      ))}
                    </div>
                  );
                } else if (paragraph.startsWith('```sql') || paragraph.startsWith('```')) {
                  const rawCode = paragraph
                    .replace('```sql', '')
                    .replace('```', '')
                    .trim();
                  return (
                    <pre key={pIdx} className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner ring-1 ring-emerald-500/5">
                      <code>{rawCode}</code>
                    </pre>
                  );
                } else {
                  return (
                    <p key={pIdx} className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
