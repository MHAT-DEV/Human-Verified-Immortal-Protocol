import { useState, useEffect } from 'react';
import { PlayerProfile, CountryInfo, Difficulty } from './types';
import { Language, i18nTranslations } from './i18n';
import { syncDeviceToProfile, recordDeviceGameplay } from './utils/device';
import Lobby from './components/Lobby';
import ArenaGame from './components/ArenaGame';
import ResultsScreen from './components/ResultsScreen';
import GlobalHub from './components/GlobalHub';
import Shop from './components/Shop';
import GddTddViewer from './components/GddTddViewer';
import Onboarding from './components/Onboarding';
import SocialShareModal from './components/SocialShareModal';
import { 
  gatherIdentitySignals, 
  generateHumanId, 
  generateRecoveryCode, 
  backupIdToCookie, 
  backupIdToIndexedDB, 
  retrieveIdFromCookie, 
  retrieveIdFromIndexedDB, 
  calculateDynamicTrustScore, 
  assessDuplicateSimilarity 
} from './utils/identity';
import { ShieldAlert, LogOut, Ticket, Globe, MessageSquare, BookOpen, ShoppingBag, Joystick, Languages, Terminal, ExternalLink, HelpCircle, Share2, HelpCircle as Info } from 'lucide-react';

const INITIAL_PROFILE: PlayerProfile = {
  humanId: '',
  nickname: 'HumanCandidate',
  country: 'TH',
  rankName: 'Suspicious User',
  rankXP: 100,
  rankLevel: 1,
  vCredits: 500,
  score: 0,
  stats: {
    accuracy: 100,
    matchesPlayed: 0,
    fastestSolveMs: 0,
    longestStreak: 0,
    captchaSolved: 0,
    bossDamage: 0,
    easyCount: 0,
    hardCount: 0,
    insaneCount: 0,
    countryContribution: 0
  },
  purchasedBadges: ['Authorized'],
  activeBadge: 'Authorized',
  purchasedThemes: ['theme_classic'],
  activeTheme: 'theme_classic',
  trustScore: 100,
  recoveryCode: '',
  seasonProgress: 1,
  achievements: [],
  backupConnected: {}
};

const INITIAL_COUNTRIES: CountryInfo[] = [
  { code: 'TH', nameEn: 'Thailand', nameTh: 'ประเทศไทย', flag: '🇹🇭', score: 3450910, verifiedCount: 145020 },
  { code: 'JP', nameEn: 'Japan', nameTh: 'ประเทศญี่ปุ่น', flag: '🇯🇵', score: 3110400, verifiedCount: 129030 },
  { code: 'US', nameEn: 'United States', nameTh: 'สหรัฐอเมริกา', flag: '🇺🇸', score: 2980500, verifiedCount: 118400 },
  { code: 'DE', nameEn: 'Germany', nameTh: 'ประเทศเยอรมนี', flag: '🇩🇪', score: 2410200, verifiedCount: 96300 },
  { code: 'KR', nameEn: 'South Korea', nameTh: 'ประเทศเกาหลีใต้', flag: '🇰🇷', score: 2150600, verifiedCount: 88500 },
  { code: 'FR', nameEn: 'France', nameTh: 'ประเทศฝรั่งเศส', flag: '🇫🇷', score: 1890300, verifiedCount: 75100 },
  { code: 'GB', nameEn: 'United Kingdom', nameTh: 'สหราชอาณาจักร', flag: '🇬🇧', score: 1750100, verifiedCount: 69800 },
  { code: 'BR', nameEn: 'Brazil', nameTh: 'ประเทศบราซิล', flag: '🇧🇷', score: 1420800, verifiedCount: 57400 },
  { code: 'IN', nameEn: 'India', nameTh: 'ประเทศอินเดีย', flag: '🇮🇳', score: 1110900, verifiedCount: 46100 }
];

