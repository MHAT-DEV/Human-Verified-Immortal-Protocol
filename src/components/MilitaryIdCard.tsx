import { useState } from 'react';
import { PlayerProfile, CountryInfo } from '../types';
import { Language } from '../i18n';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Orbit, 
  RotateCw, 
  ChevronRight, 
  UserCheck, 
  Trophy, 
  Award, 
  Activity, 
  Sparkles, 
  Globe, 
  Compass, 
  Fingerprint 
} from 'lucide-react';

interface MilitaryIdCardProps {
  profile: PlayerProfile;
  language: Language;
  countries: CountryInfo[];
  isPublicInspection?: boolean;
}

export default function MilitaryIdCard({ 
  profile, 
  language, 
  countries, 
  isPublicInspection = false 
}: MilitaryIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'bio' | 'performance' | 'loyalty' | 'medals'>('bio');

  // SOCIAL SHARE SYSTEM STATES
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [refFormat, setRefFormat] = useState<'square' | 'portrait' | 'landscape'>('landscape');
  const [refPreset, setRefPreset] = useState<'cosmic' | 'cyber' | 'immortal' | 'blood'>('cosmic');
  const [shareEvent, setShareEvent] = useState<string>('level_up');
  const [isDeployingShare, setIsDeployingShare] = useState(false);
  const [shareProg, setShareProg] = useState<string[]>([]);
  const [shareSuccessPlatform, setShareSuccessPlatform] = useState<string | null>(null);

  // Trigger synth bleep tone
  const playSound = (freq: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  const toggleFlip = () => {
    playSound(isFlipped ? 520 : 660);
    setIsFlipped(!isFlipped);
  };

  const handleInitializeProtocol = (platform: string) => {
    if (isDeployingShare) return;
    setIsDeployingShare(true);
    setShareProg([]);
    setShareSuccessPlatform(null);
    playSound(720);

    const logs = [
      `CRITICAL PATH: RESOLVING ${refFormat.toUpperCase()} RENDERING ENGINE...`,
      `INJECTING AGENT BIOMETRICS OF CALL SIGN: [${profile.nickname}]...`,
      `ASSEMBLING INFOGRAPHIC DATASETS FOR "${shareEvent.toUpperCase().replace('_', ' ')}"...`,
      `EXPORTING TEMPLATE MODEL WITH "${refPreset.toUpperCase()}" CONSTANTS...`,
      `DETERMINING PLATFORM CODES DIRECTORY TO "${platform.toUpperCase()}" METADATA...`,
      `COMMENCING SECURITY SEED HANDSHAKE...`,
      `TRANSMISSION SUCCESSFULLY SEALED AND DISPATCHED!`
    ];

    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx < logs.length) {
        setShareProg((prev) => [...prev, logs[currentIdx]]);
        playSound(420 + currentIdx * 50);
        currentIdx++;
      } else {
        clearInterval(timer);
        setIsDeployingShare(false);
        setShareSuccessPlatform(platform);
        playSound(880);
      }
    }, 450);
  };

  // 1. DETERMINE CARD COLOR DESIGN MAPPING BASED ON CURRENT PASSPORT RANK/LEVEL
  const getCardDesign = () => {
    const level = profile.rankLevel || 1;
    const score = profile.score || 0;

    if (level >= 100 || score >= 20000 || profile.rankName === 'Humanity Overlord') {
      return {
        cardClass: 'from-slate-950 via-zinc-900 to-amber-950 border-2 border-amber-500 shadow-amber-500/10',
        glowColor: 'amber',
        glowText: 'text-amber-400',
        bgGlow: 'bg-gradient-to-r from-amber-500 to-yellow-500',
        clearance: 'C6',
        badgeLabel: 'HUMANITY OVERLORD',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
        badgeText: 'text-amber-300',
        glowingBorder: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]'
      };
    }
    if (level >= 91) {
      return {
        cardClass: 'from-yellow-950 via-amber-900 to-yellow-950 border-2 border-yellow-400 shadow-yellow-500/15',
        glowColor: 'yellow',
        glowText: 'text-yellow-400',
        bgGlow: 'bg-gradient-to-r from-yellow-400 to-amber-400',
        clearance: 'C5',
        badgeLabel: 'HUMANITY CHAMPION',
        badgeBg: 'bg-yellow-950 text-yellow-300 border-yellow-500/50',
        badgeText: 'text-yellow-400',
        glowingBorder: 'shadow-[0_0_15px_rgba(234,179,8,0.25)]'
      };
    }
    if (level >= 76) {
      return {
        cardClass: 'from-rose-950 via-red-900 to-zinc-950 border-2 border-rose-600 shadow-rose-600/10',
        glowColor: 'rose',
        glowText: 'text-rose-400',
        bgGlow: 'bg-gradient-to-r from-red-500 to-rose-600',
        clearance: 'C4',
        badgeLabel: 'ELITE COMMANDER',
        badgeBg: 'bg-rose-950 text-rose-300 border-rose-500/40',
        badgeText: 'text-rose-400',
        glowingBorder: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]'
      };
    }
    if (level >= 51) {
      return {
        cardClass: 'from-indigo-950 via-purple-900 to-zinc-950 border border-purple-500 shadow-purple-500/10',
        glowColor: 'purple',
        glowText: 'text-purple-400',
        bgGlow: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        clearance: 'C3',
        badgeLabel: 'ANTI-BOT SPECIALIST',
        badgeBg: 'bg-purple-950 text-purple-300 border-purple-500/30',
        badgeText: 'text-purple-300',
        glowingBorder: 'shadow-[0_0_10px_rgba(168,85,247,0.15)]'
      };
    }
    if (level >= 26) {
      return {
        cardClass: 'from-slate-900 via-blue-900 to-zinc-950 border border-blue-500 shadow-blue-500/10',
        glowColor: 'blue',
        glowText: 'text-blue-400',
        bgGlow: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        clearance: 'C2',
        badgeLabel: 'FIELD AGENT',
        badgeBg: 'bg-blue-950 text-blue-300 border-blue-500/30',
        badgeText: 'text-blue-300',
        glowingBorder: 'shadow-[0_0_10px_rgba(59,130,246,0.15)]'
      };
    }
    if (level >= 11) {
      return {
        cardClass: 'from-green-950 via-emerald-900 to-zinc-950 border border-emerald-500 shadow-emerald-500/10',
        glowColor: 'emerald',
        glowText: 'text-emerald-400',
        bgGlow: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        clearance: 'C1',
        badgeLabel: 'VERIFIED HUMAN',
        badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500/30',
        badgeText: 'text-emerald-300',
        glowingBorder: 'shadow-[0_0_10px_rgba(16,185,129,0.15)]'
      };
    }
    // LEVEL 1 - 10 Fallback Grey Card
    return {
      cardClass: 'from-zinc-900 via-slate-800 to-zinc-950 border border-slate-700 shadow-slate-500/5',
      glowColor: 'slate',
      glowText: 'text-slate-400',
      bgGlow: 'bg-slate-500',
      clearance: 'C0',
      badgeLabel: 'UNVERIFIED HUMAN',
      badgeBg: 'bg-slate-950 text-slate-400 border-slate-800',
      badgeText: 'text-slate-400',
      glowingBorder: ''
    };
  };

  const scheme = getCardDesign();

  // Dynamic values
  const textTr = {
    displayName: language === 'en' ? 'BIO SIGNATURE NAME' : 'ชื่อวิทยาฐานะมนุษย์',
    alias: language === 'en' ? 'TACTICAL ALIAS' : 'รหัสรบสลับเสียงสะท้อน',
    humanId: language === 'en' ? 'HUMAN IP DEED ID' : 'รหัสรอยพิกัดชีวธรรม',
    agentNo: language === 'en' ? 'AGENT NUMBER' : 'บัญชีเลขทะเบียนกำลังพล',
    clearance: language === 'en' ? 'CLEARANCE LEVEL' : 'ระดับการตรวจสิทธิ์และกองกำลัง',
    deployment: language === 'en' ? 'DEPLOY STAT' : 'สถานะการประจำการรบ',
    specialization: language === 'en' ? 'SPECIALIZATION' : 'ความสามารถวิชาเฉพาะขั้นสูง',
    division: language === 'en' ? 'OPERATIVE DIVISION' : 'หมวดกองกำลังสังกัดล่อเป้า',
    unitCall: language === 'en' ? 'UNIT ASSIGNMENT' : 'กองร้อยประจำความต้านทาน',
    threat: language === 'en' ? 'THREAT EVAL' : 'คะแนนภัยคุกคามปัญญาประดิษฐ์',
    confidence: language === 'en' ? 'HUMAN CONFIDENCE INDEX' : 'เปอร์เซ็นต์ความเป็นมนุษย์',
    discipline: language === 'en' ? 'DISCIPLINARY ACTIONS' : 'ประวัติใบบันทึกคำตักเตือนทางทหาร',
    medals: language === 'en' ? 'LOYALTY MEDAL RACK' : 'คลังเหรียญเกียรติยศแท้',
    countryLoyalty: language === 'en' ? 'COUNTRY ALLIANCE RECORD' : 'บันทึกทัศนคติรักชาติผู้สู้ศึก',
    guildLoyalty: language === 'en' ? 'COOPERATIVE GUILD CONTRACTS' : 'บันทึกสัญญาเครือข่ายกิลด์',
    frontSide: language === 'en' ? 'DOSSIER CARD (FRONT)' : 'หน้าประชากร (FRONT)',
    backSide: language === 'en' ? 'BIOLATERAL PERFORMANCE (BACK)' : 'ประสิทธิภาพยีนชีวะ (BACK)'
  };

  const myCountry = countries.find(c => c.code === profile.country) || {
    flag: '🇺🇳', nameEn: 'Universal Alliance', nameTh: 'เครือข่ายสหวิทยาการโลก'
  };

  // Calculated combat efficiency rating based on stats
  const efficiency = Math.round(
    ((profile.stats?.accuracy || 95) * 1.5) + 
    (Math.min(10000, 10000 / Math.max(100, profile.stats?.fastestSolveMs || 2500)) * 2) +
    ((profile.stats?.captchaSolved || 0) * 0.1)
  );

  // Custom static dates mapped to humanId checksum
  const getDossierDates = () => {
    const sum = profile.humanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const day = (sum % 28) + 1;
    const month = (sum % 12);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      issue: `18-${months[month]}-2026`,
      expire: `18-${months[month]}-2031`,
      serviceNo: `S-SVN-${(sum * 7) % 90000 + 10000}-K`
    };
  };

  const datesObj = getDossierDates();
  const deviceClass = profile?.deviceType || 'DESKTOP';

  // Procedural QR pattern using binary representation based on humanId string
  const generateProceduralQr = () => {
    const rawSum = profile.humanId + scheme.clearance + profile.nickname;
    const blocks = [];
    for (let i = 0; i < 64; i++) {
      const bit = (rawSum.charCodeAt(i % rawSum.length) + i) % 2 === 0;
      blocks.push(bit);
    }
    return blocks;
  };

  const qrBits = generateProceduralQr();

  // Achievements medals list checklist builder
  const awardsList = [
    { id: 'medal_boot', label: 'Agency Enrolled', desc: 'Validated Human Onboarding Protocol', icon: '🎖️', checked: true },
    { id: 'medal_solves_10', label: 'Bot Annihilator I', desc: 'Decommissioned over 10 distinct CAPTCHA threats', icon: '🎗️', checked: (profile.stats?.captchaSolved || 0) >= 10 },
    { id: 'medal_solves_50', label: 'Bot Annihilator II', desc: 'Decommissioned over 50 distinct CAPTCHA threats', icon: '🥉', checked: (profile.stats?.captchaSolved || 0) >= 50 },
    { id: 'medal_accuracy', label: 'Retinal Precision', desc: 'Maintained accuracy standard over 93%', icon: '🥇', checked: (profile.stats?.accuracy || 0) >= 93 },
    { id: 'medal_speed', label: 'Cyber Speed Demon', desc: 'Fitted response resolution under 1500ms', icon: '🚀', checked: (profile.stats?.fastestSolveMs > 0 && profile.stats?.fastestSolveMs <= 1500) },
    { id: 'medal_boss', label: 'Iron Core Breaker', desc: 'Dealt damage to World Anti-Human boss servers', icon: '🪐', checked: (profile.stats?.bossDamage || 0) > 500 },
    { id: 'medal_nation', label: 'Patriot Commander', desc: 'Devoted actions to national alignment scoreboard', icon: '🛡️', checked: (profile.stats?.countryContribution || 0) >= 1000 },
    { id: 'medal_immortal', label: 'Cognitive Immortal', desc: 'Cleared CAPTCHAs of extreme infinite scale', icon: '👑', checked: scheme.clearance === 'C6' || profile.stats?.insaneCount > 5 }
  ];

  return (
    <div className="space-y-6 max-w-xl lg:max-w-5xl mx-auto w-full" id="military-id-system">
      
      {/* 1. SECTOR TOGGLE CONTROLS */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-2xl border border-slate-800 gap-4" id="card-control-dock">
        <span className="text-[10px] font-mono font-bold text-slate-400 pl-2 tracking-widest flex items-center gap-1.5 uppercase shrink-0">
          <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse animate-pulse-slow" />
          {isFlipped ? textTr.backSide : textTr.frontSide}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowShareOverlay(true); playSound(550); }}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-[10px] font-black px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/20 border border-amber-500/30 font-bold"
            id="btn-open-sharer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>SHARE INFOGRAPHIC</span>
          </button>

          <button
            onClick={toggleFlip}
            className="bg-slate-950 hover:bg-slate-850 text-slate-300 font-mono text-[10px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-800"
            id="btn-rotate-military-id"
          >
            <RotateCw className="w-3 h-3 animate-spin-slow" />
            <span>{language === 'en' ? 'FLIP CARD' : 'หมุนบัตร'}</span>
          </button>
        </div>
      </div>

      {/* 2. THE HOLOGRAM MILITARY CARD WRAPPER */}
      <div 
        className={deviceClass === 'DESKTOP' 
          ? "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full" 
          : deviceClass === 'TABLET'
          ? "space-y-4 w-full"
          : `relative rounded-3xl p-6 md:p-8 bg-gradient-to-br ${scheme.cardClass} relative overflow-hidden transition-all duration-300 ${scheme.glowingBorder}`}
        style={deviceClass === 'DESKTOP' || deviceClass === 'TABLET' ? {} : { minHeight: '380px' }}
        id="hologram-card-stage"
      >
        {/* Animated matrix scanline overlay (only on mobile) */}
        {deviceClass === 'MOBILE' && (
          <>
            <div className="absolute inset-0 bg-matrix-pats opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scanline pointer-events-none" />
          </>
        )}
        
        {/* Background HVA Seal watermark (only on mobile) */}
        {deviceClass === 'MOBILE' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none animate-pulse-slow">
            <Orbit className="w-72 h-72 text-white animate-spin-slow" />
          </div>
        )}

        {/* ================= FRONT SIDE PORTRAIT DOSSIER CARD ================= */}
        {(deviceClass === 'DESKTOP' || deviceClass === 'TABLET' || !isFlipped) && (
          <div 
            className={deviceClass === 'DESKTOP' || deviceClass === 'TABLET'
              ? `relative rounded-3xl p-6 md:p-8 bg-gradient-to-br ${scheme.cardClass} relative overflow-hidden transition-all duration-300 ${scheme.glowingBorder} w-full`
              : "space-y-5 animate-fadeIn relative"}
            style={deviceClass === 'DESKTOP' || deviceClass === 'TABLET' ? { minHeight: '380px' } : {}}
            id="card-front-panel"
          >
            {/* Embedded scanline overlay for desktop/tablet */}
            {(deviceClass === 'DESKTOP' || deviceClass === 'TABLET') && (
              <>
                <div className="absolute inset-0 bg-matrix-pats opacity-5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scanline pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <Orbit className="w-72 h-72 text-white animate-spin-slow" />
                </div>
              </>
            )}
            
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 relative z-10" id="front-header">
              <div className="space-y-1">
                <span className="text-[9px] font-mono bg-white/5 border border-white/15 text-slate-300 px-2 py-0.5 rounded uppercase tracking-widest block font-bold max-w-max">
                  {language === 'en' ? 'HUMAN VERIFICATION AGENCY' : 'หน่วยคุ้มสิทธิ์ยีนส์มนุษย์โลก'}
                </span>
                <h1 className="text-base font-extrabold font-mono text-slate-100 tracking-tight tracking-wider">
                  CLASSIFIED MILITARY ID
                </h1>
              </div>

              {/* Clearance Badge Stamp */}
              <div className="flex flex-col items-center shrink-0" id="clearance-stamp-slot">
                <span className={`text-xl font-mono font-black border-2 border-dashed px-2.5 py-1 rounded bg-black/40 ${scheme.glowText}`} style={{ borderColor: 'currentColor' }}>
                  {scheme.clearance}
                </span>
                <span className="text-[7px] font-mono text-slate-400 mt-1 uppercase tracking-widest">{language === 'en' ? 'CLEARANCE' : 'สิทธิ์ผ่านวิกฤต'}</span>
              </div>
            </div>

            {/* Profile Grid (Avatar and Primary military specs) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10" id="front-grids">
              
              {/* Left Column: Neon Wireframe Portrait Box with micro-gauges */}
              <div className="space-y-2 flex flex-col items-center sm:items-stretch" id="portrait-block-segment">
                <div className="w-32 h-36 bg-black/60 border border-slate-700/80 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner group">
                  
                  {/* Neon procedural blueprint avatar rendering of human visage via SVG */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-emerald-400/80 group-hover:text-amber-400 transition-colors duration-300 drop-shadow-[0_0_5px_currentColor]" id="procedural-avatar-svg">
                    <circle cx="50" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                    {/* Retro scanning targeting chevrons */}
                    <path d="M50,15 L50,8 M50,55 L50,62 M25,35 L12,35 M88,35 L75,35" stroke="currentColor" strokeWidth="1" />
                    {/* Visual eye cameras coordinate alignment lock */}
                    <circle cx="43" cy="33" r="1" fill="currentColor" />
                    <circle cx="57" cy="33" r="1" fill="currentColor" />
                    <path d="M44,42 Q50,45 56,42" fill="none" stroke="currentColor" strokeWidth="1" />
                    {/* Shoulder brackets representing military armor plating */}
                    <path d="M20,78 Q50,60 80,78 L80,95 L20,95 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    {/* Hologram lock brackets */}
                    <path d="M8,15 L8,8 L15,8" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M92,15 L92,8 L85,8" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M8,85 L8,92 L15,92" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M92,85 L92,92 L85,92" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  
                  {/* Portrait scan bar indicator */}
                  <div className="absolute left-0 w-full h-0.5 bg-emerald-500/60 animate-glowing-portrait-bar flex pointer-events-none" />
                  <span className="absolute bottom-1 bg-black/85 text-[7px] font-mono border border-slate-800 text-slate-500 px-1 py-0.5 rounded-full uppercase scale-95 tracking-tight">
                    BIOLOGICAL GEN-V
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-0.5" id="unit-dossier-labels">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{textTr.unitCall}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase leading-none block">
                    {profile.stats?.captchaSolved >= 75 ? 'ALPHA COUNTER STRIKE' : 'RECRUIT OUTBREAK WING'}
                  </span>
                </div>
              </div>

              {/* Right Columns: Primary Classification dossier variables */}
              <div className="sm:col-span-2 space-y-3 font-mono" id="passport-details-front">
                
                {/* 1. Locked Nickname / Call Sign */}
                <div className="grid grid-cols-2 gap-1 border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">TACTICAL CALL SIGN (LOCKED)</span>
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      {profile.nickname}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.alias}</span>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                      {profile.activeBadge || 'BIOAGENT_01'}
                    </span>
                  </div>
                </div>

                {/* 2. Permanent Human ID & Service Account Code */}
                <div className="grid grid-cols-2 gap-1 border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.humanId}</span>
                    <span className="text-[11px] font-black text-slate-100 tracking-tight">
                      {profile.humanId || 'HUMAN-G3841F'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase text-slate-500">{textTr.agentNo}</span>
                    <span className="text-[10px] text-slate-300 font-bold block">
                      HVA-{profile.country}-{profile.humanId ? profile.humanId.split('-')[1] : '8F2A91'}
                    </span>
                  </div>
                </div>

                {/* 3. Loyalty Affiliated Countries and Guild units */}
                <div className="grid grid-cols-2 gap-1 border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">NATION ALLEGIANCE</span>
                    <span className="text-xs text-slate-100 font-bold flex items-center gap-1.5">
                      <span>{myCountry.flag}</span>
                      <span className="truncate">{language === 'en' ? myCountry.nameEn : myCountry.nameTh}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">GUILD COALITION</span>
                    <span className="text-xs font-bold text-emerald-400 truncate block">
                      {profile.guildMembership ? `<${profile.guildMembership}>` : '[NO CURRENT REGIMENT]'}
                    </span>
                  </div>
                </div>

                {/* 4. Military Roles and deployment statuses */}
                <div className="grid grid-cols-2 gap-1 pt-1">
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.deployment}</span>
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {profile.deploymentStatus || (profile.stats?.captchaSolved >= 100 ? 'LEGENDARY' : 'ACTIVE')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">SERVICE SERVICE ID</span>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {datesObj.serviceNo}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Security features - Barcodes, microprints, issue stamps */}
            <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono relative z-10" id="card-front-foot flex">
              <div className="flex gap-4 text-[8px] text-slate-500" id="card-front-dates-set">
                <div>
                  <span className="block font-bold">DATE OF INCORPORATION</span>
                  <span className="text-slate-400 block">{datesObj.issue}</span>
                </div>
                <div>
                  <span className="block font-bold">BIOLOGICAL EXPIRY</span>
                  <span className="text-slate-400 block">{datesObj.expire}</span>
                </div>
                <div>
                  <span className="block font-bold">DIGITAL CHIP SIGNATURE</span>
                  <span className="text-slate-400 font-mono block">VERIFIED_HVA_GEN_V8</span>
                </div>
              </div>

              {/* Simulated barcode using SVGs of diverse heights and gaps */}
              <div className="bg-slate-950 p-2 rounded-xl flex items-center gap-3 border border-slate-800" id="security-barcode-segment">
                <div className="flex items-center space-y-0.5 flex-col" id="barcode-display">
                  <div className="flex h-5 items-end justify-center gap-0.5" id="barcode-lines">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 4].map((width, idx) => (
                      <div key={idx} className="bg-slate-300 h-full shrink-0" style={{ width: `${width}px` }} />
                    ))}
                  </div>
                  <span className="text-[7px] text-slate-500 font-mono tracking-widest">{profile.humanId || 'HUMAN8F2A'}</span>
                </div>

                {/* Animated micro holographic dynamic stamp */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-yellow-400 p-0.5 animate-spin-slow rotate-45 relative flex items-center justify-center opacity-75 sm:opacity-100" id="security-hologram-notch">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[7px] text-cyan-400 font-bold font-mono">
                    HVA
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tablet Expansion Toggler */}
        {deviceClass === 'TABLET' && (
          <button 
            type="button"
            onClick={() => { setIsExpanded(!isExpanded); playSound(600); }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-[10px] font-bold py-3.5 px-4 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-md uppercase shrink-0"
            id="btn-tablet-expand"
          >
            {isExpanded ? "Collapse Passport Performance Record ▲" : "Expand Bio-Performance & Loyalty Records ▼"}
          </button>
        )}

        {/* ================= BACK SIDE BIOLATERAL PERFORMANCE MATRIX ================= */}
        {(deviceClass === 'DESKTOP' || (deviceClass === 'TABLET' && isExpanded) || (deviceClass === 'MOBILE' && isFlipped)) && (
          <div 
            className={deviceClass === 'DESKTOP' || deviceClass === 'TABLET'
              ? `relative rounded-3xl p-6 md:p-8 bg-gradient-to-br ${scheme.cardClass} relative overflow-hidden transition-all duration-300 ${scheme.glowingBorder} w-full text-xs`
              : "space-y-4 animate-fadeIn text-xs relative"}
            style={deviceClass === 'DESKTOP' || deviceClass === 'TABLET' ? { minHeight: '380px' } : {}}
            id="card-back-panel"
          >
            {/* Embedded scanline overlay for desktop/tablet back */}
            {(deviceClass === 'DESKTOP' || deviceClass === 'TABLET') && (
              <>
                <div className="absolute inset-0 bg-matrix-pats opacity-5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scanline pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <Orbit className="w-72 h-72 text-white animate-spin-slow" />
                </div>
              </>
            )}
            
            {/* Header section back */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3" id="back-header">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                <h3 className="text-xs font-bold font-mono text-slate-200 tracking-wider">
                  BIOMETRIC PERFORMANCE DEED & LOYALTY RECORDS
                </h3>
              </div>

              {/* Flip indicator */}
              <span className={`text-[8px] font-mono uppercase bg-slate-950/80 ${scheme.glowText} border border-slate-800 px-2 py-0.5 rounded-full`}>
                CARD KEY #A91-Z
              </span>
            </div>

            {/* Back Sub navigation for data categories */}
            <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-900 overflow-x-auto gap-0.5 shrink-0 scrollbar-none" id="back-tab-navigation">
              {[
                { id: 'bio', label: language === 'en' ? 'BIO-PERF' : 'คลื่นสมอง' },
                { id: 'performance', label: language === 'en' ? 'STATS' : 'ประวัติวิจัย' },
                { id: 'loyalty', label: language === 'en' ? 'LOYALTY' : 'บันทึกจงรักภักดี' },
                { id: 'medals', label: language === 'en' ? 'MEDALS' : 'เหรียญศึก' }
              ].map((bTab) => (
                <button
                  key={bTab.id}
                  onClick={() => { setActiveTab(bTab.id as any); playSound(420); }}
                  className={`flex-1 text-[9px] font-mono font-bold py-1 px-2.5 rounded transition ${activeTab === bTab.id ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  id={`btn-back-tab-${bTab.id}`}
                >
                  {bTab.label}
                </button>
              ))}
            </div>

            {/* Back Category contents box */}
            <div className="bg-slate-950/50 rounded-2xl border border-slate-850 p-4 space-y-3 min-h-48 overflow-y-auto scrollbar-none flex flex-col justify-between" id="back-stage-content">
              
              {/* TAB 1: BIO AND INTELLIGENCE CLASSIFICATIONS */}
              {activeTab === 'bio' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono" id="subtab-bio">
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">{textTr.confidence}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">
                          {((profile.stats?.accuracy || 95) + (profile.trustScore || 100) / 20 * 0.1).toFixed(2)}% Human
                        </span>
                        <span className="text-[7.5px] bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10">AUTHENTIC</span>
                      </div>
                      
                      {/* Visual meter */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full border border-slate-800 p-0.5">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all" 
                          style={{ width: `${Math.min(100, profile.stats?.accuracy || 95)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">Threat Assessment Level</span>
                      <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        profile.trustScore < 60 ? 'text-red-400' : profile.trustScore < 85 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {profile.trustScore < 40 
                          ? 'POTENTIAL ROBOT' 
                          : profile.trustScore < 65 
                          ? 'UNDER OBSERVED REVIEW' 
                          : profile.trustScore < 85 
                          ? 'MINOR SUSPICION' 
                          : 'NO THREAT IDENTIFIED'}
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-l border-white/5 pl-4 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">{textTr.specialization}</span>
                      <span className="text-xs text-indigo-400 font-bold block uppercase">{profile.specialization || 'Image Analysis & Retinal Decoupling'}</span>
                    </div>

                    <span className="text-[8.5px] text-slate-500 leading-tight uppercase font-mono block">
                      Note: Bio-signals are refreshed live via neural canvas hand-shakes. Anti-bot microtext algorithms active.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: IN-GAME HISTORIC STATISTICS MATRIX */}
              {activeTab === 'performance' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[10px]" id="subtab-perf">
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl relative" id="perf-stat-card-acc">
                    <span className="text-[8px] text-slate-500 block">SOLVE ACCURACY</span>
                    <span className="text-xs font-bold text-slate-100">{profile.stats?.accuracy || 95}%</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl" id="perf-stat-card-speed">
                    <span className="text-[8px] text-slate-500 block">RAPID INTENSITY</span>
                    <span className="text-xs font-bold text-amber-400">{profile.stats?.fastestSolveMs || 2450} ms</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl" id="perf-stat-card-solves">
                    <span className="text-[8px] text-slate-500 block">TOTAL SOLVES</span>
                    <span className="text-xs font-bold text-slate-100">{profile.stats?.captchaSolved || 0} CAPTCHAs</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl" id="perf-stat-card-streak">
                    <span className="text-[8px] text-slate-500 block">SURVIVAL STREAK</span>
                    <span className="text-xs font-bold text-indigo-400">{profile.stats?.longestStreak || 0} Streak</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl" id="perf-stat-card-boss">
                    <span className="text-[8px] text-slate-500 block">BOSS SEVERANCE</span>
                    <span className="text-xs font-bold text-rose-400">{profile.stats?.bossDamage || 0} Dmg</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 border border-slate-800 rounded-xl" id="perf-stat-card-matches">
                    <span className="text-[8px] text-slate-500 block">TOTAL COMBATS</span>
                    <span className="text-xs font-bold text-slate-100">{profile.stats?.matchesPlayed || 0} Combats</span>
                  </div>
                </div>
              )}

              {/* TAB 3: LOYALTY HISTORY & AUDIT PATH SECTOR */}
              {activeTab === 'loyalty' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[9px]" id="subtab-loyalty">
                  
                  {/* Nation transfer tracker */}
                  <div className="space-y-2 border-r border-white/5 pr-3" id="country-loyalty-logs">
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.countryLoyalty}</span>
                    <div className="space-y-1 block max-h-24 overflow-y-auto scrollbar-none" id="country-history-scroller">
                      <div className="text-[9px] text-slate-400 flex items-center justify-between">
                        <span>Original Citizenship:</span>
                        <span className="text-slate-200">TH (Thailand)</span>
                      </div>
                      
                      {profile.countryHistory && profile.countryHistory.length > 0 ? (
                        profile.countryHistory.map((ch, idx) => (
                          <div key={idx} className="text-[9px] text-slate-500 border-t border-slate-900 pt-1 flex items-center justify-between">
                            <span>Transferred {ch.fromCountry} &rarr; {ch.toCountry}</span>
                            <span>{ch.date}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[8px] text-slate-600 block pt-1 uppercase">No country migrations recorded. Passport pristine.</div>
                      )}
                    </div>
                  </div>

                  {/* Guild commitment records */}
                  <div className="space-y-2 pl-1" id="guild-loyalty-logs">
                    <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.guildLoyalty}</span>
                    <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-none" id="guild-history-scroller">
                      {profile.guildJoinDate && (
                        <div className="text-[8px] text-slate-400 pb-1 flex justify-between">
                          <span>REGIMENT EMBARKED:</span>
                          <span className="font-bold text-emerald-400">ACTIVE COMMITMENT</span>
                        </div>
                      )}

                      {profile.guildHistory && profile.guildHistory.length > 0 ? (
                        profile.guildHistory.map((gh, idx) => (
                          <div key={idx} className="text-[8px] text-slate-500 border-b border-slate-900 pb-1 flex items-center justify-between">
                            <span>{gh.action} {gh.guildName}</span>
                            <span>{gh.date}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[8px] text-slate-600 block uppercase">No prior guild deployments recorded. Standard citizen.</div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: DECORATED MEDALS IN THE CABINET */}
              {activeTab === 'medals' && (
                <div className="space-y-2 font-mono" id="subtab-medals">
                  <span className="text-[8px] text-slate-500 block font-bold uppercase">{textTr.medals}</span>
                  
                  <div className="grid grid-cols-4 gap-2" id="medals-box-cabinet">
                    {awardsList.map((aw) => (
                      <div 
                        key={aw.id} 
                        className={`p-1.5 border rounded-xl flex flex-col items-center text-center justify-center relative transition transition-all ${
                          aw.checked 
                            ? 'bg-slate-900 border-emerald-500/30 text-emerald-300' 
                            : 'bg-slate-950 border-slate-900/60 text-slate-700 opacity-40'
                        }`}
                        title={`${aw.label}: ${aw.desc}`}
                        id={`medal-${aw.id}`}
                      >
                        <span className="text-xl block">{aw.icon}</span>
                        <span className="text-[7.5px] font-bold block truncate max-w-full leading-none mt-1">
                          {aw.label.split(' ')[0]}
                        </span>
                        {aw.checked && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black flex items-center justify-center text-[5px] text-white">
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic threat and disciplinary log box inside BACK STAGE FOOT */}
              <div className="border-t border-white/5 pt-2 flex flex-col sm:flex-row items-center justify-between text-[8px] text-slate-500" id="back-stage-foot-box">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-slate-500 uppercase">{textTr.discipline}</span>
                  <p className="text-slate-400">
                    {profile.disciplinaryRecord && profile.disciplinaryRecord.length > 0 
                      ? profile.disciplinaryRecord[profile.disciplinaryRecord.length - 1] 
                      : 'NO SIGNAL VIOLATIONS LOGGED. CITIZEN STATUS: EXTREMELY HUMANE'}
                  </p>
                </div>
                
                {/* Visual authenticity seal */}
                <span className="text-[7.5px] font-mono tracking-widest bg-emerald-950/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/10 shrink-0 font-bold mt-2 sm:mt-0 uppercase">
                  ✓ PASSPORT OFFICIALLY DECLARED
                </span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 3. FOOTER EXPLANATION NOTE */}
      <div className="text-slate-500 text-[9px] font-mono leading-relaxed text-center py-1 uppercase" id="card-disclaimer-foot">
        ⚠ Classified Document. This human ID is procedurally tied with current computer browser signature values and locked permanently.
      </div>

      {/* ================= ESPORTS SOCIAL SHARING & INFOGRAPHICS MODAL OVERLAY ================= */}
      {showShareOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto uppercase font-mono" id="esports-share-modal-overlay">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden" id="esports-briefcase-frame">
            
            {/* Ambient grid background markings */}
            <div className="absolute inset-0 bg-matrix-pats opacity-5 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 relative z-10" id="share-modal-header">
              <div className="space-y-1">
                <span className="text-[9px] text-amber-400 font-extrabold tracking-widest block bg-amber-950/40 border border-amber-900/20 px-2 py-0.5 rounded max-w-max">
                  HVA MARKETING & RECRUITMENT NETWORK
                </span>
                <h2 className="text-base font-black text-slate-100 tracking-wider">
                  AUTO-GENERATED ESPORTS INFOGRAPHIC CODES
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowShareOverlay(false);
                  setShareSuccessPlatform(null);
                  setShareProg([]);
                  playSound(220);
                }}
                className="text-slate-400 hover:text-white text-sm font-bold border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-xl transition cursor-pointer"
                id="btn-close-sharer-modal"
              >
                &times; CLOSE
              </button>
            </div>

            {/* Split controls and preview layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10" id="share-modal-body">
              
              {/* LEFT COMBAT CONTROL PANEL (6 columns) */}
              <div className="lg:col-span-5 space-y-5" id="share-control-board">
                
                {/* 1. SELECT ESPORTS INFOGRAPHIC EVENT TYPE */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 block">1. SELECT SHAREABLE AGENT EVENT</label>
                  <select
                    value={shareEvent}
                    onChange={(e) => { setShareEvent(e.target.value); playSound(380); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="level_up">Level Up (Lvl {profile.rankLevel || 1})</option>
                    <option value="rank_up">Rank Up ({profile.rankName || 'Verified Citizen'})</option>
                    <option value="win_streak">Win Streak ({profile.stats?.longestStreak || 0} consecutive rounds)</option>
                    <option value="boss_damage">Boss Damage Record ({profile.stats?.bossDamage || 500} server damage)</option>
                    <option value="country_milestone">Country Milestone ({myCountry.flag} allegiance representative)</option>
                    <option value="achievement">Achievement Unlock (Retinal Validation cleared)</option>
                  </select>
                </div>

                {/* 2. INFOGRAPHIC GRAPHIC FORMAT ASPECT */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 block">2. FORMAT EXPORT SPECIFICATION</label>
                  <div className="grid grid-cols-3 gap-2" id="format-ratio-buttons">
                    {[
                      { id: 'square', label: 'SQUARE 1:1', desc: '1080x1080 (Insta/Discord)' },
                      { id: 'portrait', label: 'PORTRAIT 9:16', desc: '1080x1920 (TikTok/Stories)' },
                      { id: 'landscape', label: 'LANDSCAPE 16:9', desc: '1200x630 (X/Reddit/FB)' }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => { setRefFormat(fmt.id as any); playSound(420); }}
                        className={`p-2.5 rounded-xl border font-mono text-center transition flex flex-col justify-center items-center cursor-pointer ${
                          refFormat === fmt.id 
                            ? 'bg-slate-950 border-amber-500 text-amber-300 font-extrabold' 
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950 text-slate-500'
                        }`}
                        id={`btn-fmt-${fmt.id}`}
                      >
                        <span className="text-[10px] block leading-none">{fmt.label}</span>
                        <span className="text-[7px] text-slate-500 block leading-none mt-1">{fmt.desc.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. ESPORTS PRESET THEMES CODES */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 block">3. THEME / CHROMATIC VARIANT</label>
                  <div className="grid grid-cols-2 gap-2" id="theme-color-variants">
                    {[
                      { id: 'cosmic', label: 'COSMIC SLATE', fill: 'bg-emerald-500' },
                      { id: 'cyber', label: 'TACTICAL CYBER', fill: 'bg-green-500' },
                      { id: 'immortal', label: 'IMMORTAL GOLD', fill: 'bg-amber-400' },
                      { id: 'blood', label: 'BLOOD DECOY', fill: 'bg-rose-600' }
                    ].map((pre) => (
                      <button
                        key={pre.id}
                        onClick={() => { setRefPreset(pre.id as any); playSound(480); }}
                        className={`p-2 rounded-xl border transition flex items-center gap-2 cursor-pointer ${
                          refPreset === pre.id 
                            ? 'bg-slate-950 border-slate-700 text-white font-extrabold' 
                            : 'bg-slate-950/40 border-slate-850 text-slate-400'
                        }`}
                        id={`btn-pre-${pre.id}`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${pre.fill} shrink-0`} />
                        <span className="text-[8.5px] tracking-tight">{pre.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. SEVERE WARNING ACCREDITATION STATS */}
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-[9px] text-slate-500 leading-normal" id="share-disclaimer-panel">
                  <span className="text-amber-400 font-extrabold block uppercase mb-1">✓ AUTHENTIC INTEGRATED LINK ATTACHED</span>
                  <span>EVERY INDIVIDUAL INFOGRAPHIC EMBEDS YOUR VERIFIABLE RECRUITMENT CODE TO AUTOMATICALLY RETRIEVE COMMISSIONS AND MULTIPLY TEAM WORLD-RANK ROSTER STANDINGS.</span>
                </div>

              </div>

              {/* RIGHT PREVIEW DOCK (7 columns) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/40 p-4 rounded-3xl border border-slate-850 relative" id="infographic-stage">
                
                <span className="text-[8px] text-slate-500 tracking-widest uppercase font-bold absolute top-3 left-4">LIVE RENDER PREVIEW CONTROLLER</span>

                {/* Simulated frame size wrapper holding preview card */}
                <div className="flex items-center justify-center p-6 w-full overflow-hidden" style={{ minHeight: '380px' }} id="scaled-preview-container-box">
                  <div 
                    className={`border-4 border-dashed uppercase relative p-5 transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl ${
                      refFormat === 'portrait' ? 'w-[260px] h-[390px] text-[8px]' : refFormat === 'square' ? 'w-[320px] h-[320px] text-[9px]' : 'w-[440px] h-[240px] text-[9px]'
                    } ${
                      refPreset === 'cosmic' ? 'bg-slate-950 border-emerald-500/60 shadow-emerald-500/5' : 
                      refPreset === 'cyber' ? 'bg-slate-950 border-green-500/60 shadow-green-500/5' :
                      refPreset === 'immortal' ? 'bg-zinc-950 border-yellow-500/60 shadow-yellow-500/5' :
                      'bg-stone-950 border-rose-600/60 shadow-rose-600/5'
                    }`}
                    id="modal-infographic-preview-canvas"
                  >
                    {/* Simulated diagonal overlay text to make it look extremely premium like esports screens */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none transform -rotate-12 uppercase text-6xl font-black text-white leading-none">
                      HUMAN VERIFIED
                    </div>

                    {/* Esports infographic Header */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10" id="preview-mini-header">
                      <div className="space-y-0.5">
                        <span className={`text-[7px] tracking-widest font-extrabold uppercase ${
                          refPreset === 'cosmic' ? 'text-emerald-400' : refPreset === 'cyber' ? 'text-green-400' : refPreset === 'immortal' ? 'text-yellow-400' : 'text-rose-500'
                        }`}>HUMAN AGENCY VERIFIED</span>
                        <h4 className="text-white font-extrabold tracking-tight">INFOGRAPHIC DOSSIER STATUS</h4>
                      </div>
                      <span className="bg-white/5 border border-white/10 text-white font-bold px-1.5 py-0.5 rounded text-[8px]">HVA_{scheme.clearance}</span>
                    </div>

                    {/* Hero Event Description center text block */}
                    <div className="my-auto space-y-2 relative z-10 text-center uppercase" id="preview-hero-content">
                      <span className="text-[7.5px] text-slate-500 font-bold block tracking-widest uppercase">ESPORTS MAJOR ACHIEVEMENT</span>
                      
                      {/* Live variable event texts */}
                      {shareEvent === 'level_up' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">LEVEL UP SUCCESSFUL</h2>
                          <p className="text-slate-400 text-[10px]">REACHED COMMAND RATE: <span className="text-yellow-400 font-extrabold font-mono">LEVEL {profile.rankLevel || 1}</span></p>
                        </div>
                      )}

                      {shareEvent === 'rank_up' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">RANK STATUS PROMOTED</h2>
                          <p className="text-slate-400 text-[10px]">&quot;{profile.rankName || 'Verified Citizen'}&quot; ACTIVE LICENSE</p>
                        </div>
                      )}

                      {shareEvent === 'win_streak' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">IMMORTAL SURVIVED</h2>
                          <p className="text-slate-400 text-[10px]">RECORD SURVIVAL: <span className="text-rose-400 font-bold font-mono">{profile.stats?.longestStreak || 0} ROUNDS</span></p>
                        </div>
                      )}

                      {shareEvent === 'boss_damage' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">BOSS SERVERS SEVERED</h2>
                          <p className="text-slate-400 text-[10px]">RECORD IMPACT: <span className="text-indigo-400 font-mono font-bold">{profile.stats?.bossDamage || 500} DIRECT DAMAGE</span></p>
                        </div>
                      )}

                      {shareEvent === 'country_milestone' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">{myCountry.flag} COLO-NATION GLORY</h2>
                          <p className="text-slate-400 text-[10px]">DEVOTION EFFICIENCIES: <span className="text-emerald-400 font-bold font-mono">{profile.stats?.countryContribution || 1200} POINTS</span></p>
                        </div>
                      )}

                      {shareEvent === 'achievement' && (
                        <div className="space-y-1">
                          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tighter leading-none">BIOMETRIC UNLOCKED</h2>
                          <p className="text-slate-400 text-[10px]">AUTHENTIC RETINA METRICS LOGGED AND SANITIZED</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Esports Stats Table */}
                    <div className="border-t border-white/5 pt-2 flex items-center justify-between relative z-10 text-[7px]" id="preview-infographic-table">
                      <div className="space-y-0.5 text-left">
                        <span className="text-slate-500 block uppercase font-bold">TACTICAL BRIEF IDENTIFIER</span>
                        <span className="text-white font-bold block uppercase">{profile.nickname} #{profile.humanId.split('-')[1]}</span>
                      </div>
                      
                      <div className="space-y-0.5 text-center">
                        <span className="text-slate-500 block uppercase font-bold">RECRUIT CODE</span>
                        <span className="text-amber-400 font-bold block tracking-wider">{profile.humanId}</span>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <span className="text-slate-500 block uppercase font-bold">SOLVE RESOLUTION</span>
                        <span className="text-white font-extrabold block">{(profile.stats?.accuracy || 95).toFixed(1)}% ACC</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Real-time simulated digital compiler logging terminal */}
                {shareProg.length > 0 && (
                  <div className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-1 text-[8.5px] text-slate-400 max-h-36 overflow-y-auto scrollbar-none font-mono" id="simulated-sharing-log-box">
                    <span className="text-indigo-400 text-[9px] font-black uppercase flex items-center gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      ESPORTS COMPILATION CHANNEL DISPATCH LOGS
                    </span>
                    {shareProg.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-indigo-600 font-bold">HOST-{100 + idx} &gt;</span>
                        <span className="text-slate-300 font-semibold">{log}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

            {/* SECTOR 3: SOCIAL PLATFORM LAUNCH DISPATCH PORT (ROW OF BUTTONS) */}
            <div className="border-t border-slate-800 pt-6 space-y-4" id="social-deployment-port">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-slate-400" id="platform-heading">
                <span className="font-extrabold tracking-wider uppercase text-slate-300 block">⚡ 4. REGISTER DISPATCH TARGET CHANNEL PLATFORM</span>
                <span>CHOOSE PLATFORM TO EMIT ENCRYPTED RENDER PNG AND RECRUIT TEAM PLAYERS</span>
              </div>

              {/* Launcher row of authentic circular buttons */}
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3 text-slate-300 font-black font-mono text-[9px]" id="social-dispatch-icons-grid">
                {[
                  { name: 'X / Twitter', color: 'hover:bg-slate-950 hover:border-white hover:text-white', brandColor: 'text-white' },
                  { name: 'Facebook', color: 'hover:bg-blue-900 hover:border-blue-500 hover:text-blue-200', brandColor: 'text-blue-400' },
                  { name: 'Instagram', color: 'hover:bg-pink-900 hover:border-pink-500 hover:text-pink-200', brandColor: 'text-pink-400' },
                  { name: 'Threads', color: 'hover:bg-zinc-950 hover:border-white hover:text-white', brandColor: 'text-white' },
                  { name: 'TikTok', color: 'hover:bg-purple-950 hover:border-purple-400 hover:text-purple-200', brandColor: 'text-purple-400' },
                  { name: 'Discord', color: 'hover:bg-indigo-900 hover:border-indigo-500 hover:text-indigo-200', brandColor: 'text-indigo-400' },
                  { name: 'Telegram', color: 'hover:bg-sky-900 hover:border-sky-500 hover:text-sky-200', brandColor: 'text-sky-400' },
                  { name: 'WhatsApp', color: 'hover:bg-emerald-900 hover:border-emerald-500 hover:text-emerald-200', brandColor: 'text-emerald-400' },
                  { name: 'Reddit', color: 'hover:bg-orange-950 hover:border-orange-500 hover:text-orange-200', brandColor: 'text-orange-400' },
                  { name: 'LINE', color: 'hover:bg-green-900 hover:border-green-500 hover:text-green-200', brandColor: 'text-green-400' }
                ].map((plat) => (
                  <button
                    key={plat.name}
                    disabled={isDeployingShare}
                    onClick={() => handleInitializeProtocol(plat.name)}
                    className={`p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col justify-center items-center text-center transition cursor-pointer font-bold ${plat.color} disabled:opacity-40`}
                    title={`Transmit to ${plat.name}`}
                    id={`btn-deploy-${plat.name.split(' ')[0]}`}
                  >
                    <span className="text-xs">&#11088;</span>
                    <span className="text-[7.5px] block truncate max-w-full leading-none mt-1 text-slate-400">{plat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* SUCCESS MESSAGE BANNER */}
              {shareSuccessPlatform && (
                <div className="p-4 bg-emerald-950/20 text-emerald-300 text-xs border border-emerald-500/25 rounded-2xl animate-bounce flex justify-between items-center" id="sharing-success-notif">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <span>
                      <strong>TRANSMISSION LOG:</strong> OUTGOING FILE SUCCESSFUL! ESPORTS INFOGRAPHIC ({refFormat.toUpperCase()}) BROADCASTED PUBLICLY ON <strong>{shareSuccessPlatform.toUpperCase()}</strong>!
                    </span>
                  </div>
                  <button 
                    onClick={() => setShareSuccessPlatform(null)}
                    className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold font-mono text-[9px] px-3 py-1 rounded-lg"
                  >
                    CLEAR
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
