import { useState, useEffect } from 'react';
import { gatherIdentitySignals, IdentitySignals } from '../utils/identity';
import { ShieldCheck, Cpu, Database, Fingerprint, RefreshCw, Terminal, Globe, User } from 'lucide-react';
import { Language } from '../i18n';

interface OnboardingProps {
  language: Language;
  onEnterHumanity: (nickname: string, country: string, displayName: string, alias: string) => void;
  countries: Array<{ code: string; flag: string; nameEn: string; nameTh: string }>;
}

export default function Onboarding({ language, onEnterHumanity, countries }: OnboardingProps) {
  const [signals, setSignals] = useState<IdentitySignals | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [aliasInput, setAliasInput] = useState('BOT_HUNTER');
  const [countryCode, setCountryCode] = useState('TH');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  // Gathers browser fingerprint signals instantly
  useEffect(() => {
    const gathered = gatherIdentitySignals();
    setSignals(gathered);

    // Stream diagnostic telemetry lines for visual high-tech effect
    const logPool = [
      '⚡ [SYS_INIT] Booting biological security scan sequence...',
      `🖥️ [HARDWARE] CPU Cores detected: ${gathered.hardwareConcurrency} | Depth: ${gathered.colorDepth}b`,
      `🌍 [GEOLOCATION] Grid Timezone aligned: ${gathered.timezone}`,
      `📐 [DISPLAY] Device viewport calibrated: ${gathered.screenResolution}`,
      `🧬 [INTEGRITY] Canvas telemetry stream: ${gathered.canvasHash}`,
      `👁️ [RENDERER] GPU WebGL signature check: ${gathered.webglHash}`,
      '🛡️ [PROTOCOL] Cross-verifying IndexedDB & secure cookie segments...',
      '✅ [VERIFY] Biological signatures confirmed. Identity generation unlocked.'
    ];

    setDiagnosticLogs([logPool[0]]);
    let currentIdx = 1;
    const interval = setInterval(() => {
      if (currentIdx < logPool.length) {
        setDiagnosticLogs((prev) => [...prev, logPool[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    onEnterHumanity(
      nicknameInput.trim(),
      countryCode,
      displayNameInput.trim() || 'Agent Recruit',
      aliasInput.trim() || 'BOT_HUNTER'
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden" id="onboarding-panel">
      {/* Background ambient animations */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 75%) pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-xl pointer-events-none animate-pulse" />

      {/* Headline & Holograph Badge */}
      <div className="text-center space-y-3 relative z-10 mb-8" id="onboarding-headline">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950 text-3xl animate-pulse">
          <Fingerprint className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none uppercase">
            {language === 'en' ? 'ENTER HUMANITY' : 'เข้าสู่โครงการคุ้มเกล้าวิกฤต'}
          </h1>
          <p className="text-xs text-emerald-400/85 font-mono uppercase tracking-wider">
            {language === 'en' ? 'Registration-Free Decentralized Bio-Passport' : 'ใบเบิกทางระบุคลื่นชีวภาพมนุษย์ – ปราศจากการกรอกรหัส'}
          </p>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {language === 'en'
            ? 'Access the verification arena instantly. No accounts, no emails, no passwords. We hash hardware fingerprints to build your un-spoofable permanent human passport.'
            : 'เข้าสู่สมรภูมิรบได้ทันทีโดยไม่ต้อง กรอกอีเมล ตั้งพาสเวิร์ด หรือผูกเบอร์โทรศัพท์ ระบบใช้สัญญาณฮาร์ดแวร์เพื่อรับรองรหัสมนุษย์ถาวรของคุณ'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" id="onboarding-options-section">
        {/* Left column: Setup alias & country */}
        <div className="space-y-4 bg-slate-950/65 p-5 rounded-2xl border border-slate-800/80" id="onboarding-setup-form">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-slate-840 pb-2">
            <User className="w-4 h-4 text-emerald-400" />
            {language === 'en' ? 'PASSPORT DESIGNATION' : 'ตั้งค่าข้อมูลใบเบิกทาง'}
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              {language === 'en' ? 'CALL SIGN (LOCKED CALL SIGN)' : 'สัญญาณรหัสนาม (Call Sign)'}
            </label>
            <input
              type="text"
              maxLength={14}
              placeholder={language === 'en' ? "e.g. BOT_HUNTER" : "เช่น BOT_HUNTER"}
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value.toUpperCase().replace(/[^a-zA-Z0-9_]/g, ''))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              id="onboarding-nickname"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              {language === 'en' ? 'DISPLAY NAME' : 'ชื่อวิทยาฐานะมนุษย์'}
            </label>
            <input
              type="text"
              maxLength={20}
              placeholder={language === 'en' ? "e.g. Captcha Commander" : "เช่น ร้อยตรี ยิ้มสู้กล"}
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              id="onboarding-display-name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              {language === 'en' ? 'TACTICAL ALIAS' : 'ยศหรือฐานปฏิบัติการ'}
            </label>
            <select
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              id="onboarding-alias-select"
            >
              <option value="BOT_HUNTER">BOT_HUNTER</option>
              <option value="THAI_AGENT">THAI_AGENT</option>
              <option value="CAPTCHA_MASTER">CAPTCHA_MASTER</option>
              <option value="VERIFY_KING">VERIFY_KING</option>
              <option value="HUMAN_SENTINEL">HUMAN_SENTINEL</option>
              <option value="IRON_SENTRY">IRON_SENTRY</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              {language === 'en' ? 'COLO-ALLIANCE ASSIGNMENT' : 'เครือข่ายความร่วมมือประเทศ'}
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              id="onboarding-country"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {language === 'en' ? c.nameEn : c.nameTh}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!nicknameInput.trim()}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-mono font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 group border border-emerald-400/25"
            id="onboarding-submit-btn"
          >
            <span>{language === 'en' ? 'ESTABLISH BIO-IDENTITY' : 'สถาปนาอัตลักษณ์ทหารกบฏ'}</span>
            <span className="text-[10px] bg-emerald-700/60 text-emerald-200 px-1.5 py-0.5 rounded font-mono group-hover:bg-emerald-600 transition">
              &lt; 1s
            </span>
          </button>
        </div>

        {/* Right column: Diagnostics visual log feed */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between" id="onboarding-telemetry-box">
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-slate-850 pb-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              {language === 'en' ? 'BIOLATERAL SIGNATURES' : 'ถอดคลื่นสมองชีวภาพ'}
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-none font-mono text-[10px]" id="onboarding-logs-scroller">
              {diagnosticLogs.map((log, idx) => (
                <div key={idx} className="text-slate-400 leading-normal break-all">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {signals && (
            <div className="border-t border-slate-850 pt-3 mt-3 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-500" id="onboarding-signals-preview">
              <div>
                <span className="text-slate-400">RESOLUTION:</span> {signals.screenResolution}
              </div>
              <div>
                <span className="text-slate-400">TIMEZONE:</span> {signals.timezone}
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">CANVAS_SALT:</span> {signals.canvasHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
