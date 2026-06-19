import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, CountryInfo, RealtimeVerificationLog, ChatMessage } from '../types';
import { Language } from '../i18n';
import { Send, Zap, Swords, Globe, Trophy, MessageSquare, ListCollapse, Users } from 'lucide-react';

interface GlobalHubProps {
  profile: PlayerProfile;
  updateProfile: (updated: Partial<PlayerProfile>) => void;
  language: Language;
  countries: CountryInfo[];
  updateCountries: (updated: CountryInfo[]) => void;
  bossHealth: number;
  damageBoss: (dmg: number) => void;
}

export default function GlobalHub({
  profile,
  updateProfile,
  language,
  countries,
  updateCountries,
  bossHealth,
  damageBoss
}: GlobalHubProps) {
  const [chatChannel, setChatChannel] = useState<'global' | 'country'>('global');
  const [chatMessage, setChatMessage] = useState('');
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [verifyLogs, setVerifyLogs] = useState<RealtimeVerificationLog[]>([]);
  const [attackSuccessText, setAttackSuccessText] = useState<string | null>(null);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const chatsContainerRef = useRef<HTMLDivElement>(null);

  // Sound Synth Generator helper
  const playSynth = (freq: number, type: 'sine' | 'square' | 'triangle' = 'triangle', duration = 0.1) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context may be blocked by iframe browser policy, handle gracefully
    }
  };

  // Generate mock real-time verification logs
  useEffect(() => {
    const presetNames = [
      'CaptchaSlayer', 'AntiBot_01', 'BionicEye', 'GridWrecker', 'HumanSovereign',
      'HydrantSpotter', 'CarbonLover', 'ClickFury', 'TrafficStar', 'CortexBurner',
      'NoMachineCanTameMe', 'SpamSweeper', 'BioHeart', 'Somchai_TH', 'Yuki_JP',
      'Hans_DE', 'Pierre_FR', 'Sanjay_IN', 'JohnCaptures', 'Lucas_BR'
    ];
    const countryCodes = countries.map(c => c.code);
    const captchaTypes = ['Image Grid', 'Distorted Words', 'Memory Blocks', 'Reaction Button', 'Logic Puzzle', 'Puzzle Slider'];

    const initialLogs: RealtimeVerificationLog[] = Array.from({ length: 6 }).map((_, idx) => ({
      id: `log-init-${idx}`,
      nickname: presetNames[Math.floor(Math.random() * presetNames.length)],
      country: countryCodes[Math.floor(Math.random() * countryCodes.length)],
      scoreEarned: Math.floor(Math.random() * 200) + 20,
      captchaType: captchaTypes[Math.floor(Math.random() * captchaTypes.length)],
      timestamp: new Date(Date.now() - (6 - idx) * 5000).toLocaleTimeString(),
      isImpossible: Math.random() < 0.05
    }));

    setVerifyLogs(initialLogs);

    // Dynamic timer adding fresh events
    const interval = setInterval(() => {
      const luckyCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
      const wonPoints = Math.floor(Math.random() * 300) + 15;
      const isImposs = Math.random() < 0.04;

      const newLog: RealtimeVerificationLog = {
        id: `log-${Date.now()}`,
        nickname: presetNames[Math.floor(Math.random() * presetNames.length)],
        country: luckyCode,
        scoreEarned: isImposs ? 2000 : wonPoints,
        captchaType: isImposs ? 'UNREAL EVENT' : captchaTypes[Math.floor(Math.random() * captchaTypes.length)],
        timestamp: new Date().toLocaleTimeString(),
        isImpossible: isImposs
      };

      setVerifyLogs(prev => [...prev.slice(1), newLog]);

      // Add point directly to the chosen country database for simulated reality!
      updateCountries(countries.map(c => {
        if (c.code === luckyCode) {
          return {
            ...c,
            score: c.score + newLog.scoreEarned,
            verifiedCount: c.verifiedCount + 1
          };
        }
        return c;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [countries]);

  // Generate initial chat messages and add simulated ones
  useEffect(() => {
    const presetChats: ChatMessage[] = [
      { id: '1', nickname: 'HydrantHunter', country: 'US', message: 'Man, that upside down warped mode makes me doubt my raw genetics lol', timestamp: '11:05' },
      { id: '2', nickname: 'CaptchaGrandmaster', country: 'TH', message: 'โหมด God of Humanity ยากจริง แต่ฝึกสอยเลข 1-5 ดีๆ คะแนนพุ่งเลยพี่ชาย', timestamp: '11:08' },
      { id: '3', nickname: 'Bot_Reaper', country: 'DE', message: 'Just licensed the Neon Violet theme. Checkmarks fit perfectly with retro layout', timestamp: '11:09' },
      { id: '4', nickname: 'System_Log', country: 'WORLD', message: 'Communal Global defenses have repelled AI Subnet wave 12!', timestamp: '11:10', isSystem: true }
    ];
    setChats(presetChats);

    const presetSimulations = [
      { nickname: 'Yuri_99', country: 'KR', message: 'Reaction mode on under 0.5s makes me feel like a pro starcraft player' },
      { nickname: 'TacoLover', country: 'BR', message: 'Did anyone get the impossible scenario "select happiest shadow"?? hilarious' },
      { nickname: 'MegaCortex', country: 'JP', message: 'Thailand leads the country scoreboard again. Time to grind verified mode!' },
      { nickname: 'Somchai_Retro', country: 'TH', message: 'บอสใหญ่อึดเป็นแสนแกนสมอง ทุกคนรีบมาช่วยตบลด HP กันเร็ววว!' }
    ];

    const chatInterval = setInterval(() => {
      const source = presetSimulations[Math.floor(Math.random() * presetSimulations.length)];
      const isGlobal = Math.random() > 0.3;

      const newMsg: ChatMessage = {
        id: `chat-${Date.now()}`,
        nickname: source.nickname,
        country: isGlobal ? source.country : profile.country,
        message: source.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => [...prev, newMsg]);
    }, 9000);

    return () => clearInterval(chatInterval);
  }, [profile.country]);

  // Scroll locks with smart user selection preservation
  useEffect(() => {
    const container = logsContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [verifyLogs]);

  useEffect(() => {
    const container = chatsContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chats]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const myMsg: ChatMessage = {
      id: `chat-p-${Date.now()}`,
      nickname: profile.nickname || 'Unknown Human',
      country: profile.country,
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: profile.activeBadge !== 'Authorized' ? profile.activeBadge : undefined
    };

    setChats(prev => [...prev, myMsg]);
    setChatMessage('');
    playSynth(440, 'triangle', 0.05);

    // Forces immediate bottom scroll on self-sent chat event
    setTimeout(() => {
      if (chatsContainerRef.current) {
        chatsContainerRef.current.scrollTo({
          top: chatsContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  // Click Assault on the Boss
  const handleTapAttack = () => {
    const rawDamage = Math.floor(Math.random() * 850) + 150;
    damageBoss(rawDamage);
    playSynth(180 + rawDamage, 'square', 0.15);

    // User gets 5 credits rewards per hit as a funny gameplay addition
    updateProfile({
      vCredits: profile.vCredits + 5,
      stats: {
        ...profile.stats,
        bossDamage: profile.stats.bossDamage + rawDamage
      }
    });

    setAttackSuccessText(`CPU GLITCH INDUCED! -${rawDamage} Core integrity / Earned +5 V-Credits`);
    setTimeout(() => setAttackSuccessText(null), 1500);
  };

  // Sort country standings
  const sortedCountries = [...countries].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6" id="global-hub-container">
      {/* 1. World Boss Raid Panel */}
      <div className="bg-slate-950 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden" id="boss-raid-panel">
        {/* Glow backdrop decorator */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6" id="boss-inner-flex">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2" id="boss-header-box">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <h3 className="font-mono text-sm font-bold tracking-widest text-red-400 uppercase">
                {language === 'en' ? '⚠️ WORLDWIDE DEFENSE CAMPAIGN ⚠️' : '⚠️ ปฏิบัติการกองกำลังทหารโลก ⚠️'}
              </h3>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight" id="boss-raid-title">
              {language === 'en' ? 'ROGUE AI RAID: SHUMAN-X PROTOCOL' : 'ล้มล้างเซิร์ฟเวอร์มติลับ: มหันตภัยบอส AI นอกรีต'}
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              {language === 'en' 
                ? 'Rogue AI systems are encrypting the colony subnets. Every validation solved weakens the database core integrity. You can also actively tap the core payload to inject noise codes!'
                : 'สมองกลชั่วร้ายกำลังปล่อยรหัสรบกวนความเร็วเพื่อยึดครองสถานี ทุกการไขปริศนาจะช่วยรีเซ็ตแกนประมวลผลกลไก และคุณสามารถสอยแกนย่อยผ่านการคลิกเพื่อป่วนบอร์ดเพื่อลุ้นรับ V-Credits ไวๆ'}
            </p>

            {/* Boss health bar */}
            <div className="space-y-2 pt-2" id="boss-progress-wrapper">
              <div className="flex justify-between text-xs font-mono" id="boss-hp-numeric-label">
                <span className="text-slate-400">Rogue Core integrity</span>
                <span className="text-red-400 font-bold">{(bossHealth).toLocaleString()} HP / 100,000,000</span>
              </div>
              <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-5 overflow-hidden p-0.5" id="boss-hp-track">
                <div 
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0.5, (bossHealth / 100000000) * 100)}%` }}
                  id="boss-hp-bar"
                />
              </div>
            </div>
          </div>

          {/* Core tap-attack area */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 border border-slate-800 rounded-xl w-full lg:w-72 relative" id="boss-attack-box">
            <button
              onClick={handleTapAttack}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center border-4 border-black ring-4 ring-red-500/30 text-white shadow-lg cursor-pointer"
              id="boss-btn-attack"
            >
              <Swords className="w-8 h-8 animate-wiggle" />
            </button>
            <span className="text-xs font-mono font-bold text-red-400 mt-3 uppercase tracking-wider">
              {language === 'en' ? 'TAP ATTACK ROOT CORE' : 'ทุบคลื่นแทรกแซง'}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              {language === 'en' ? '(Grants +5 Credits / +Active Damage)' : '(ทุบเพื่อขโมย +5 เครดิตต่อครั้ง)'}
            </span>

            {attackSuccessText && (
              <div className="absolute -top-12 bg-red-500 text-white text-[10px] font-mono px-3 py-1 rounded shadow-lg text-center" id="attack-popup">
                {attackSuccessText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Left: Logs / Country Standing, Right: Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="hub-panels-grid">
        {/* Country War Leaderboard (8 Rows) & Verification logs */}
        <div className="lg:col-span-8 space-y-6" id="hub-main-column">
          {/* Country Scoreboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="hub-leaderboard-card">
            <div className="flex items-center justify-between mb-4" id="leaderboard-header-row">
              <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                {language === 'en' ? 'COLONY SOVEREIGNTY STANDINGS' : 'อันดับแต้มรวมสงครามชาติต่างๆ'}
              </h3>
              <Globe className="w-4 h-4 text-slate-500" />
            </div>

            <div className="overflow-x-auto" id="leaderboard-table-scroller">
              <table className="w-full text-left text-xs font-mono" id="leaderboard-tbl">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 pb-2">
                    <th className="py-2 w-16">{language === 'en' ? 'POS' : 'ลำดับ'}</th>
                    <th className="py-2">{language === 'en' ? 'COUNTRY CLIENT' : 'ประเทศสังกัด'}</th>
                    <th className="py-2 text-right">{language === 'en' ? 'HUMAN POINTS' : 'คะแนนกู้ชีพรวม'}</th>
                    <th className="py-2 text-right hidden sm:table-cell">{language === 'en' ? 'VERIFIED CYCLES' : 'จำนวนครั้งยืนยัน'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {sortedCountries.slice(0, 7).map((c, idx) => {
                    const isMyCountry = c.code === profile.country;
                    return (
                      <tr 
                        key={c.code} 
                        className={`hover:bg-slate-800/20 transition-colors ${isMyCountry ? 'bg-emerald-500/5 font-semibold text-emerald-400' : 'text-slate-300'}`}
                        id={`country-row-${c.code}`}
                      >
                        <td className="py-2.5">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#0${idx + 1}`}
                        </td>
                        <td className="py-2.5 flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <span>{language === 'en' ? c.nameEn : c.nameTh}</span>
                          {isMyCountry && <span className="text-[9px] bg-emerald-550/30 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-400/20 ml-2">YOU</span>}
                        </td>
                        <td className="py-2.5 text-right font-bold">
                          {c.score.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right text-slate-400 hidden sm:table-cell">
                          {c.verifiedCount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time verify log feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="hub-logs-card">
            <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              {language === 'en' ? 'LIVE DEFUELLING FEED' : 'ฟีดความเคลื่อนไหวการสยบบอท'}
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-48 overflow-y-auto space-y-2 scrollbar-thin" id="logs-container" ref={logsContainerRef}>
              {verifyLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`text-[11px] font-mono py-1.5 px-2.5 rounded border ${
                    log.isImpossible 
                      ? 'bg-purple-950/30 border-purple-800 text-purple-400 animate-pulse'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                  }`}
                  id={`log-item-${log.id}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className="font-bold text-slate-200">{log.nickname}</span>
                      <span className="bg-slate-850 px-1 rounded text-slate-400 text-[10px]">{log.country}</span>
                      <span className="text-slate-400">
                        {language === 'en' ? 'verified' : 'ปราบสคริปต์'} <strong className="text-slate-200">[{log.captchaType}]</strong>
                      </span>
                    </div>

                    <span className={`font-bold ${log.isImpossible ? 'text-purple-400' : 'text-emerald-400'}`}>
                      +{log.scoreEarned} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global / Country Chat Rooms */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px]" id="hub-chat-column">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3" id="chat-header">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-widest">
                {language === 'en' ? 'SECURE CONVERSATION' : 'คลื่นสัญญาณวิทยุกบฏ'}
              </h3>
            </div>
          </div>

          {/* Channel selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl mb-3 border border-slate-800/80" id="chat-channel-selector">
            <button
              onClick={() => { setChatChannel('global'); playSynth(330, 'sine', 0.05); }}
              className={`py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                chatChannel === 'global' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-channel-global"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL</span>
            </button>
            <button
              onClick={() => { setChatChannel('country'); playSynth(330, 'sine', 0.05); }}
              className={`py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                chatChannel === 'country' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-channel-country"
            >
              <Users className="w-3.5 h-3.5" />
              <span>MY COGNITION</span>
            </button>
          </div>

          {/* Message List area */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin max-h-[300px]" id="chats-scroller" ref={chatsContainerRef}>
            {chats
              .filter(msg => chatChannel === 'global' || msg.country === profile.country || msg.isSystem)
              .map((msg) => (
                <div key={msg.id} className="text-xs space-y-0.5" id={`chat-bubble-${msg.id}`}>
                  <div className="flex items-baseline gap-1.5">
                    {msg.isSystem ? (
                      <span className="text-[10px] font-bold text-red-400 font-mono">[MAINFRAME ALARM]</span>
                    ) : (
                      <>
                        {msg.badge && (
                          <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-mono">
                            {msg.badge}
                          </span>
                        )}
                        <span className="font-bold text-slate-100">{msg.nickname}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({msg.country})</span>
                      </>
                    )}
                    <span className="text-[9px] text-slate-600 font-mono ml-auto">{msg.timestamp}</span>
                  </div>
                  <p className={`text-slate-300 leading-relaxed break-words py-1 px-2.5 rounded-lg ${msg.isSystem ? 'bg-red-950/20 border border-red-950 text-red-300 font-mono' : 'bg-slate-900/60'}`}>
                    {msg.message}
                  </p>
                </div>
              ))}
          </div>

          {/* Form input field */}
          <form onSubmit={handleSendChat} className="flex gap-2" id="chat-input-form">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={language === 'en' ? "Broadcast biologically..." : "พิมพ์รหัสเพื่อแชท..."}
              maxLength={150}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              id="input-chat-msg"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition cursor-pointer"
              id="btn-chat-send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
