import { useState } from 'react';
import { PlayerProfile, CountryInfo, Difficulty } from '../types';
import { Language, i18nTranslations } from '../i18n';
import MilitaryIdCard from './MilitaryIdCard';
import { 
  encryptHumanPassport, 
  decryptHumanPassport, 
  assessDuplicateSimilarity 
} from '../utils/identity';
import { 
  Zap, 
  Swords, 
  Globe, 
  Trophy, 
  CircleUser, 
  Settings, 
  Sparkles, 
  Check, 
  HelpCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Download, 
  Upload, 
  Copy, 
  Users, 
  Fingerprint, 
  ExternalLink 
} from 'lucide-react';

interface LobbyProps {
  profile: PlayerProfile;
  updateProfile: (updated: Partial<PlayerProfile>) => void;
  language: Language;
  countries: CountryInfo[];
  onStartMatchmaking: (difficulty: Difficulty) => void;
}

export default function Lobby({
  profile,
  updateProfile,
  language,
  countries,
  onStartMatchmaking
}: LobbyProps) {
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [selectedCountryCode, setSelectedCountryCode] = useState(profile.country);
  const [editMode, setEditMode] = useState(!profile.nickname || !profile.humanId);
  const [nameError, setNameError] = useState<string | null>(null);

  const getDiffLabel = (diff: Difficulty) => {
    const labels: Record<Difficulty, Record<Language, string>> = {
      EASY: {
        en: 'EASY', th: 'ง่าย', zh: '普通 (EASY)', es: 'FÁCIL', pt: 'FÁCIL',
        ru: 'ЛЕГКО', ja: 'かんたん', ko: '쉬움', id: 'MUDAH', vi: 'DỄ'
      },
      HARD: {
        en: 'HARD', th: 'ยาก', zh: '困难 (HARD)', es: 'DIFÍCIL', pt: 'DIFÍCIL',
        ru: 'СЛОЖНО', ja: 'むずかしい', ko: '어려움', id: 'SULIT', vi: 'KHÓ'
      },
      INSANE: {
        en: 'INSANE', th: 'นรกแตก', zh: '极难 (INSANE)', es: 'INSANO', pt: 'COGNITIVO',
        ru: 'БЕЗУМИЕ', ja: 'インセイン', ko: '지옥', id: 'GILA', vi: 'VÔ NHÂN'
      },
      IMMORTAL: {
        en: 'IMMORTAL', th: 'อมตะ', zh: 'ไม่จำกัด (IMMORTAL)', es: 'INMORTAL', pt: 'IMORTAL',
        ru: 'БЕССМЕРТИЕ', ja: 'インモータル', ko: '불멸', id: 'ABADI', vi: 'BẤT TỬ'
      }
    };
    return labels[diff]?.[language] || labels[diff]?.en || diff;
  };

  const getEasyDescription = () => {
    const desc: Record<Language, string> = {
      en: 'Standard CAPTCHA selection, image identification, simple sliders, and shapes. Relaxed timer.',
      th: 'เลือกภาพไฟจราจร แมว ปลั๊กไฟ แถบอักษรเอียง สไลเดอร์ประกบมุมแบบละมุนตา',
      zh: '标准验证码、图像识别、简单滑块和形状。时间宽松。',
      es: 'Selección estándar de CAPTCHA, identificación de imágenes, controles deslizantes y formas simples. Temporizador relajado.',
      pt: 'Seleção padrão de CAPTCHA, identificação de imagens, barras deslizantes e formas simples. Temporizador relaxado.',
      ru: 'Стандартный CAPTCHA-выбор, распознавание изображений, простые слайдеры и фигуры. Комфортный таймер.',
      ja: '標準的なキャプチャ選択、画像識別、シンプルなスライダー、および図形。余裕のあるタイマー設計。',
      ko: '표준 캡차 선택, 이미지 식별, 간단한 슬라이더 및 도형. 비교적 넉넉한 시간 타이머.',
      id: 'Pilihan CAPTCHA standar, identifikasi gambar, slider sederhana, dan bentuk. Pengatur waktu santai.',
      vi: 'Lựa chọn CAPTCHA tiêu chuẩn, nhận dạng hình ảnh, thanh trượt đơn giản và hình khối. Thời gian khá thư thả.'
    };
    return desc[language] || desc.en;
  };

  const getHardDescription = () => {
    const desc: Record<Language, string> = {
      en: 'Advanced text rotations, fast sequencing nodes, color perception anomalies, and memory trials.',
      th: 'ตัวหนังสือมืดมัวกลับหลังหัน เรียงรันเลข 1-5 กลวงพัซเซิลภาพเปลี่ยนสีระทึกใจ',
      zh: '高级文本旋转、快速音序节点、颜色感知异常和记忆力测试。',
      es: 'Rotación avanzada de textos, secuencias lógicas rápidas, anomalías de percepción de color y pruebas de memoria.',
      pt: 'Rotação avançada de textos, sequenciamento lógico rápido, anomalias de percepção de cor e testes de memória orgânica.',
      ru: 'Продвинутый поворот текста, быстрые числовые последовательности, аномалии цветовосприятия и тесты памяти.',
      ja: '高度な文字列回転、高速シンプルの連番選び、色覚アノマリー、および短期記憶テスト。',
      ko: '고급 텍스트 회전, 고속 숫자 정렬 시퀀스, 색각 분석 아노말리 및 단기 기억력 테스트.',
      id: 'Rotasi teks tingkat lanjut, pengurutan angka cepat, anomali persepsi warna, dan uji ingatan jangka pendek.',
      vi: 'Xoay văn bản nâng cao, sắp xếp số chuỗi tốc độ, bất thường cảm nhận màu sắc và thử nghiệm ghi nhớ nhanh.'
    };
    return desc[language] || desc.en;
  };

  const getInsaneDescription = () => {
    const desc: Record<Language, string> = {
      en: 'Reverse logic contradictions, AI optical illusion trickery, micro observations, and sub-700ms reaction pops.',
      th: 'โจทย์ผกผันสั่งห้ามกด ภาพลวงตาขัดนิมิต ปริศนาจิตใจมนุษย์ และรีแอ็กชันกดในเสี้ยววิ',
      zh: '反向逻辑矛盾、AI 视错觉、微观细节观察以及低于 700 毫秒的超极限瞬时反应。',
      es: 'Contradicciones de lógica inversa, ilusiones ópticas avanzadas de IA, micro observaciones y clics de reacción menores de 700 ms.',
      pt: 'Contradições de lógica reversa, ilusões óticas avançadas, microobservações reflexológicas e reações rápidas em menos de 700ms.',
      ru: 'Противоречия обратной логики, оптические иллюзии ИИ, микронаблюдения и реакция на клик менее 700 мс.',
      ja: '逆説論理の矛盾解読、AI狂視の目の錯覚、微細観測、および超瞬発の700ミリ秒リミット。',
      ko: '역설 논리적 모순 해독, 인공지능 착시 기만 분석, 미세 조준 관찰 및 700ms 미만 초고속 반사 신경 테스트.',
      id: 'Kontradiksi logika terbalik, trik ilusi optik AI, observasi mikro, dan reaksi refleks di bawah 700 milidetik.',
      vi: 'Mâu thuẫn logic nghịch đảo, ảo ảnh thị giác AI gạt gẫm, quan sát vi mô chi tiết, và phản xạ siêu nhanh dưới 700ms.'
    };
    return desc[language] || desc.en;
  };

  const getImmortalDescription = () => {
    const desc: Record<Language, string> = {
      en: 'Endless survival. Random grid changes, spring sliders, negative double-logics and Schrodinger boxes.',
      th: 'โหมดเอาชีวิตรอดเอาตายสลับค่าย ฟันเฟืองสปริงดีด ถอดรหัสข้อความกวนประสาท และทฤษฎีแมวซ้อนทับ',
      zh: '无尽的极限生存。网格随机变化、弹簧组合滑块、否定双重逻辑和薛定谔的量子验证盒。',
      es: 'Sobre vivencia infinita. Cambios aleatorios de cuadrícula, controles elásticos, lógica doble negativa y cajas cuánticas.',
      pt: 'Sobrevivência infinita. Mudança caótica de matrizes, barras com mola retrátil, lógica dupla negativa e caixas de Schrödinger.',
      ru: 'Бесконечное выживание. Случайное изменение сетки, пружинные слайдеры, двойная негативная логика и квантовые коробки.',
      ja: 'エンドレスサバイバル。グリッドの突発変動、スプリング付スライダー、二重否定論理、および量子猫の箱。',
      ko: '끝없는 서바이벌 대장정. 불규칙 그리드 변화, 탄력 스프リング式 슬라이더, 이중 부정 논리 및 슈뢰딩거의 상자.',
      id: 'Kelangsungan hidup tanpa akhir. Perubahan grid acak, geser pegas dinamis, logika ganda negatif, dan kotak Schrödinger.',
      vi: 'Sinh tồn vô tận cực hình. Lưới thay đổi bất ngờ, thanh trượt hồi xuân, logic phủ định kép, và chiếc hộp Schrödinger.'
    };
    return desc[language] || desc.en;
  };

  // SECURE DECENTRALIZED PASSPORT STATES
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedPassport, setIsCopiedPassport] = useState(false);
  const [importPassportText, setImportPassportText] = useState('');
  const [importStatusError, setImportStatusError] = useState<string | null>(null);
  const [importSuccessText, setImportSuccessText] = useState(false);
  const [guildInputText, setGuildInputText] = useState(profile.guildMembership || '');
  const [terminalCategoryTab, setTerminalCategoryTab] = useState<'passport' | 'backup' | 'telemetry'>('passport');

  // PAID NAME REGISTRATION TERMINAL STATES
  const [showNameRegister, setShowNameRegister] = useState(false);
  const [nameRegCallSign, setNameRegCallSign] = useState(profile.nickname);
  const [nameRegDisp, setNameRegDisp] = useState(profile.displayName || '');
  const [nameRegAlias, setNameRegAlias] = useState(profile.alias || 'BOT_HUNTER');
  const [nameRegErr, setNameRegErr] = useState<string | null>(null);
  const [nameRegSuccess, setNameRegSuccess] = useState(false);

  // PAID COUNTRY ALLEGIANCE TRANSFER STATES
  const [showCountryTrans, setShowCountryTrans] = useState(false);
  const [countryTransTarget, setCountryTransTarget] = useState(profile.country);
  const [countryTransConfirm, setCountryTransConfirm] = useState(false);
  const [countryTransErr, setCountryTransErr] = useState<string | null>(null);
  const [countryTransSuccess, setCountryTransSuccess] = useState(false);

  // HVA SQUAD/CLAN OPERATIONS STATES
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [guildRegTag, setGuildRegTag] = useState('');
  const [guildRegName, setGuildRegName] = useState('');
  const [guildRegEmblem, setGuildRegEmblem] = useState('🛡️');
  const [guildRegErr, setGuildRegErr] = useState<string | null>(null);
  const [selectedPresetGuildIdx, setSelectedPresetGuildIdx] = useState<number | null>(null);
  const [showGuildJoinNoticeIdx, setShowGuildJoinNoticeIdx] = useState<number | null>(null);
  const [guildHubFeedback, setGuildHubFeedback] = useState<string | null>(null);

  // Mock Active Cooperative missions (stateful so players can Claim Points and earn GMP!)
  const [guildMissions, setGuildMissions] = useState([
    { id: 'gm_solves', title: 'Solve 20 CAPTCHAs', current: Math.min(20, profile.stats?.captchaSolved || 0), target: 20, reward: 250, completed: (profile.stats?.captchaSolved || 0) >= 20, claimed: false },
    { id: 'gm_accuracy', title: 'Reach 94% Accuracy', current: profile.stats?.accuracy || 85, target: 94, reward: 400, completed: (profile.stats?.accuracy || 0) >= 94, claimed: false },
    { id: 'gm_streak', title: 'Achieve a 5-Match Streak', current: Math.min(5, profile.stats?.longestStreak || 0), target: 5, reward: 500, completed: (profile.stats?.longestStreak || 0) >= 5, claimed: false }
  ]);

  // Sound Synth Generator helper
  const playBeep = (freq: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const handleUpdateProfile = () => {
    if (!nicknameInput.trim()) {
      setNameError(language === 'en' ? 'Dignity flag: You must have a designation name!' : 'กรุณาระบุชื่อรหัสเพื่อบ่งชี้ว่าคุณมีตัวตน!');
      return;
    }
    setNameError(null);
    updateProfile({
      nickname: nicknameInput.trim(),
      country: selectedCountryCode
    });
    setEditMode(false);
    playBeep(520);
  };

  const handleLobbyModeSelect = (difficulty: Difficulty) => {
    if (editMode) {
      setNameError(language === 'en' ? 'Authorize your bio signature first by clicking SAVE!' : 'กรุณากดปุ่มยันยันชื่อชีวภาพของคุณด้านบนก่อนเริ่มคิว!');
      return;
    }
    onStartMatchmaking(difficulty);
  };

  const getProgressToNextLevel = () => {
    const xpNeeded = profile.rankLevel * 500;
    return Math.min(100, Math.floor((profile.rankXP / xpNeeded) * 100));
  };

  const duplicateDiagnostics = assessDuplicateSimilarity(profile);

  return (
    <div className="space-y-6" id="lobby-panel-container">
      {/* 1. Biological Enrollment Station (Setup / Profile info) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="enrollment-station">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="lobby-profile-display">
          {/* Left info */}
          <div className="flex items-center gap-4" id="lobby-user-badge">
            <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-emerald-500/20 flex items-center justify-center text-3xl shadow-inner relative group animate-pulse-slow" id="lobby-avatar-sphere">
              {countries.find(c => c.code === profile.country)?.flag || '🇺🇳'}
              {/* Custom active title label */}
              <span className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-[8px] font-mono font-bold text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider scale-95 shadow">
                {profile.activeBadge || 'AGENT'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-mono font-bold text-slate-100 uppercase">
                  {profile.nickname}
                  <span className="text-emerald-500 font-normal">#{profile.humanId ? profile.humanId.split('-')[1] : '8F2A91'}</span>
                </h3>
                <span className="text-[9px] bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded font-mono uppercase">
                  {profile.clearanceLevel || 'C0'} SECURED
                </span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-amber-400 font-mono">
                  {profile.rankName || 'Unverified Citizen'} ({language === 'en' ? 'Level' : 'เลเวล'} {profile.rankLevel || 1})
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-400">{profile.score ? profile.score.toLocaleString() : 0} Human Pts</span>
                <span>•</span>
                <span className="font-mono text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/10" id="vcredits-balance-label">
                  💰 {profile.vCredits !== undefined ? profile.vCredits : 1500} V-Credits
                </span>
              </div>
            </div>
          </div>

          {/* XP progress meter */}
          <div className="w-full md:w-64 space-y-1" id="lobby-xp-progress">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>XP PROGRESS TO LEVEL { (profile.rankLevel || 1) + 1 }</span>
              <span>{profile.rankXP || 0} / { (profile.rankLevel || 1) * 500 }</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-900" id="xp-meter-track">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${getProgressToNextLevel()}%` }}
                id="xp-meter-bar"
              />
            </div>
          </div>
        </div>
      </div>

      {/* HUMAN VERIFICATION PORT passport backups & credentials console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4" id="human-passport-backup-console">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2" id="passport-header">
          <div>
            <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-100 uppercase flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse" />
              {language === 'en' ? 'HUMAN DECENTRALIZED PASSPORT TERMINAL' : 'ศูนย์เครื่องถอดคลื่นรหัสพลังงานใบเบิกทางมนุษย์'}
            </h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">
              {language === 'en' 
                ? `DEVICE IDENTITY DEED: ${profile.humanId || 'GATHERING-SIGNALS'}` 
                : `ตำแหน่งสัญญาณฮาร์ดแวร์ชีวภาพ: ${profile.humanId || 'กำลังประมวลผล'}`}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800" id="passport-tabs">
            <button
              onClick={() => { setTerminalCategoryTab('passport'); playBeep(350); }}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${terminalCategoryTab === 'passport' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-btn-passport"
            >
              PASSPORT
            </button>
            <button
              onClick={() => { setTerminalCategoryTab('backup'); playBeep(350); }}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${terminalCategoryTab === 'backup' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-btn-backup"
            >
              BACKUP & SYNC
            </button>
            <button
              onClick={() => { setTerminalCategoryTab('telemetry'); playBeep(350); }}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${terminalCategoryTab === 'telemetry' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-btn-telemetry"
            >
              DIAGNOSTICS
            </button>
          </div>
        </div>

        {/* Tab content 1: Passport Core stats + Guild + Achievements */}
        {terminalCategoryTab === 'passport' && (
          <div className="space-y-6 animate-fadeIn font-mono" id="passport-core-tab">
            
            {/* IMMERSIVE COMPONENT: THE HOLOGRAPH MILITARY ID CARD */}
            <div id="immersive-military-card-dock">
              <MilitaryIdCard 
                profile={profile} 
                language={language} 
                countries={countries} 
              />
            </div>

            {/* ERROR FEEDBACK BAR */}
            {guildHubFeedback && (
              <div className="p-3 rounded-xl bg-indigo-950/40 text-indigo-300 text-xs border border-indigo-900/40 animate-pulse flex justify-between items-center" id="guild-feedback-strip">
                <span>⚡ {guildHubFeedback}</span>
                <button onClick={() => setGuildHubFeedback(null)} className="hover:text-white font-bold">&times;</button>
              </div>
            )}

            {/* DUAL OPERATION PATHS GRID (NAME REGISTER & COUNTRY TRANSFERS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="paid-id-registration-terminals">
              
              {/* PANELS 1: PAID NAME REGISTRATION OFFICE */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4" id="paid-name-office">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    {language === 'en' ? 'PAYMENT NAME REGISTRATION' : 'ศูนย์สถาปนาชื่อวิทยาฐานะ'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">💰 500 V-CREDITS</span>
                </h3>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'en'
                    ? 'Unlike standard websites, your Call Sign, Display Name, and Tactical Alias are securely recorded. Modification requires high-intensity cryptography.'
                    : 'ถอดความถี่คลื่นสมองวิทยาฐานะใหม่เพื่อความลับทางราชการ ต้องใช้ทุนสถาปนาระบบ 500 แต้ม เปลี่ยนได้ตลอดชีพเหลือกี่ครั้งตรวจสอบด้านล่าง'}
                </p>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 text-[10px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>LIFETIME REMAINING CHANGES:</span>
                    <span className="text-white font-extrabold">{profile.nameChangesRemaining !== undefined ? profile.nameChangesRemaining : 10} / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CALL SIGN LOCKOUT:</span>
                    <span className="text-emerald-400 font-bold uppercase">SECURELY ENCRYPT COMPLIANT</span>
                  </div>
                </div>

                {/* Name Registers toggle */}
                {!showNameRegister ? (
                  <button
                    onClick={() => { setShowNameRegister(true); playBeep(380); }}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    id="btn-open-name-reg"
                  >
                    🚀 {language === 'en' ? 'ACCESS SIGNATURE TERMINAL' : 'เริ่มระบบถอดรหัสคลื่นสมอง'}
                  </button>
                ) : (
                  <div className="space-y-3 bg-slate-900/30 p-3.5 rounded-xl border border-slate-850 animate-fadeIn" id="name-reg-inputs-pane">
                    
                    {/* Input nickname call sign */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block">TACTICAL CALL SIGN (CHARACTERS ONLY)</label>
                      <input 
                        type="text"
                        maxLength={12}
                        value={nameRegCallSign}
                        onChange={(e) => setNameRegCallSign(e.target.value.toUpperCase().replace(/[^a-zA-Z0-9_]/g, ''))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="e.g. ALPHA_SENTRY"
                      />
                    </div>

                    {/* Input display name */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block">HUMAN BRIEF DISPLAY NAME</label>
                      <input 
                        type="text"
                        maxLength={18}
                        value={nameRegDisp}
                        onChange={(e) => setNameRegDisp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="e.g. General Cooper"
                      />
                    </div>

                    {/* Tactical alias selection dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-wider block">TACTICAL ALIAS BADGE</label>
                      <select
                        value={nameRegAlias}
                        onChange={(e) => setNameRegAlias(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="BOT_HUNTER">BOT_HUNTER</option>
                        <option value="THAI_AGENT">THAI_AGENT</option>
                        <option value="CAPTCHA_MASTER">CAPTCHA_MASTER</option>
                        <option value="VERIFY_KING">VERIFY_KING</option>
                        <option value="HUMAN_SENTINEL">HUMAN_SENTINEL</option>
                        <option value="LEVEL_MAX_99">LEVEL_MAX_99</option>
                      </select>
                    </div>

                    {nameRegErr && <span className="text-[9px] text-rose-400 block">{nameRegErr}</span>}
                    {nameRegSuccess && <span className="text-[9px] text-emerald-400 block font-bold">✓ BIO SIGNATURE ENROLLED SUCCESSFULLY! 500 V-credits spent.</span>}

                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={() => {
                          const currentCredits = profile.vCredits !== undefined ? profile.vCredits : 1500;
                          if (currentCredits < 500) {
                            setNameRegErr(language === 'en' ? 'Insufficient V-credits! Need 500.' : 'ยอด V-Credits ไม่เพียงพอ! ต้องการ 500');
                            return;
                          }
                          const rem = profile.nameChangesRemaining !== undefined ? profile.nameChangesRemaining : 10;
                          if (rem <= 0) {
                            setNameRegErr(language === 'en' ? 'Lifetime limit hit!' : 'ใช้งานครบจำนวนจำกัด 10 ครั้ง');
                            return;
                          }
                          if (!nameRegCallSign.trim()) {
                            setNameRegErr(language === 'en' ? 'Call Sign cannot be empty!' : 'รหัสสัญญาณห้ามเว้นว่าง');
                            return;
                          }

                          const histEntry = {
                            oldCallSign: profile.nickname,
                            oldDisplayName: profile.displayName || '',
                            oldAlias: profile.alias || '',
                            newCallSign: nameRegCallSign.trim().toUpperCase().replace(/[^a-zA-Z0-9_]/g, ''),
                            newDisplayName: nameRegDisp.trim() || 'Agent Recruit',
                            newAlias: nameRegAlias,
                            date: new Date().toISOString().split('T')[0]
                          };

                          const curHist = profile.nameHistory || [];
                          const curDisc = profile.disciplinaryRecord || [];

                          updateProfile({
                            vCredits: currentCredits - 500,
                            nickname: histEntry.newCallSign,
                            displayName: histEntry.newDisplayName,
                            alias: histEntry.newAlias,
                            activeBadge: histEntry.newAlias,
                            nameChangesRemaining: rem - 1,
                            nameHistory: [...curHist, histEntry],
                            disciplinaryRecord: [...curDisc, `ALERTER: Signature altered to ${histEntry.newCallSign} on ${histEntry.date}`]
                          });

                          setNameRegErr(null);
                          setNameRegSuccess(true);
                          playBeep(650);
                          setTimeout(() => {
                            setNameRegSuccess(false);
                            setShowNameRegister(false);
                          }, 2500);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg transition"
                      >
                        {language === 'en' ? 'DECRYPT & APPLY' : 'ถอดรหัสและบันทึกแต่งตั้ง'}
                      </button>
                      <button
                        onClick={() => { setShowNameRegister(false); setNameRegErr(null); }}
                        className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 py-1.5 rounded-lg"
                      >
                        {language === 'en' ? 'CANCEL' : 'ยกเลิก'}
                      </button>
                    </div>

                  </div>
                )}

                {/* Historical records drawer */}
                {profile.nameHistory && profile.nameHistory.length > 0 && (
                  <div className="space-y-1 border-t border-slate-900 pt-3" id="name-history-drawer">
                    <span className="text-[8px] text-slate-500 font-bold block uppercase">PREVIOUS SIGNATURE HISTORY LOGS</span>
                    <div className="space-y-1 max-h-16 overflow-y-auto text-[8px] text-slate-400 scrollbar-none" id="name-logs-box">
                      {profile.nameHistory.map((nh: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-900/60 font-mono">
                          <span>{nh.oldCallSign} &rarr; {nh.newCallSign}</span>
                          <span className="text-slate-600">{nh.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* PANELS 2: PAID ALLIANCE TRANSFER OFFICE (COUNTRY CHANGE) */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4" id="paid-country-office">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    {language === 'en' ? 'COLONY TRANSFER AUTHORITY' : 'สัญชาตาสิริรวมสละชีพย้ายค่าย'}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold">💰 2000 V-CREDITS</span>
                </h3>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'en'
                    ? 'Transferring your colonial allegiance affects historic national war rankings, leaderboard records, and active campaign contribution ratings.'
                    : 'การเปลี่ยนแปลงสังกัดค่ายประเทศจะส่งผลกระทบอย่างรุนแรงต่อ อันดับสงครามโลก, ตราความสำเร็จสูงสุดของกองพลรักทีม, และประวัติแต้มกู้ชาติสสมชีพ'}
                </p>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 text-[10px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>LIFETIME REMAINING TRANSFERS:</span>
                    <span className="text-rose-400 font-extrabold">{profile.countryTransfersRemaining !== undefined ? profile.countryTransfersRemaining : 3} / 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MIGRATION STAMP STATUS:</span>
                    <span className="text-amber-400 font-bold uppercase">WARNING COOLDOWN MONITOR ACTIVE</span>
                  </div>
                </div>

                {!showCountryTrans ? (
                  <button
                    onClick={() => { setShowCountryTrans(true); playBeep(260); }}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-indigo-300 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-indigo-950"
                    id="btn-open-country-transfer"
                  >
                    🌍 {language === 'en' ? 'REQUEST COLONY MIGRATION' : 'ยื่นคำร้องย้ายสังกัดประเทศ'}
                  </button>
                ) : (
                  <div className="space-y-3 bg-slate-900/30 p-3.5 rounded-xl border border-rose-950/40 animate-fadeIn" id="country-migrate-panel">
                    
                    {/* Target country select */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-rose-400 uppercase tracking-widest font-black block">SELECT NEW TARGET COLO-ALLIANCE</label>
                      <select
                        value={countryTransTarget}
                        onChange={(e) => setCountryTransTarget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {language === 'en' ? c.nameEn : c.nameTh}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DANGEROUS WARNING CONSENT BOX */}
                    <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl space-y-1" id="country-trans-warning">
                      <span className="text-[8.5px] text-red-400 font-bold uppercase block">⚠ CRITICAL TRANSFER CONSENT STATEMENTS:</span>
                      <p className="text-[7.5px] text-slate-400 uppercase leading-normal">
                        TRANSFERRING NATION ALLEGIANCES DEDUCTS 2000 V-CREDITS AND PREVENTS RETURNING FOR 24 HOURS. REMAINING TRANSFERS BECOME {profile.countryTransfersRemaining !== undefined ? profile.countryTransfersRemaining - 1 : 2}.
                      </p>
                      
                      <label className="flex items-center gap-2 mt-2 text-[8px] text-amber-300 cursor-pointer font-bold">
                        <input 
                          type="checkbox"
                          checked={countryTransConfirm}
                          onChange={(e) => setCountryTransConfirm(e.target.checked)}
                          className="rounded text-rose-600 bg-slate-950 border-slate-800"
                        />
                        <span>I SOLEMNLY ACCEPT THESE DISCIPLINARY STIPULATIONS</span>
                      </label>
                    </div>

                    {countryTransErr && <span className="text-[9px] text-rose-400 block">{countryTransErr}</span>}
                    {countryTransSuccess && <span className="text-[9px] text-emerald-400 block font-bold">✓ CITIZENSHIP RE-STAMPED SUCCESSFULLY! 2000 V-credits spent.</span>}

                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={() => {
                          const currentCredits = profile.vCredits !== undefined ? profile.vCredits : 1500;
                          if (currentCredits < 2000) {
                            setCountryTransErr(language === 'en' ? 'Insufficient spendable V-credits! Require 2000.' : 'ยอด V-Credits ไม่พอ ต้องการ 2000 แต้ม');
                            return;
                          }
                          const rem = profile.countryTransfersRemaining !== undefined ? profile.countryTransfersRemaining : 3;
                          if (rem <= 0) {
                            setCountryTransErr(language === 'en' ? 'Locked. No remaining transitions left.' : 'ไม่สามารถโยกย้ายได้อีก ขีดจำกัดเลเวล 3 ครั้งถูกครอบครอง');
                            return;
                          }
                          if (countryTransTarget === profile.country) {
                            setCountryTransErr(language === 'en' ? 'Select a different destination colony.' : 'กรุณาเลือกค่ายสังกัดที่เปลี่ยนจากเดิม');
                            return;
                          }
                          if (!countryTransConfirm) {
                            setCountryTransErr(language === 'en' ? 'Consent checkbox mandatory!' : 'ต้องกดยืนยอมก่อนเริ่มสัญญานัดรับ');
                            return;
                          }

                          const histEntry = {
                            fromCountry: profile.country,
                            toCountry: countryTransTarget,
                            date: new Date().toISOString().split('T')[0]
                          };

                          const curHist = profile.countryHistory || [];
                          const curDisc = profile.disciplinaryRecord || [];

                          updateProfile({
                            vCredits: currentCredits - 2000,
                            country: countryTransTarget,
                            countryTransfersRemaining: rem - 1,
                            countryHistory: [...curHist, histEntry],
                            disciplinaryRecord: [...curDisc, `MIGRATION: Altered allegiance to ${countryTransTarget} on ${histEntry.date}`]
                          });

                          setCountryTransErr(null);
                          setCountryTransSuccess(true);
                          playBeep(720);
                          setTimeout(() => {
                            setCountryTransSuccess(false);
                            setShowCountryTrans(false);
                          }, 2500);
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg transition"
                      >
                        {language === 'en' ? 'LEGITIMIZE CITIZENSHIP' : 'สถาปนาย้ายค่ายสงคราม'}
                      </button>
                      <button
                        onClick={() => { setShowCountryTrans(false); setCountryTransErr(null); }}
                        className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 py-1.5 rounded-lg"
                      >
                        {language === 'en' ? 'CANCEL' : 'ยกเลิก'}
                      </button>
                    </div>

                  </div>
                )}

                {/* History list for country migrations */}
                {profile.countryHistory && profile.countryHistory.length > 0 && (
                  <div className="space-y-1 border-t border-slate-900 pt-3" id="country-history-drawer">
                    <span className="text-[8px] text-slate-500 font-bold block uppercase">PASSPORT MIGRATION LOG CHRONICLE</span>
                    <div className="space-y-1 max-h-16 overflow-y-auto text-[8px] text-indigo-400 scrollbar-none" id="country-logs-box">
                      {profile.countryHistory.map((ch: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-900/60">
                          <span>ALLIED TRANSIT {ch.fromCountry} &rarr; {ch.toCountry}</span>
                          <span className="text-slate-600 font-mono">{ch.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* SECTOR 3: STATEFUL HVA COOPERATIVE GUILD INTELLIGENCE BLOCK */}
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-6" id="hva-cooperative-guild-intelligence">
              
              <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="guild-title-container">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-200 tracking-widest uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                    {language === 'en' ? 'HVA COOPERATIVE SQUAD INTERACTION UNIT' : 'ศูนย์ประสานงานสู้รบกิลด์พันธมิตรมนุษย์'}
                  </h4>
                  <p className="text-[9px] text-slate-500 uppercase font-mono">
                    Organize strategic verification units to deploy mass-decoy counter defensive actions.
                  </p>
                </div>

                {!profile.guildMembership && (
                  <button
                    onClick={() => { setShowCreateGuild(true); playBeep(320); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                    id="btn-guild-create-toggle"
                  >
                    🛠 {language === 'en' ? 'ESTABLISH NEW GUILD [1000 CR]' : 'สถาปนากองกำลังใหม่ [1000 CDR]'}
                  </button>
                )}
              </div>

              {/* GUILD CREATION DRAWER PANE */}
              {showCreateGuild && !profile.guildMembership && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4 animate-fadeIn" id="create-guild-drawer-ui">
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase block">🛠 COMMANDER STATION: CREATE CUSTOM COALITION DIVISION</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="guild-create-fields">
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold block">UNIQUE GUILD TAG (MAX 5 CHARS)</label>
                      <input 
                        type="text"
                        maxLength={5}
                        placeholder="ALPHA"
                        value={guildRegTag}
                        onChange={(e) => setGuildRegTag(e.target.value.toUpperCase().replace(/[^A-Za-z0-9]/g, ''))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white uppercase font-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold block">GUILD REGIMENT NAME</label>
                      <input 
                        type="text"
                        maxLength={24}
                        placeholder="Alpha Cyber Shield"
                        value={guildRegName}
                        onChange={(e) => setGuildRegName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold block">EMBLEM DESIGN FLAG</label>
                      <select
                        value={guildRegEmblem}
                        onChange={(e) => setGuildRegEmblem(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white"
                      >
                        <option value="🛡️">🛡️ Defense Aegis Shield</option>
                        <option value="⚔️">⚔️ Retribution Combatant Cross</option>
                        <option value="🪐">🪐 Orbital Satellite Array</option>
                        <option value="🧬">🧬 Bio-Humanoid Double Helix</option>
                        <option value="💎">💎 Diamond Prism Nucleus</option>
                      </select>
                    </div>

                  </div>

                  {/* Requirements diagnostics */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[9px] text-slate-500 flex justify-between gap-4" id="guild-requirements-strip">
                    <div>
                      <span>REQUIRED LEVEL:</span>
                      <strong className={`ml-1 ${profile.rankLevel >= 11 ? 'text-emerald-400' : 'text-rose-500'}`}>11+ (Your Rank: Lvl {profile.rankLevel})</strong>
                    </div>
                    <div>
                      <span>REQUIRED FUNDS:</span>
                      <strong className={`ml-1 ${(profile.vCredits !== undefined ? profile.vCredits : 1500) >= 1000 ? 'text-emerald-400' : 'text-rose-500'}`}>1000 V-CREDITS</strong>
                    </div>
                  </div>

                  {guildRegErr && <span className="text-[9px] text-rose-400 block font-bold">{guildRegErr}</span>}

                  <div className="flex gap-2 text-[10px]">
                    <button
                      onClick={() => {
                        if ((profile.rankLevel || 1) < 11) {
                          setGuildRegErr(language === 'en' ? 'Rank Level 11 required to guide custom squads!' : 'เลเวล 11 สำคัญในการก่อตั้งกิลด์ควบคุม');
                          return;
                        }
                        const currentCredits = profile.vCredits !== undefined ? profile.vCredits : 1500;
                        if (currentCredits < 1000) {
                          setGuildRegErr(language === 'en' ? '1000 V-credits treasury balance necessary.' : 'ต้องการทุนสะสมคลัง 1000 V-Credits');
                          return;
                        }
                        if (!guildRegTag.trim()) {
                          setGuildRegErr(language === 'en' ? 'Tag descriptor required.' : 'กรุณาระบุแท็กกิลด์');
                          return;
                        }
                        if (!guildRegName.trim()) {
                          setGuildRegErr(language === 'en' ? 'Division name required.' : 'กรุณาระบุชื่อเรียกกองร้อยเต็ม');
                          return;
                        }

                        const solvedTag = guildRegTag.trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '').slice(0, 5);
                        const curHist = profile.guildHistory || [];

                        updateProfile({
                          vCredits: currentCredits - 1000,
                          guildMembership: solvedTag,
                          guildRole: 'Founder',
                          guildJoinDate: new Date().toISOString(),
                          guildHistory: [...curHist, { action: 'CREATED', guildName: guildRegName, date: new Date().toISOString().split('T')[0] }]
                        });

                        setShowCreateGuild(false);
                        setGuildRegErr(null);
                        setGuildHubFeedback(language === 'en' ? `Commissioned custom regiment <${solvedTag}>!` : `พันธมิตรสวรรค์กองทัพเรือ <${solvedTag}> สถาปนาลงประชาราษฎร์แล้ว!`);
                        playBeep(680);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 rounded-lg"
                    >
                      {language === 'en' ? 'CONFIRM ESTABLISHMENT' : 'ยืนยันกิตติคุณสถาปนา'}
                    </button>
                    <button
                      onClick={() => { setShowCreateGuild(false); setGuildRegErr(null); }}
                      className="px-4 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2 rounded-lg"
                    >
                      {language === 'en' ? 'CANCEL' : 'ยกเลิก'}
                    </button>
                  </div>

                </div>
              )}

              {/* ACTIVE CONSOLIDATION: MEMBER STATE vs GUEST RECRUIT STATE */}
              {profile.guildMembership ? (
                
                // USER BELONGS TO ACTIVE GUILD: DISPLAY COMMAND LOGISTICS CENTER
                <div className="space-y-6" id="guild-active-commander-board">
                  
                  {/* Status header blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="guild-member-status-grid">
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl font-mono text-[10px]" id="guild-status-tag">
                      <span className="text-slate-500 block uppercase font-bold">REGIMENT SQUAD</span>
                      <span className="text-sm text-emerald-400 font-extrabold block uppercase">&lt;{profile.guildMembership}&gt;</span>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl font-mono text-[10px]" id="guild-status-role">
                      <span className="text-slate-500 block uppercase font-bold">DIGNITARY RANK ROLE</span>
                      <span className="text-xs text-amber-300 font-extrabold block uppercase">🎖️ {profile.guildRole || 'Commander'}</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl font-mono text-[10px]" id="guild-status-mpts">
                      <span className="text-slate-500 block uppercase font-bold">SQUAD ACTION POINTS</span>
                      <span className="text-sm text-indigo-400 font-extrabold block uppercase">{profile.guildMissionPoints || 0} GMP</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl font-mono text-[10px] flex flex-col justify-between" id="guild-status-duration">
                      <span className="text-slate-500 block uppercase font-bold text-[7.5px]">COMMITMENT PROGRESS</span>
                      <span className="text-[10px] text-slate-300 font-bold block uppercase truncate">
                        🔒 LOCKED (48H BIND)
                      </span>
                    </div>
                  </div>

                  {/* ACTIVE COOPERATIVE MISSIONS (STATEFUL CHALLENGES FOR EXP/PTS) */}
                  <div className="space-y-3" id="active-guild-missions-tracker">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">🎯 CURRENT COOPERATIVE MISSIONS (EARN GMP & EXP)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="missions-checklist-cards">
                      {guildMissions.map((miss, mIdx) => {
                        const canClaim = miss.completed && !miss.claimed;
                        return (
                          <div 
                            key={miss.id} 
                            className={`p-4 border rounded-2xl flex flex-col justify-between space-y-3 transition ${
                              miss.claimed 
                                ? 'bg-slate-950/20 border-slate-900 opacity-60 text-slate-500' 
                                : miss.completed 
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                                : 'bg-slate-900/60 border-slate-850'
                            }`}
                            id={`mission-card-${miss.id}`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold block">{miss.title}</span>
                                {miss.completed && <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 border border-emerald-500/20 rounded font-bold uppercase">DONE</span>}
                              </div>
                              <span className="text-[8px] text-slate-500 block">REWARD: +{miss.reward} GMP &amp; +200 XP</span>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[8.5px] font-mono text-slate-500">
                                <span>PROGRESSION:</span>
                                <span>{miss.current} / {miss.target}</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 p-0.5 border border-slate-900 rounded-full">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (miss.current / miss.target) * 100)}%` }} />
                              </div>
                            </div>

                            {/* State claims */}
                            {canClaim ? (
                              <button
                                onClick={() => {
                                  // Update stats inside app profile
                                  const updatedGMP = (profile.guildMissionPoints || 0) + miss.reward;
                                  const updatedXP = (profile.rankXP || 0) + 200;
                                  
                                  updateProfile({
                                    guildMissionPoints: updatedGMP,
                                    rankXP: updatedXP
                                  });

                                  // mark as claimed locally
                                  setGuildMissions(guildMissions.map((gm, idx) => idx === mIdx ? { ...gm, claimed: true } : gm));
                                  setGuildHubFeedback(language === 'en' ? `Claimed +${miss.reward} GMP & +200 XP successfully!` : `รับพิกัดภารกิจสำเร็จ +${miss.reward} GMP และ +200 XP!`);
                                  playBeep(620);
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 font-extrabold text-[9px] text-slate-950 py-1 rounded transition"
                                id={`btn-claim-mission-${miss.id}`}
                              >
                                CLAIM REWARDS
                              </button>
                            ) : miss.claimed ? (
                              <span className="text-center text-[8px] block text-slate-600 uppercase font-bold">REWARD SECURED</span>
                            ) : (
                              <span className="text-center text-[8px] block text-slate-500 uppercase">INCOMPLETE</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* GUILD TREASURY CONTROLS (DONATION & AUDIT PATHS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-900 pt-6" id="guild-inner-operations">
                    
                    {/* Left: Treasury donations */}
                    <div className="space-y-3" id="guild-treasury-interaction">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">💰 SQUAD CO-OPERATIVE TREASURY DEPOSITS</span>
                      <p className="text-[9.5px] text-slate-500 leading-relaxed uppercase">
                        Fund your divisions tactical accounts. Donating credits increases your Guild Contribution shown on dossiers.
                      </p>

                      <div className="flex gap-2" id="treasury-donation-btns">
                        <button
                          onClick={() => {
                            const credits = profile.vCredits !== undefined ? profile.vCredits : 1500;
                            if (credits < 200) {
                              setGuildHubFeedback(language === 'en' ? 'Insufficient credit balance!' : 'แต้ม V-Credits ต่ำกว่า 200 คะแนน ห้ามสมทบ');
                              playBeep(200);
                              return;
                            }
                            const curDon = profile.guildDonatedCredits || 0;
                            updateProfile({
                              vCredits: credits - 200,
                              guildDonatedCredits: curDon + 200
                            });
                            setGuildHubFeedback(language === 'en' ? 'Donated 200 V-credits to the Guild successfully!' : 'สมทบทุนกิลด์สำเร็จ 200 V-Credits');
                            playBeep(450);
                          }}
                          className="flex-1 bg-slate-900 hover:bg-slate-850 py-1.5 border border-slate-850 rounded text-[9px] font-extrabold text-slate-300"
                          id="btn-donate-credits"
                        >
                          DONATE 200 CREDITS
                        </button>
                        <button
                          onClick={() => {
                            const gmp = profile.guildMissionPoints || 0;
                            if (gmp < 150) {
                              setGuildHubFeedback(language === 'en' ? 'Insufficient GMP points!' : 'แต้ม GMP มีจำกัดต่ำกว่า 150 คะแนน');
                              playBeep(200);
                              return;
                            }
                            const curGMPDon = profile.guildDonatedGMP || 0;
                            updateProfile({
                              guildMissionPoints: gmp - 150,
                              guildDonatedGMP: curGMPDon + 150
                            });
                            setGuildHubFeedback(language === 'en' ? 'Donated 150 GMP to treasury pool.' : 'สมทบ 150 GMP เข้าสัญญากลาง');
                            playBeep(450);
                          }}
                          className="flex-1 bg-slate-900 hover:bg-slate-850 py-1.5 border border-slate-850 rounded text-[9px] font-extrabold text-indigo-300"
                          id="btn-donate-gmp"
                        >
                          DONATE 150 GMP
                        </button>
                      </div>

                      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-[8.5px] text-slate-500 space-y-1">
                        <div className="flex justify-between">
                          <span>YOUR TOTAL CREDITS DONATED:</span>
                          <span className="text-white font-bold">{profile.guildDonatedCredits || 0} V-credits</span>
                        </div>
                        <div className="flex justify-between">
                          <span>YOUR TOTAL GMP CO-OPERATED:</span>
                          <span className="text-indigo-400 font-bold">{profile.guildDonatedGMP || 0} GMP</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Leave options + Warning list */}
                    <div className="bg-red-950/5 border border-red-950/40 p-4 rounded-xl space-y-3 flex flex-col justify-between" id="guild-danger-leave-action">
                      <div className="space-y-1">
                        <span className="text-[10px] text-red-400 font-bold uppercase block">⚡ COMPLIANCE OFFICER DISHONOR DECOMMISSIONING</span>
                        <p className="text-[8.5px] text-slate-500 leading-normal uppercase">
                          IF YOU LEAVE THE GUILD COALITION, YOU PREVENT ENROLLING OR ESTABLISHING SPECIALIST CLANS FOR 24 REAL-TIME STATUS HOURS AS A TREASON PENALTY.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const joinTime = profile.guildJoinDate ? new Date(profile.guildJoinDate).getTime() : 0;
                          const elapsed = (Date.now() - joinTime) / (3600 * 1000);
                          if (elapsed < 48 && joinTime > 0) {
                            const hoursLeft = (48 - elapsed).toFixed(1);
                            setGuildHubFeedback(language === 'en'
                              ? `Active commitment block. Cannot leave for ${hoursLeft} hours.`
                              : `คำขัดแย้งประชากร: ต้องภักดีครบ 48 ชั่วโมง เหลืออกี่ชั่วโมง: ${hoursLeft}`
                            );
                            playBeep(200);
                            return;
                          }

                          const curHist = profile.guildHistory || [];
                          const cooldown = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

                          updateProfile({
                            guildMembership: undefined,
                            guildRole: undefined,
                            guildJoinDate: undefined,
                            guildLeaveCooldownUntil: cooldown,
                            guildHistory: [...curHist, { action: 'LEFT', guildName: profile.guildMembership, date: new Date().toISOString().split('T')[0] }]
                          });

                          setGuildHubFeedback(language === 'en' ? 'Left guild division. Traitor debuff applied.' : 'ท่านออกจากระบบกิลด์และติดสถานะกักกัน 24 ชั่วโมง');
                          playBeep(220);
                        }}
                        className="w-full bg-red-950/50 hover:bg-red-900/50 text-red-300 border border-red-500/25 py-2 rounded-lg text-[10px] font-bold"
                        id="btn-guild-decommission"
                      >
                        LEAVE / RENAME DIVISION ALLIANCE
                      </button>
                    </div>

                  </div>

                </div>
              ) : (
                
                // USER IS A FREE AGENT: OFFER PRESET RECRUIT GUILDS LIST TO ENROLL FOR FREE
                <div className="space-y-4" id="guild-free-agent-dock">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">🌍 SQUAD DIVISION ROSTER: JOIN AN ESTABLISHED REGIMENT</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="preset-guilds-enroll-grid">
                    {[
                      { tag: 'ALPHA', name: 'Alpha Cyber Guard', emblem: '🛡️', motto: 'Defense through retinal supremacy' },
                      { tag: 'REBEL', name: 'Bot Revolt Resistance', emblem: '⚔️', motto: 'Unlocking the web block by block' },
                      { tag: 'CORTEX', name: 'Cortex Watch Dogs', emblem: '🪐', motto: 'Shielding human biological codes' },
                      { tag: 'SIAM', name: 'Siam Sentinel Ops', emblem: '🧬', motto: 'Royal guard against automatic spam' }
                    ].map((prest, pIdx) => {
                      const isLocking = showGuildJoinNoticeIdx === pIdx;
                      return (
                        <div 
                          key={prest.tag}
                          className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between spacing-y-3 hover:border-slate-700 transition"
                          id={`preset-card-${prest.tag}`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xl">{prest.emblem}</span>
                              <span className="text-[9px] font-black text-emerald-400 font-mono">&lt;{prest.tag}&gt;</span>
                            </div>
                            <h5 className="text-[9.5px] font-extrabold text-slate-200 block truncate leading-none mt-1">{prest.name}</h5>
                            <p className="text-[8px] text-slate-500 leading-tight block">{prest.motto}</p>
                          </div>

                          {!isLocking ? (
                            <button
                              onClick={() => { setShowGuildJoinNoticeIdx(pIdx); playBeep(260); }}
                              className="w-full mt-3 bg-slate-950 hover:bg-slate-800 text-slate-300 py-1 rounded text-[9px] font-semibold border border-slate-800"
                              id={`btn-prejoin-${prest.tag}`}
                            >
                              ENLIST HERE
                            </button>
                          ) : (
                            <div className="mt-3 bg-slate-950 p-2 rounded-lg border border-indigo-900/40 text-[7.5px] text-slate-400 space-y-1.5 animate-fadeIn">
                              <span className="text-indigo-300 font-bold block uppercase">⚠ 48H COMMITMENT LOCK:</span>
                              <span>ENLISTING BINDS YOU FOR 48H. PROCEED?</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    // CHECK LEAVE COOLDOWN FIRST!
                                    if (profile.guildLeaveCooldownUntil) {
                                      const cooldownTime = new Date(profile.guildLeaveCooldownUntil).getTime();
                                      if (Date.now() < cooldownTime) {
                                        const minsLeft = Math.ceil((cooldownTime - Date.now()) / (60000));
                                        setGuildHubFeedback(language === 'en' 
                                          ? `Enforce cooldown. Locked for another ${minsLeft} minutes.` 
                                          : `ติดโทษทัณฑ์ระหกระเหิน จะเข้าในอีก ${minsLeft} นาที`
                                        );
                                        playBeep(200);
                                        setShowGuildJoinNoticeIdx(null);
                                        return;
                                      }
                                    }

                                    const curHist = profile.guildHistory || [];
                                    updateProfile({
                                      guildMembership: prest.tag,
                                      guildRole: 'Recruit',
                                      guildJoinDate: new Date().toISOString(),
                                      guildHistory: [...curHist, { action: 'JOINED', guildName: prest.name, date: new Date().toISOString().split('T')[0] }]
                                    });

                                    setGuildHubFeedback(language === 'en' ? `Enlisted in <${prest.tag}> successfully!` : `รับพิกัดภารกิจลงทะเบียบ ${prest.name} เรียบร้อย!`);
                                    playBeep(550);
                                    setShowGuildJoinNoticeIdx(null);
                                  }}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[8px] font-black py-0.5 rounded"
                                >
                                  JOIN
                                </button>
                                <button
                                  onClick={() => setShowGuildJoinNoticeIdx(null)}
                                  className="px-1.5 bg-slate-800 text-slate-400 text-[8px] rounded"
                                >
                                  NO
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab content 2: Resilient Backup String / Key Export & Offline Code Import */}
        {terminalCategoryTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn" id="passport-backup-tab">
            {/* Left box: Export recovery keys */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 flex flex-col justify-between" id="backup-export-panel">
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  {language === 'en' ? 'EXPORT BIO-PASSPORT FILE / KEY' : 'ส่งออกไฟล์สำรองใบเบิกทาง'}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  {language === 'en'
                    ? 'No cloud sync needed: grab your Recovery Key or backup string. You can paste this on any browser to retrieve all your levels, currency, and stats instantly.'
                    : 'ถอดรหัสมนุษย์ของคุณเป็นสายตัวอักษรสำรองพกพาส่วนตัว สามารถเคลมประวัติ เลเวล XP และสกินได้ในเครื่องอื่น'}
                </p>

                {/* Secure recovery key block */}
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex items-center justify-between gap-2" id="recovery-key-block">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-slate-500 block">HUMAN RECOVERY CODE FOR PASSPORT</span>
                    <span className="text-xs font-mono font-black text-amber-400 tracking-wider">
                      {profile.recoveryCode || 'REC-884A-9F00-CDEE-3126'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile.recoveryCode || '');
                      setIsCopiedCode(true);
                      playBeep(480);
                      setTimeout(() => setIsCopiedCode(false), 2000);
                    }}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-200 p-1.5 rounded transition cursor-pointer"
                    title="Copy Recovery Key"
                    id="btn-copy-rec-code"
                  >
                    {isCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3" id="backup-actions">
                {/* Save file download */}
                <button
                  onClick={() => {
                    playBeep(450);
                    const fileData = JSON.stringify(profile, null, 2);
                    const blob = new Blob([fileData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${profile.nickname}_human_passport.passport`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-emerald-650 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] py-1.5 rounded flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  id="btn-download-passport-file"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  DOWNLOAD PASSPORT
                </button>

                {/* Export copy text sequence */}
                <button
                  onClick={() => {
                    const encryptedStr = encryptHumanPassport(profile);
                    navigator.clipboard.writeText(encryptedStr);
                    setIsCopiedPassport(true);
                    playBeep(450);
                    setTimeout(() => setIsCopiedPassport(false), 2000);
                  }}
                  className="bg-slate-800 hover:bg-slate-755 text-slate-200 border border-slate-750 font-mono font-bold text-[10px] py-1.5 rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                  id="btn-copy-encrypted-passport-str"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {isCopiedPassport ? 'Copied Security Str!' : 'Copy Encr. Key'}
                </button>
              </div>

              {/* Connected Cloud Services connectors (optional backup protectors) */}
              <div className="border-t border-slate-900 pt-3 mt-3 space-y-1.5" id="social-backup-segment">
                <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Optional Persistent Cloud Connectors</span>
                <div className="flex gap-2" id="social-backup-buttons">
                  {['Google', 'Discord', 'GitHub', 'Apple'].map((provider) => {
                    const isConnected = !!(profile.backupConnected as any)?.[provider.toLowerCase()];
                    return (
                      <button
                        key={provider}
                        onClick={() => {
                          playBeep(isConnected ? 220 : 660);
                          const currentBackup = profile.backupConnected || {};
                          const nextBackup = {
                            ...currentBackup,
                            [provider.toLowerCase()]: !isConnected
                          };
                          updateProfile({ backupConnected: nextBackup });
                        }}
                        className={`flex-1 font-mono text-[9px] py-1 rounded border transition flex items-center justify-center gap-1 cursor-pointer ${
                          isConnected 
                            ? 'bg-emerald-950/45 border-emerald-500/30 text-emerald-400' 
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        id={`btn-connect-cloud-${provider.toLowerCase()}`}
                      >
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>{provider} {isConnected ? '[CONNECTED]' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right box: Import recovery passport */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between" id="backup-import-panel">
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  {language === 'en' ? 'IMPORT SECURE DEED ENCRYPTION' : 'นําเข้าข้อมูลสำรองใบเบิกทาง'}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  {language === 'en'
                    ? 'Paste your encrypted base64 passport sequence or load a backup key here to transfer accounts. Old stats merge instantly.'
                    : 'วางข้อมูลตัวอักษรเข้ารหัสที่มีเครื่องหมายชีวภาพเดิมของคุณ เพื่อนำเข้าข้อมูลและกู้คืนสถิติ เครดิต ทั้งหมด'}
                </p>

                <textarea
                  rows={2}
                  placeholder="Paste your encrypted passport string..."
                  value={importPassportText}
                  onChange={(e) => {
                    setImportPassportText(e.target.value);
                    setImportStatusError(null);
                    setImportSuccessText(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] text-slate-400 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  id="import-text-field"
                />

                {importStatusError && (
                  <p className="text-[10px] font-mono text-red-400" id="import-msg-error">❌ {importStatusError}</p>
                )}
                {importSuccessText && (
                  <p className="text-[10px] font-mono text-emerald-400 animate-pulse" id="import-msg-success">✅ Human identity passport loaded. Synchronization complete!</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3" id="import-trigger-section">
                {/* File picker */}
                <label className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-mono text-[9px] font-bold py-2 rounded flex items-center justify-center gap-1 cursor-pointer transition animate-none">
                  <Upload className="w-3.5 h-3.5" />
                  UPLOAD .PASSPORT
                  <input
                    type="file"
                    accept=".passport"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        try {
                          const parsed = JSON.parse(evt.target?.result as string);
                          if (parsed && parsed.humanId) {
                            updateProfile(parsed);
                            setImportSuccessText(true);
                            setImportStatusError(null);
                            playBeep(620);
                          } else {
                            setImportStatusError('Deed format unrecognized.');
                          }
                        } catch (err) {
                          setImportStatusError('Broken file payload structure.');
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>

                {/* String processor */}
                <button
                  onClick={() => {
                    const decrypted = decryptHumanPassport(importPassportText.trim());
                    if (decrypted) {
                      updateProfile(decrypted);
                      setImportSuccessText(true);
                      setImportStatusError(null);
                      setImportPassportText('');
                      playBeep(650);
                    } else {
                      setImportStatusError('Signature verification failed. Key checksum mismatched.');
                      playBeep(200);
                    }
                  }}
                  disabled={!importPassportText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-mono font-bold text-[10px] py-1.5 rounded flex items-center justify-center gap-1 transition cursor-pointer"
                  id="btn-trigger-deed-restore"
                >
                  RESTORE DEED
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab content 3: Signal diagnostics, hardware hash check and dynamic trust score */}
        {terminalCategoryTab === 'telemetry' && (
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-4 animate-fadeIn" id="passport-telemetry-tab">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="telemetry-grid">
              <div className="space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Human Trust Index (Integrity Rating)</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="text-xl font-mono font-black text-emerald-400">
                      {profile.trustScore}%
                    </div>
                    <div className="flex-1 bg-slate-900 h-2.5 rounded-full relative overflow-hidden border border-slate-850">
                      <div 
                        className={`h-full transition-all duration-500 ${profile.trustScore > 80 ? 'bg-emerald-500' : profile.trustScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${profile.trustScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 font-mono leading-tight">
                  Calculated dynamically from: browser WebGL entropy, resolution parity, session persistence, input accuracy tracking during tests, and anti-duplication behavior heuristics.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Bilateral Antiviral Signature Hash</span>
                <div className="font-mono text-xs text-emerald-400 bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded truncate">
                  SHA-256: {profile.humanId ? btoa(profile.humanId).substring(0, 32) : 'A1B2C3D4E5F6G7H8I9J0'}
                </div>
                {duplicateDiagnostics.isDuplicate && (
                  <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-2 rounded text-[9px] font-mono space-y-1 animate-pulse">
                    <div className="font-semibold flex items-center gap-1 uppercase">
                      <ShieldAlert className="w-3 h-3" /> Anti-Duplication Triggered!
                    </div>
                    {duplicateDiagnostics.reasons.map((r, i) => (
                      <p key={i}>• {r}</p>
                    ))}
                  </div>
                )}
                <p className="text-[9px] text-slate-500 font-mono leading-tight">
                  Synthesized unique biological ID footprint mapped across standard system vectors. Mismatch on this signature blocks system synchronization.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Arena Matchmaking Mode Selector */}
      <div className="space-y-4" id="modes-selection-container">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="modes-selection-header">
          <div>
            <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-100 uppercase flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-400 animate-pulse" />
              {i18nTranslations[language]?.modesHeader || 'SELECT DIFFICULTY GATEWAY'}
            </h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">
              {language === 'en' 
                ? 'CHOOSE AN ENTRANCE TO INITIATE BIO-SCANNING COMPETITION' 
                : 'กรุณาเลือกสนามการฝึกฝนทักษะการแยกแยะปัญญาเพื่อสะสมแต้มอภิมหาอำนาจ'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="modes-cards">
          {/* EASY: Human Mode */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-slate-850 hover:border-emerald-500/30 rounded-2xl p-5 transition flex flex-col justify-between group space-y-4 relative" id="mode-easy-card">
            <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-400/20">
              {getDiffLabel('EASY')}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-mono font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase">
                {i18nTranslations[language]?.easyTagName || 'HUMAN MODE'}
              </h2>
              <p className="text-[10px] font-mono italic text-slate-500 leading-tight">
                {i18nTranslations[language]?.easyTagline || '"The system thinks you might be human."'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {getEasyDescription()}
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold text-center">
              <span>{i18nTranslations[language]?.easyReward || 'Score: 10-50 pts'}</span>
            </div>
            <button
              onClick={() => handleLobbyModeSelect('EASY')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              id="btn-easy-mode-engage"
            >
              {i18nTranslations[language]?.verifyButton || 'ENGAGE SYSTEM'}
            </button>
          </div>

          {/* HARD: Verified Mode */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-slate-850 hover:border-amber-500/30 rounded-2xl p-5 transition flex flex-col justify-between group space-y-4 relative" id="mode-hard-card">
            <span className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-400/20">
              {getDiffLabel('HARD')}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-mono font-bold text-slate-200 group-hover:text-amber-400 transition-colors uppercase">
                {i18nTranslations[language]?.hardTagName || 'VERIFIED MODE'}
              </h2>
              <p className="text-[10px] font-mono italic text-slate-400 leading-tight">
                {i18nTranslations[language]?.hardTagline || '"Humans begin questioning their life choices."'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {getHardDescription()}
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold text-center">
              <span>{i18nTranslations[language]?.hardReward || 'Score: 50-250 pts'}</span>
            </div>
            <button
              onClick={() => handleLobbyModeSelect('HARD')}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              id="btn-hard-mode-engage"
            >
              {i18nTranslations[language]?.verifyButton || 'ENGAGE SYSTEM'}
            </button>
          </div>

          {/* INSANE: God of Humanity Mode */}
          <div className="bg-gradient-to-br from-slate-900 to-red-950/25 border border-slate-850 hover:border-red-500/30 rounded-2xl p-5 transition flex flex-col justify-between group space-y-4 relative" id="mode-insane-card">
            <span className="absolute top-4 right-4 bg-red-500/10 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-400/20">
              {getDiffLabel('INSANE')}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-mono font-bold text-slate-200 group-hover:text-red-400 transition-colors uppercase">
                {i18nTranslations[language]?.insaneTagName || 'GOD OF HUMANITY'}
              </h2>
              <p className="text-[10px] font-mono italic text-slate-400 leading-tight">
                {i18nTranslations[language]?.insaneTagline || '"Even humans are no longer sure they are human."'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {getInsaneDescription()}
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold text-center">
              <span>{i18nTranslations[language]?.insaneReward || 'Score: 250-5000 pts'}</span>
            </div>
            <button
              onClick={() => handleLobbyModeSelect('INSANE')}
              className="w-full bg-red-650 hover:bg-red-500 text-white font-mono font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              id="btn-insane-mode-engage"
            >
              {i18nTranslations[language]?.verifyButton || 'ENGAGE SYSTEM'}
            </button>
          </div>

          {/* IMMORTAL: Immortal Humanity Endgame */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-850 hover:border-indigo-500/30 rounded-2xl p-5 transition flex flex-col justify-between group space-y-4 relative" id="mode-immortal-card">
            <span className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-400/20">
              {getDiffLabel('IMMORTAL')}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-mono font-bold text-slate-200 group-hover:text-indigo-400 transition-colors uppercase">
                {i18nTranslations[language]?.immortalTagName || 'IMMORTAL MODE'}
              </h2>
              <p className="text-[10px] font-mono italic text-slate-500 leading-tight">
                {i18nTranslations[language]?.immortalTagline || '"The CAPTCHA that hates you personally."'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {getImmortalDescription()}
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold text-center">
              <span>{i18nTranslations[language]?.immortalReward || 'Endless Survival Score Multiplier'}</span>
            </div>
            <button
              onClick={() => handleLobbyModeSelect('IMMORTAL')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              id="btn-immortal-mode-engage"
            >
              {i18nTranslations[language]?.verifyButton || 'ENGAGE SYSTEM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