export const LANGUAGE_OPTIONS: { code: Language, flag: string, native: string, enName: string }[] = [
  { code: 'th', flag: '🇹🇭', native: 'ภาษาไทย', enName: 'Thai' },
  { code: 'en', flag: '🇺🇸', native: 'English', enName: 'English' },
  { code: 'zh', flag: '🇨🇳', native: '简体中文', enName: 'Simplified Chinese' },
  { code: 'es', flag: '🇪🇸', native: 'Español', enName: 'Spanish' },
  { code: 'pt', flag: '🇧🇷', native: 'Português', enName: 'Brazilian Portuguese' },
  { code: 'ru', flag: '🇷🇺', native: 'Русский', enName: 'Russian' },
  { code: 'ja', flag: '🇯🇵', native: '日本語', enName: 'Japanese' },
  { code: 'ko', flag: '🇰🇷', native: '한국어', enName: 'Korean' },
  { code: 'id', flag: '🇮🇩', native: 'Bahasa Indonesia', enName: 'Indonesian' },
  { code: 'vi', flag: '🇻🇳', native: 'Tiếng Việt', enName: 'Vietnamese' }
];

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(INITIAL_PROFILE);
  const [countries, setCountries] = useState<CountryInfo[]>(INITIAL_COUNTRIES);
  const [bossHealth, setBossHealth] = useState<number>(78540210);
  const [language, setLanguage] = useState<Language>('th'); // Thai is the absolute default

  // Language customization popups & confirmation workflow states
  const [showLanguageRecommend, setShowLanguageRecommend] = useState<boolean>(false);
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('th');
  const [pendingLanguageSave, setPendingLanguageSave] = useState<Language | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Social share dynamic states
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [socialShareEvent, setSocialShareEvent] = useState<'level_up' | 'rank_up' | 'country_milestone' | 'win_streak' | 'boss_kill' | 'achievement' | 'immortal' | 'generic'>('generic');

  // Screen routes: 'onboarding' | 'lobby' | 'queue' | 'arena' | 'results' | 'hub' | 'shop' | 'docs'
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'lobby' | 'queue' | 'arena' | 'results' | 'hub' | 'shop' | 'docs'>('lobby');
  const [isInitializingIdentity, setIsInitializingIdentity] = useState<boolean>(true);
  
  // Game session parameters
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('EASY');
  const [lastGameResult, setLastGameResult] = useState<{
    pointsEarned: number;
    solvedCount: number;
    accuracy: number;
    solveTimeMs: number;
  } | null>(null);

  // Matchmaking queue visual simulation variables
  const [queueCountdown, setQueueCountdown] = useState<number>(4);
  const [queueText, setQueueText] = useState<string>('Calibrating Neural Sync...');

  // Sound generator parameters
  const beepTone = (frequency: number, duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Load persistence states on startup
  useEffect(() => {
    const initIdentity = async () => {
      let savedProfileStr = localStorage.getItem('human_arena_profile_v2');
      let loadedProfile: PlayerProfile | null = null;
      
      if (savedProfileStr) {
        try {
          loadedProfile = JSON.parse(savedProfileStr);
        } catch (e) {}
      }

      // 1. Try backup from Cookie if localStorage is wiped
      if (!loadedProfile || !loadedProfile.humanId) {
        const cookieBackup = retrieveIdFromCookie();
        if (cookieBackup) {
          loadedProfile = {
            ...INITIAL_PROFILE,
            humanId: cookieBackup.humanId,
            recoveryCode: cookieBackup.recoveryCode,
            nickname: `RestoredHuman_${cookieBackup.humanId.split('-')[1] || ''}`
          };
        }
      }

      // 2. Try backup from IndexedDB
      if (!loadedProfile || !loadedProfile.humanId) {
        const idbBackup = await retrieveIdFromIndexedDB();
        if (idbBackup) {
          try {
            loadedProfile = JSON.parse(idbBackup.profileJson);
          } catch (e) {}
        }
      }

      // 3. Complete verification if profile loaded
      const detectedResult = (() => {
        // Priority A: Saved preference with language lock of Human Passport
        if (loadedProfile?.language && loadedProfile?.localizationPreferences?.languageLock) {
          return { lang: loadedProfile.language as Language, src: 'passport' as const, confirmed: true };
        }
        // Priority B: Local storage
        const localSaved = localStorage.getItem('language');
        if (localSaved) {
          return { lang: localSaved as Language, src: 'manual_selection' as const, confirmed: true };
        }
        // Priority C: Saved language on recovery profile
        if (loadedProfile?.language) {
          return { lang: loadedProfile.language as Language, src: 'passport' as const, confirmed: !!loadedProfile.languageConfirmed };
        }
        // Priority D: Device/Browser languages list sequence
        const navLangs = navigator.languages || [navigator.language];
        for (const l of navLangs) {
          const cl = l.toLowerCase();
          if (cl.startsWith('th')) return { lang: 'th' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('zh')) return { lang: 'zh' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('es')) return { lang: 'es' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('pt')) return { lang: 'pt' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('ru')) return { lang: 'ru' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('ja')) return { lang: 'ja' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('ko')) return { lang: 'ko' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('id')) return { lang: 'id' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('vi')) return { lang: 'vi' as Language, src: 'auto_device' as const, confirmed: false };
          if (cl.startsWith('en')) return { lang: 'en' as Language, src: 'auto_device' as const, confirmed: false };
        }
        // Priority E: Geo-IP simulated via fallback country profile mapped language
        if (loadedProfile?.country) {
          const mapping: Record<string, Language> = {
            TH: 'th', JP: 'ja', KR: 'ko', CN: 'zh', ES: 'es', BR: 'pt', DE: 'en', FR: 'en'
          };
          if (mapping[loadedProfile.country]) {
            return { lang: mapping[loadedProfile.country], src: 'auto_device' as const, confirmed: false };
          }
        }
        // Priority F: Default Thai fallback
        return { lang: 'th' as Language, src: 'fallback' as const, confirmed: false };
      })();

      setLanguage(detectedResult.lang);
      setDetectedLanguage(detectedResult.lang);

      if (loadedProfile && loadedProfile.humanId) {
        const calculatedTrust = calculateDynamicTrustScore(loadedProfile);
        const dupCheck = assessDuplicateSimilarity(loadedProfile);
        let finalTrust = calculatedTrust;
        if (dupCheck.isDuplicate) {
          finalTrust = Math.max(10, finalTrust - dupCheck.scoreDeduction);
        }

        let updatedProfile: PlayerProfile = {
          ...loadedProfile,
          trustScore: finalTrust,
          language: detectedResult.lang,
          languageSource: detectedResult.src,
          languageConfirmed: detectedResult.confirmed
        };
        updatedProfile = syncDeviceToProfile(updatedProfile);

        setProfile(updatedProfile);
        localStorage.setItem('human_arena_profile_v2', JSON.stringify(updatedProfile));
        setCurrentScreen('lobby');

        // Offer recommended language confirm flow if not confirmed yet
        if (!detectedResult.confirmed) {
          setShowLanguageRecommend(true);
        }
      } else {
        // First onboarding entry
        setCurrentScreen('onboarding');
        setShowLanguageRecommend(true); 
      }

      setIsInitializingIdentity(false);
    };

    initIdentity();

    const savedCountries = localStorage.getItem('human_arena_countries_v2');
    if (savedCountries) {
      try {
        setCountries(JSON.parse(savedCountries));
      } catch (e) {}
    }

    const savedBoss = localStorage.getItem('human_arena_boss_v2');
    if (savedBoss) {
      const val = parseInt(savedBoss, 10);
      if (!isNaN(val)) setBossHealth(val);
    }
  }, []);

  // Sync profile edits to persistence
  const updateProfile = (updated: Partial<PlayerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('human_arena_profile_v2', JSON.stringify(next));
      return next;
    });
  };

  const updateCountriesData = (updated: CountryInfo[]) => {
    setCountries(updated);
    localStorage.setItem('human_arena_countries_v2', JSON.stringify(updated));
  };

  const damageBoss = (dmg: number) => {
    setBossHealth((prev) => {
      const next = Math.max(0, prev - dmg);
      localStorage.setItem('human_arena_boss_v2', next.toString());
      return next;
    });
  };

  // Simulated AI core regeneration & world tick
  useEffect(() => {
    const interval = setInterval(() => {
      // 5% chance the boss recovers a small bit, or other players deal passive damage
      setBossHealth((prev) => {
        const damageDealtByOthers = Math.floor(Math.random() * 450) + 120;
        const next = Math.max(10, prev - damageDealtByOthers);
        localStorage.setItem('human_arena_boss_v2', next.toString());
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Queue simulation countdown
  useEffect(() => {
    if (currentScreen !== 'queue') return;

    const queuePrompts = [
      'Calibrating front-end retinal sweep...',
      'Syncing bio-coordinates with global subnet...',
      'Detecting macro-injection frequency...',
      'Target match found! Loading CAPTCHA pack...'
    ];

    if (queueCountdown > 0) {
      const timer = setTimeout(() => {
        setQueueCountdown(prev => prev - 1);
        setQueueText(queuePrompts[4 - queueCountdown] || 'Synchronizing keys...');
        beepTone(360 + queueCountdown * 55, 0.08);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      beepTone(880, 0.25);
      setCurrentScreen('arena');
    }
  }, [queueCountdown, currentScreen]);

  const handleStartMatchmaking = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setQueueCountdown(4);
    setQueueText('Scanning biological neural signatures...');
    setCurrentScreen('queue');
    beepTone(520, 0.15);
  };

  // Handle finished game resolution, award points, credits, check for levels, and compute ranks
  const handleFinishMatch = (results: {
    totalPointsEarned: number;
    solvedCount: number;
    accuracy: number;
    solveTimeMs: number;
  }) => {
    setLastGameResult(results);

    // Apply currency, score, and compute rank upgrade
    const xpReward = results.totalPointsEarned;
    const creditReward = Math.round(results.totalPointsEarned * 0.1);

    let nextXP = profile.rankXP + xpReward;
    let nextLevel = profile.rankLevel;
    let xpNeeded = nextLevel * 500;

    // Handle level escalation loops
    while (nextXP >= xpNeeded) {
      nextXP -= xpNeeded;
      nextLevel += 1;
      xpNeeded = nextLevel * 500;
      beepTone(1100, 0.4); // level up fanfare note!
    }

    // Humane ranks designations
    let nextRankName = 'Suspicious User';
    const totalScore = profile.score + results.totalPointsEarned;

    if (totalScore > 20000) {
      nextRankName = 'Humanity Overlord';
    } else if (totalScore > 11000) {
      nextRankName = 'Captcha Master';
    } else if (totalScore > 6000) {
      nextRankName = 'Anti-Bot Specialist';
    } else if (totalScore > 3000) {
      nextRankName = 'Human Verified';
    } else if (totalScore > 1000) {
      nextRankName = 'Probably Human';
    }

    // Update statistics registers
    const currentModeEasyCount = selectedDifficulty === 'EASY' ? results.solvedCount : 0;
    const currentModeHardCount = selectedDifficulty === 'HARD' ? results.solvedCount : 0;
    const currentModeInsaneCount = selectedDifficulty === 'INSANE' ? results.solvedCount : 0;

    const updatedProfileStats = {
      accuracy: Math.round((profile.stats.accuracy + results.accuracy) / 2),
      matchesPlayed: profile.stats.matchesPlayed + 1,
      fastestSolveMs: profile.stats.fastestSolveMs === 0 || results.solveTimeMs < profile.stats.fastestSolveMs 
        ? results.solveTimeMs 
        : profile.stats.fastestSolveMs,
      longestStreak: results.solvedCount > profile.stats.longestStreak ? results.solvedCount : profile.stats.longestStreak,
      captchaSolved: profile.stats.captchaSolved + results.solvedCount,
      bossDamage: profile.stats.bossDamage + results.totalPointsEarned,
      easyCount: profile.stats.easyCount + currentModeEasyCount,
      hardCount: profile.stats.hardCount + currentModeHardCount,
      insaneCount: profile.stats.insaneCount + currentModeInsaneCount,
      countryContribution: profile.stats.countryContribution + results.totalPointsEarned
    };

    const baseProfileUpdates = {
      score: totalScore,
      vCredits: profile.vCredits + creditReward,
      rankLevel: nextLevel,
      rankXP: nextXP,
      rankName: nextRankName,
      stats: updatedProfileStats
    };

    const intermediateProfile = {
      ...profile,
      ...baseProfileUpdates
    };

    const deviceClass = profile.deviceType || 'DESKTOP';
    const finalProfileAfterDevice = recordDeviceGameplay(
      intermediateProfile,
      deviceClass,
      results.solvedCount > 0,
      results.solveTimeMs
    );

    setProfile(finalProfileAfterDevice);
    localStorage.setItem('human_arena_profile_v2', JSON.stringify(finalProfileAfterDevice));

    // Update Country scoreboard
    const updatedCountries = countries.map(c => {
      if (c.code === profile.country) {
        return {
          ...c,
          score: c.score + results.totalPointsEarned,
          verifiedCount: c.verifiedCount + results.solvedCount
        };
      }
      return c;
    });

    updateCountriesData(updatedCountries);

    // Damage World boss
    damageBoss(results.totalPointsEarned);

    setCurrentScreen('results');
  };

  const handleCancelMatch = () => {
    setCurrentScreen('lobby');
    beepTone(220, 0.2);
  };

  const selectLanguage = (selected: Language) => {
    beepTone(440, 0.05);
    setLanguage(selected);
    setPendingLanguageSave(selected);
    setLanguageDropdownOpen(false);
  };

  const confirmPermanentLanguageSave = () => {
    if (!pendingLanguageSave) return;
    beepTone(880, 0.15);
    
    // Save state to profile and locks permanently
    const nextLockedPrefs = {
      ...(profile.localizationPreferences || {}),
      languageLock: true
    };

    updateProfile({
      language: pendingLanguageSave,
      languageSource: 'manual_selection',
      languageConfirmed: true,
      localizationPreferences: nextLockedPrefs
    });

    // Mirror to standard localStorage & Cookie/IDB backup triggers
    localStorage.setItem('language', pendingLanguageSave);
    backupIdToCookie(profile.humanId, profile.recoveryCode);
    backupIdToIndexedDB(profile.humanId, {
      ...profile,
      language: pendingLanguageSave,
      languageConfirmed: true,
      localizationPreferences: nextLockedPrefs
    });

    // Trigger feedback message
    const nativeName = LANGUAGE_OPTIONS.find(l => l.code === pendingLanguageSave)?.native || pendingLanguageSave;
    const toastMsg = pendingLanguageSave === 'en' 
      ? `Preferred language saved permanently: ${nativeName}!` 
      : pendingLanguageSave === 'th'
      ? `บันทึกภาษาที่ตั้งค่าไว้อย่างถาวรแล้ว: ${nativeName}!`
      : `Preferred language locked: ${nativeName}!`;
    
    setToastNotification(toastMsg);
    setPendingLanguageSave(null);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  const cancelPermanentLanguageSave = () => {
    beepTone(220, 0.12);
    setPendingLanguageSave(null);
  };

  const trans = i18nTranslations[language];

  // Map user checkmark custom neon colors from shop purchases
  const getThemeClass = () => {
    if (profile.activeTheme === 'theme_crt') return 'text-emerald-500 bg-black border-emerald-600 font-mono shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    if (profile.activeTheme === 'theme_purple') return 'text-purple-400 bg-purple-950/20 border-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.3)]';
    if (profile.activeTheme === 'theme_cyber') return 'text-rose-500 bg-rose-950/20 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
    return 'text-emerald-400 bg-emerald-950/30 border-emerald-500 shadow-md';
  };

  if (isInitializingIdentity) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-mono gap-4" id="identity-init-spinner">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <div className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">
          Calibrating biological signatures...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500/30" id="main-app-shell">
      
      {/* 1. TOP GLOBAL HUD HEADER */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4" id="header-inner">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center text-lg font-black tracking-tight transition-all duration-300 ${getThemeClass()}`} id="logo-branding-checkmark">
              ✓
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono tracking-tighter text-slate-100">
                {trans.title}
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {language === 'en' ? 'THE BIOMECHANICAL VERIFICATION ARENA' : 'สมรภูมิพิสูจน์ลมหายใจมนุษย์'}
              </p>
            </div>
          </div>

          {/* Quick HUD details */}
          <div className="flex items-center gap-4 flex-wrap" id="header-user-status">
            {currentScreen !== 'onboarding' && (
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2" id="header-stats-panel">
                <span className="text-slate-500 text-[10px] uppercase font-mono">{language === 'en' ? 'V-CREDITS' : 'เครดิต'}:</span>
                <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                  {profile.vCredits.toLocaleString()}
                </span>
              </div>
            )}

            {/* Organic Viral Recruitment campaign button */}
            <button
              onClick={() => {
                setSocialShareEvent('generic');
                setIsSocialShareOpen(true);
                beepTone(445, 0.08);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-md transition cursor-pointer"
              id="global-share-recruit-btn"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'PROPAGANDA' : 'ใบประกาศ/ชวนเพื่อน'}</span>
            </button>

            {/* Fully Custom Multilingual Popover Selector */}
            <div className="relative" id="language-selector-wrapper">
              <button
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen);
                  beepTone(350, 0.05);
                }}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-slate-100 transition cursor-pointer"
                id="btn-language-selector"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>{trans.languageName}</span>
                <span className="text-[10px] text-slate-500 ml-1">▼</span>
              </button>

              {languageDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 divide-y divide-slate-900/50" 
                  id="language-dropdown-panel"
                >
                  <div className="py-1 px-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900">
                    {language === 'en' ? 'SELECT TRANSLATION UNIT' : 'เลือกหน่วยถอดรหัสภาษา'}
                  </div>
                  <div className="max-h-64 overflow-y-auto pt-1 space-y-0.5" id="language-options-list">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => selectLanguage(opt.code)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                          language === opt.code 
                            ? 'bg-slate-900 text-emerald-400 font-bold' 
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                        }`}
                        id={`lang-opt-${opt.code}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{opt.flag}</span>
                          <span>{opt.native}</span>
                        </span>
                        <span className="text-[9px] text-slate-500 font-normal">{opt.enName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION INTERNAL RAIL TABS */}
      {currentScreen !== 'arena' && currentScreen !== 'queue' && currentScreen !== 'onboarding' && (
        <div className="bg-slate-950/30 border-b border-slate-900/60 py-2.5 px-6" id="app-sub-nav">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none" id="sub-nav-tabs">
            <button
              onClick={() => { setCurrentScreen('lobby'); beepTone(380, 0.05); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                currentScreen === 'lobby' || currentScreen === 'results' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-lobby-launcher"
            >
              <Joystick className="w-3.5 h-3.5" />
              <span>{trans.lobbyTab}</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('hub'); beepTone(380, 0.05); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                currentScreen === 'hub' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-global-defense"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{trans.globalHubTab}</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('shop'); beepTone(380, 0.05); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                currentScreen === 'shop' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-shop-cosmetics"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{trans.storeTab}</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('docs'); beepTone(380, 0.05); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                currentScreen === 'docs' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
              id="tab-gdd-tdd"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{trans.gddTddTab}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN DYNAMIC BODY VIEW */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col justify-center" id="main-content-fluid">
        
        {/* ONBOARDING SCREEN */}
        {currentScreen === 'onboarding' && (
          <Onboarding
            language={language}
            countries={countries}
            onEnterHumanity={(nickname, country, displayName, alias) => {
              const signals = gatherIdentitySignals();
              const humanId = generateHumanId(signals);
              const recoveryCode = generateRecoveryCode();
              
              const randomNicks = ['CarbonHunter', 'NerveWarr', 'MindSentry', 'CellPulse', 'GridSmasher', 'BioKeeper', 'ProtonPulse', 'CortexLock'];
              const resolvedNick = nickname.trim() || `${randomNicks[Math.floor(Math.random() * randomNicks.length)]}`;
              const suffix = humanId.split('-')[1] || '8F2A91';
              
              const newProfile: PlayerProfile = {
                ...INITIAL_PROFILE,
                humanId,
                nickname: resolvedNick,
                displayName: displayName || 'Agent Recruit',
                alias: alias || 'BOT_HUNTER',
                country,
                recoveryCode,
                trustScore: 100,
                seasonProgress: 1,
                achievements: ['Onboarding Pass'],
                vCredits: 1500, // Boost starting points so they can experiment with name change or guild creation
                activeBadge: alias || 'BOT_HUNTER',
                
                // NEW CLASSIFIED DATA FOR MILITARY DOSSIER
                accountCreatedDate: new Date().toISOString().split('T')[0],
                lastActivityDate: new Date().toISOString().split('T')[0],
                agentNumber: `HVA-${country}-${suffix}`,
                serviceNumber: `MSN-${Math.floor(Math.random() * 80000) + 10000}-A`,
                unitAssignment: 'Alpha Outbreak Squad',
                division: 'Anti-Bot Strike Force',
                specialization: 'Image Analysis',
                deploymentStatus: 'ACTIVE',
                clearanceLevel: 'C0',
                combatRating: 150,
                verificationEfficiency: 92,
                threatAssessment: 'NO THREAT',
                disciplinaryRecord: ['NO VIOLATIONS LOGGED. INDUCTION COMPLETE.'],
                
                // Name history
                callSignLocked: true,
                nameChangesRemaining: 10,
                nameHistory: [],
                
                // Country history
                countryTransfersRemaining: 3,
                countryHistory: [],
                
                // Guild attributes
                guildRole: 'Recruit',
                guildHistory: [],
                guildMissionPoints: 0,
                guildDonatedCredits: 0,
                guildDonatedGMP: 0,
                
                campaignHistory: [],
                seasonHistory: [
                  { seasonId: 'S1', finalTier: 1, pointsEarned: 0, date: new Date().toISOString().split('T')[0] }
                ],
                stats: {
                  ...INITIAL_PROFILE.stats,
                  countryContribution: 0
                }
              };
              
              const syncedProfile = syncDeviceToProfile(newProfile);

              setProfile(syncedProfile);
              localStorage.setItem('human_arena_profile_v2', JSON.stringify(syncedProfile));
              
              // Seed backups
              backupIdToCookie(humanId, recoveryCode);
              backupIdToIndexedDB(humanId, syncedProfile);
              
              setCurrentScreen('lobby');
              beepTone(660, 0.15);
            }}
          />
        )}

        {/* MATCHMAKING QUEUE INTERACTIVE ANIMATION */}
        {currentScreen === 'queue' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-6 shadow-2xl relative" id="matchmaking-container">
            <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(16,185,129,0.05) 0%, transparent 70%) pointer-events-none" />
            
            {/* Pulsating radar logo */}
            <div className="relative w-24 h-24 mx-auto" id="queue-radar-orb">
              <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping" />
              <div className="absolute inset-3 rounded-full border border-emerald-500/20 animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center font-mono font-black text-emerald-400 text-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {queueCountdown}
              </div>
            </div>

            <div className="space-y-2" id="queue-descriptions">
              <h1 className="text-xl font-bold font-mono text-slate-100 tracking-tight flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {queueText}
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Compiling randomized anti-macro captcha boards matching difficulty metrics. Syncing clock rate.'
                  : 'ระบบกำลังรวมแกนพัซเซิลแบบสุ่มพิกัดล่อ เพื่อขัดขวางมาโครบอทนำทางภายนอก'}
              </p>
            </div>

            {/* Quick matchmaking player connectivity board */}
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl max-w-sm mx-auto space-y-2 text-left" id="peers-queue-feed">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{trans.playersReady}</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400" id="peers-queue-list">
                <div className="flex items-center gap-1 text-emerald-400">✅ {profile.nickname}</div>
                <div className="flex items-center gap-1 text-slate-300">⚡ Yuki_JP</div>
                <div className="flex items-center gap-1 text-slate-300">⚡ Hans_DE</div>
                <div className="flex items-center gap-1 text-slate-300">⚡ Sanjay_IN</div>
              </div>
            </div>
            
            <button
              onClick={handleCancelMatch}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono font-medium underline transition"
              id="btn-quit-queue"
            >
              {language === 'en' ? 'Quit matchmaking queue' : 'ออกจากคิวต่อสาย'}
            </button>
          </div>
        )}

        {/* PROFILE SETUP / LOBBY ENTRY POINT */}
        {currentScreen === 'lobby' && (
          <Lobby
            profile={profile}
            updateProfile={updateProfile}
            language={language}
            countries={countries}
            onStartMatchmaking={handleStartMatchmaking}
          />
        )}

        {/* ACTIVE CAPTCHA GAUNTLET */}
        {currentScreen === 'arena' && (
          <ArenaGame
            profile={profile}
            difficulty={selectedDifficulty}
            language={language}
            onFinishMatch={handleFinishMatch}
            onCancelMatch={handleCancelMatch}
          />
        )}

        {/* OUTCOME SUMMARY REPORT SCREEN */}
        {currentScreen === 'results' && lastGameResult && (
          <ResultsScreen
            pointsEarned={lastGameResult.pointsEarned}
            solvedCount={lastGameResult.solvedCount}
            accuracy={lastGameResult.accuracy}
            solveTimeMs={lastGameResult.solveTimeMs}
            difficulty={selectedDifficulty}
            language={language}
            onReturnToLobby={() => { setCurrentScreen('lobby'); beepTone(400, 0.08); }}
            onOpenShareModal={(evtType) => {
              setSocialShareEvent(evtType);
              setIsSocialShareOpen(true);
              beepTone(445, 0.08);
            }}
          />
        )}

        {/* GLOBAL DEFENSE HUB (World Raid + Countries war board) */}
        {currentScreen === 'hub' && (
          <GlobalHub
            profile={profile}
            updateProfile={updateProfile}
            language={language}
            countries={countries}
            updateCountries={updateCountriesData}
            bossHealth={bossHealth}
            damageBoss={damageBoss}
          />
        )}

        {/* UNLOCK COSMETIC STORE */}
        {currentScreen === 'shop' && (
          <Shop
            profile={profile}
            updateProfile={updateProfile}
            language={language}
          />
        )}

        {/* INCIDENT REPORT / GDD / TDD SPECS FOR Product Owner */}
        {currentScreen === 'docs' && (
          <GddTddViewer language={language} />
        )}

      </main>

      {/* 4. FOOTER & COMPRESSED CREDITS LINES */}
      <footer className="border-t border-slate-905 bg-slate-950/80 p-5 mt-6" id="app-footer-node">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500" id="footer-inner-wrapper">
          <div id="footer-build-signature">
            © 2026 HUMAN VERIFIED ARENA. All rights reserved.
          </div>
          <div className="flex items-center gap-2" id="footer-credits-setting">
            <span>{trans.creditFooter}</span>
          </div>
        </div>
      </footer>

      {/* ================= MODAL, TOAST & PORTAL LAYERS ================= */}

      {/* 1. FIRST-VISIT DYNAMIC RECOMMENDED LANGUAGE CONSENT DIALOG */}
      {showLanguageRecommend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" id="recommend-lang-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative" id="recommend-lang-card">
            <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(16,185,129,0.03) 0%, transparent 70%) pointer-events-none" />
            
            {/* Holographic Header badge */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400" id="recommend-icon">
              <Languages className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-2" id="recommend-title-seg">
              <h3 className="text-lg font-bold font-mono tracking-tight text-slate-100 uppercase">
                {detectedLanguage === 'th' ? 'พบพิกัดการถอดรหัสภาษาไทย' : 'Biological Language Detected'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
                We detected your regional cognitive preference is best matched with the translation matrix below. Choose to authorize this localized pipeline or select your manual configuration.
              </p>
            </div>

            {/* Recomended Language Segment box */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4" id="recommend-selection-card">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">
                  {LANGUAGE_OPTIONS.find(l => l.code === detectedLanguage)?.flag || '🇹🇭'}
                </span>
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider font-bold">Recommended Matrix</span>
                  <span className="text-sm font-bold font-mono text-slate-200">
                    {LANGUAGE_OPTIONS.find(l => l.code === detectedLanguage)?.native || detectedLanguage} ({LANGUAGE_OPTIONS.find(l => l.code === detectedLanguage)?.enName})
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-500/10">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                AUTO SELECT
              </span>
            </div>

            {/* Quick Action triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="recommend-lang-actions">
              <button
                onClick={() => {
                  setLanguage(detectedLanguage);
                  setPendingLanguageSave(detectedLanguage);
                  setShowLanguageRecommend(false);
                  
                  // Instantly save
                  beepTone(880, 0.15);
                  const nextLockedPrefs = {
                    ...(profile.localizationPreferences || {}),
                    languageLock: true
                  };
                  updateProfile({
                    language: detectedLanguage,
                    languageSource: 'auto_device',
                    languageConfirmed: true,
                    localizationPreferences: nextLockedPrefs
                  });
                  localStorage.setItem('language', detectedLanguage);
                  setPendingLanguageSave(null);
                  setToastNotification(detectedLanguage === 'th' ? 'กู้คืนตำแหน่งการตั้งค่าภาษาไทยเรียบร้อย!' : 'Successfully synchronized language choice!');
                  setTimeout(() => {
                    setToastNotification(null);
                  }, 4500);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold py-3 rounded-xl transition cursor-pointer shadow-lg"
                id="btn-confirm-recommended-lang"
              >
                {detectedLanguage === 'th' ? '✅ ยืนยันใช้โครงภาษาไทย' : '✅ CONFIRM METRIC'}
              </button>
              
              <button
                onClick={() => {
                  setShowLanguageRecommend(false);
                  setLanguageDropdownOpen(true);
                  beepTone(320, 0.08);
                }}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-350 font-mono text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                id="btn-customize-manually-lang"
              >
                {detectedLanguage === 'th' ? '🌐 เลือกโครงภาษาอื่น' : '🌐 MANUAL SELECTION'}
              </button>
            </div>
            
            <p className="text-[9px] text-slate-500 font-mono text-center uppercase tracking-wide">
              Priority Sequence: Passport &gt; Browser &gt; GeoIP fallback. Thai default.
            </p>
          </div>
        </div>
      )}

      {/* 2. MANUAL LANGUAGE SAVE CONFIRMATION PERMANENT POPUP */}
      {pendingLanguageSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn" id="lang-save-confirm-prompt">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center" id="lang-save-card">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400" id="save-icon">
              <Info className="w-5 h-5 animate-bounce" />
            </div>
            
            <div className="space-y-1.5" id="save-texts">
              <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100 uppercase">
                {language === 'th' ? 'บันทึกภาษาใหม่ในพาสปอร์ต?' : 'Save preferred language?'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {language === 'th' 
                  ? 'คุณต้องการจัดเก็บรหัสภาษานี้ในพาร์ตพอร์ตประชากรโลกถาวรหรือไม่? สถิติและบัญชีจะล็อคภาษาตัวเลือกนี้ไว้ทันที'
                  : 'Would you like to persist this dynamic translation language permanently to your biological Human Passport across sessions?'}
              </p>
            </div>

            {/* Buttons row */}
            <div className="grid grid-cols-2 gap-3 pt-2" id="save-prompt-actions">
              <button
                onClick={confirmPermanentLanguageSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                id="btn-approve-lang-save"
              >
                {language === 'th' ? 'จัดเก็บบันทึกถาวร' : '[Save Permanent]'}
              </button>
              <button
                onClick={cancelPermanentLanguageSave}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 font-mono text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                id="btn-cancel-lang-save"
              >
                {language === 'th' ? 'ยกเลิก (ใช้ชั่วคราว)' : '[Cancel Temp]'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC TRANSLATION TOAST NOTIFICATION DECK */}
      {toastNotification && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideIn font-mono text-xs" 
          id="global-portal-toast"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* 4. VIRAL SOCIAL RECRUITMENT CAMPAIGN INFOGRAPHIC BUILDER MODAL */}
      {isSocialShareOpen && (
        <SocialShareModal
          isOpen={isSocialShareOpen}
          onClose={() => {
            setIsSocialShareOpen(false);
            beepTone(220, 0.08);
          }}
          profile={profile}
          language={language}
          countries={countries}
          currentEvent={socialShareEvent}
        />
      )}
    </div>
  );
}
