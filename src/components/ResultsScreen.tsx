import { useEffect } from 'react';
import { Language } from '../i18n';
import { ShieldCheck, Trophy, Timer, Share2, CornerUpLeft, Award, ThumbsUp } from 'lucide-react';

interface ResultsScreenProps {
  pointsEarned: number;
  solvedCount: number;
  accuracy: number;
  solveTimeMs: number;
  difficulty: string;
  language: Language;
  onReturnToLobby: () => void;
  onOpenShareModal?: (evtType: 'level_up' | 'rank_up' | 'country_milestone' | 'win_streak' | 'boss_kill' | 'achievement' | 'immortal' | 'generic') => void;
}

export default function ResultsScreen({
  pointsEarned,
  solvedCount,
  accuracy,
  solveTimeMs,
  difficulty,
  language,
  onReturnToLobby,
  onOpenShareModal
}: ResultsScreenProps) {

  // Play retro victory theme chime
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Simple major chord fanfaring notes: C (261.63), E (329.63), G (392.00), C5 (523.25)
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.08, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-8 shadow-2xl relative" id="results-panel-root">
      {/* Decorative backdrop glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />

      {/* Checkmark stamp */}
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg text-4xl animate-bounce relative z-10" id="victory-stamp">
        ✓
      </div>

      <div className="space-y-2 relative z-10" id="results-headline">
        <h1 className="text-2xl md:text-3xl font-black font-mono text-slate-100 tracking-tight leading-none uppercase">
          {language === 'en' ? 'VERIFICATION COMPLETED' : 'ผ่านพิจารณารับรองตัวตน'}
        </h1>
        <p className="text-xs text-slate-400 font-mono italic">
          {language === 'en' 
            ? "The security gateway reluctantly validates your cognitive impulses as biological."
            : "สแกนเนอร์กองกำลังยืนยันว่าคุณไม่มีคลื่นไฟฟ้าสะท้อนกลับของระบบกงเก็งหุ่นยนต์"}
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-3 gap-4" id="results-rewards-counters">
        <div className="text-center space-y-1 border-r border-slate-850" id="pt-personal">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            {language === 'en' ? 'Player' : 'ส่วนตัว'}
          </div>
          <div className="text-lg font-mono font-extrabold text-emerald-400">
            +{pointsEarned}
          </div>
          <div className="text-[10px] text-slate-400">Human Pts</div>
        </div>

        <div className="text-center space-y-1 border-r border-slate-850" id="pt-country">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            {language === 'en' ? 'Country' : 'แผ่นดินชาติ'}
          </div>
          <div className="text-lg font-mono font-extrabold text-sky-400">
            +{pointsEarned}
          </div>
          <div className="text-[10px] text-slate-400">Subnet War</div>
        </div>

        <div className="text-center space-y-1" id="pt-world">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            {language === 'en' ? 'World' : 'มนุษยชาติ'}
          </div>
          <div className="text-lg font-mono font-extrabold text-purple-400">
            +{pointsEarned}
          </div>
          <div className="text-[10px] text-slate-400">Defense Core</div>
        </div>
      </div>

      {/* Match Statistics details list */}
      <div className="border border-slate-850 rounded-xl p-4 bg-slate-950/40 text-left space-y-3 font-mono text-xs text-slate-300" id="match-stats-table">
        <div className="flex justify-between" id="stat-row-1">
          <span className="text-slate-500">{language === 'en' ? 'DIFFICULTY CLASS' : 'เกรดความรุนแรง'}</span>
          <span className="font-bold text-slate-200">{difficulty}</span>
        </div>

        <div className="flex justify-between" id="stat-row-2">
          <span className="text-slate-500">{language === 'en' ? 'SOLVED CHALLENGES' : 'แก้รหัสผ่านสำเร็จ'}</span>
          <span className="font-bold text-slate-200">{solvedCount} / 5</span>
        </div>

        <div className="flex justify-between" id="stat-row-3">
          <span className="text-slate-500">{language === 'en' ? 'BIOMETRIC ACCURACY' : 'อัตราความแม่นยำประสาท'}</span>
          <span className={`font-bold ${accuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{accuracy}%</span>
        </div>

        <div className="flex justify-between" id="stat-row-4">
          <span className="text-slate-500">{language === 'en' ? 'TOTAL RETINA RESPONSE' : 'ความรวดเร็วที่ลากแก้'}</span>
          <span className="font-bold text-slate-200">{(solveTimeMs / 1000).toFixed(2)}s</span>
        </div>

        <div className="flex justify-between border-t border-slate-850 pt-2 text-emerald-400" id="stat-row-5">
          <span>{language === 'en' ? 'V-CREDITS COMMISSION' : 'ค่าคอมแต้มจัดจ้างไอเดน'}</span>
          <span className="font-bold">+{Math.round(pointsEarned * 0.1)} V-Credits</span>
        </div>
      </div>

      {/* Bottom control handles */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4" id="results-actions">
        <button
          onClick={onReturnToLobby}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow shadow-emerald-500/20"
          id="btn-return-to-lobby"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'RETURN TO LOBBY' : 'กลับสู่แผงกองบัญชาการ'}</span>
        </button>

        <button
          onClick={() => {
            if (onOpenShareModal) {
              const selectedEvt = difficulty === 'IMMORTAL' ? 'immortal' : 'win_streak';
              onOpenShareModal(selectedEvt);
            } else {
              const rawText = `I scored ${pointsEarned} pts against CAPTCHAs in Human Verified Arena! Prove your humanity at: ${window.location.href}`;
              navigator.clipboard.writeText(rawText);
            }
          }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/10"
          id="btn-results-share"
        >
          <Share2 className="w-4 h-4" />
          <span>{language === 'en' ? 'GENERATE ESPORTS IMAGE' : 'สร้างการ์ดโชว์เพื่อน'}</span>
        </button>
      </div>
    </div>
  );
}
