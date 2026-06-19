import { useState, useEffect, useRef } from 'react';
import { PlayerProfile, CountryInfo } from '../types';
import { Language, i18nTranslations } from '../i18n';
import { 
  Share2, 
  Download, 
  Copy, 
  Sparkles, 
  Check, 
  Award, 
  Globe, 
  Users, 
  Zap, 
  Swords, 
  Fingerprint, 
  QrCode, 
  X, 
  ExternalLink,
  Bot,
  Flame,
  Search,
  ThumbsUp,
  Sliders,
  Maximize2
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  language: Language;
  countries: CountryInfo[];
  currentEvent?: 'level_up' | 'rank_up' | 'country_milestone' | 'win_streak' | 'boss_kill' | 'achievement' | 'immortal' | 'generic';
}

type CardType = 'player_achievement' | 'country_contribution' | 'world_event' | 'immortal_mode' | 'badge_achievement';
type AspectRatioFormat = 'square' | 'vertical' | 'landscape'; // '1080x1080' | '1080x1920' | '1200x630'

export default function SocialShareModal({
  isOpen,
  onClose,
  profile,
  language,
  countries,
  currentEvent = 'generic'
}: SocialShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedCardType, setSelectedCardType] = useState<CardType>('player_achievement');
  const [selectedFormat, setSelectedFormat] = useState<AspectRatioFormat>('square');
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedChallenge, setIsCopiedChallenge] = useState<string | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [activeCallToAction, setActiveCallToAction] = useState('Join Humanity.');

  // Custom challenge text statements
  const challengeTexts = [
    { text: `I survived ${profile.stats.longestStreak || 35} Impossible Challenges. Beat me.`, id: 'chal_longest_streak' },
    { text: `My country ${countries.find(c => c.code === profile.country)?.nameEn || 'Thailand'} reached Rank #${profile.country === 'TH' ? '1' : '2'}. Help us reach #1!`, id: 'chal_country_rank' },
    { text: `I solved the Chaos CAPTCHA in ${(profile.stats.fastestSolveMs / 1000).toFixed(2)}s. Can you?`, id: 'chal_chaos_solver' },
    { text: `My guild <${profile.guildMembership || 'HUMAN_SQUAD'}> needs reinforcements in the anti-bot war.`, id: 'chal_guild_help' }
  ];

  // Pre-configured achievements details
  const achievementsList = [
    { key: 'The Final Human', desc: 'Solve 100 CAPTCHAs without a single mistake.', badge: '🏆' },
    { key: 'Captcha Survivor', desc: 'Survive in Immortal mode for over 30 rounds.', badge: '🛡️' },
    { key: 'Beyond Human', desc: 'Solve an insane puzzle in less than 350ms.', badge: '⚡' },
    { key: 'AI Nightmare', desc: 'Inflict more than 1,000,000 accumulated boss damage.', badge: '👾' },
    { key: 'Bot Hunter', desc: 'Directly banish 500 automation scripts.', badge: '🎯' },
    { key: 'Humanity Overlord', desc: 'Reach level 50 or over using validated biometrics.', badge: '🌌' },
    { key: 'Impossible Solver', desc: 'Crack 5 consecutive Schrödinger Quantum CAPTCHA boxes.', badge: '🧪' },
    { key: 'World Defender', desc: 'Participate in 15 World Boss Raid Outbreaks.', badge: '🌍' },
    { key: 'Country Hero', desc: 'Contribute 250,000 Human Points to the national server.', badge: '🇹🇭' },
    { key: 'Guild Commander', desc: 'Establish and lead an active verified coalition of over 10 humans.', badge: '🏰' }
  ];

  const [selectedAchievement, setSelectedAchievement] = useState(achievementsList[0]);

  // Handle play sound helper
  const playBeep = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  // Dynamic localization trans helper for the sharing modal
  const t = i18nTranslations[language] || i18nTranslations.en;

  // Referral parameters
  const referralLink = `https://humanverifiedarena.com/invite/HUMAN-${profile.humanId ? profile.humanId.split('-')[1] || '8F2A91' : '8F2A91'}`;

  // Drawing logic inside canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define dimensions based on Aspect Ratio
    let width = 1080;
    let height = 1080;

    if (selectedFormat === 'vertical') {
      width = 1080;
      height = 1920;
    } else if (selectedFormat === 'landscape') {
      width = 1200;
      height = 630;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw clean background slate with futuristic grids
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#090d16');
    gradient.addColorStop(0.5, '#0d1321');
    gradient.addColorStop(1, '#02050b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw tech background grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer glow neon borders
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 16;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Corner decorative brackets
    const bracketSize = 60;
    ctx.fillStyle = '#10b981';
    // Top-Left
    ctx.fillRect(16, 16, bracketSize, 6);
    ctx.fillRect(16, 16, 6, bracketSize);
    // Top-Right
    ctx.fillRect(width - 16 - bracketSize, 16, bracketSize, 6);
    ctx.fillRect(width - 22, 16, 6, bracketSize);
    // Bottom-Left
    ctx.fillRect(16, height - 22, bracketSize, 6);
    ctx.fillRect(16, height - 16 - bracketSize, 6, bracketSize);
    // Bottom-Right
    ctx.fillRect(width - 16 - bracketSize, height - 22, bracketSize, 6);
    ctx.fillRect(width - 22, height - 16 - bracketSize, 6, bracketSize);

    // 2. Draw watermark branding
    ctx.fillStyle = 'rgba(16, 185, 129, 0.09)';
    ctx.font = 'black italic 80px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HUMAN VERIFIED ARENA', width / 2, height / 2 + 10);

    // Top Brand title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px Courier New, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ SECURITY INGRESS PROTOCOL', 50, 60);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px Courier New, monospace';
    ctx.fillText(`TIMESTAMP UTC: 2026-06-18 22:06:57 | SIGNATURE ID: ${profile.humanId || 'REC-884A'}`, 50, 85);

    // Draw stylized Checkmark logo block at top right
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width - 80, 70, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓', width - 80, 82);

    // 3. Draw specific content cards
    if (selectedCardType === 'player_achievement') {
      // CARD 1: PLAYER ACHIEVEMENT REPORT CARD
      ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 2;
      const cardX = 60;
      const cardY = 130;
      const cardW = width - 120;
      const cardH = height - 320;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Gradient Header tag
      ctx.fillStyle = '#111827';
      ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, 80);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(cardX + 2, cardY + 80, cardW - 4, 2);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HUMAN IDENTITY CERTIFICATE', width / 2, cardY + 50);

      // Player Nick
      ctx.fillStyle = '#10b981';
      ctx.font = 'black 54px Courier New, monospace';
      ctx.fillText(profile.nickname.toUpperCase(), width / 2, cardY + 160);

      // ID
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 24px Courier New, monospace';
      ctx.fillText(`#${profile.humanId ? profile.humanId.split('-')[1] : '8F2A91'}`, width / 2, cardY + 195);

      // Country Flag and Name
      const countryObj = countries.find(c => c.code === profile.country);
      const flagStr = countryObj?.flag || '🇹🇭';
      const nameStr = countryObj?.nameEn || 'Thailand';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px Courier New, monospace';
      ctx.fillText(`${flagStr} ${nameStr.toUpperCase()} ALLIANCE`, width / 2, cardY + 245);

      // Highlight Badge / Rank name
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.strokeStyle = '#f59e0b';
      const badgeW = 400;
      const badgeH = 50;
      ctx.fillRect(width / 2 - badgeW / 2, cardY + 280, badgeW, badgeH);
      ctx.strokeRect(width / 2 - badgeW / 2, cardY + 280, badgeW, badgeH);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 22px Courier New, monospace';
      ctx.fillText(`🏆 ${profile.rankName.toUpperCase()}`, width / 2, cardY + 312);

      // Stat keys & values on columns
      const statY = cardY + 400;
      const col1X = width / 2 - 200;
      const col2X = width / 2 + 200;

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 20px Courier New, monospace';
      ctx.fillText('COGNITIVE STAT', col1X, statY);
      ctx.fillText('METRIC VALUE', col2X, statY);

      // Divide line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 280, statY + 15);
      ctx.lineTo(width / 2 + 280, statY + 15);
      ctx.stroke();

      const items = [
        { label: 'COGNITIVE ACCURACY', val: `${profile.stats.accuracy || 98.4}%` },
        { label: 'FASTEST SOLVE', val: `${((profile.stats.fastestSolveMs || 780) / 1000).toFixed(2)} SEC` },
        { label: 'GLOBAL SOLDIER RANK', val: `#${profile.score > 10000 ? '47' : '124'}` },
        { label: 'HUMAN POINTS EARNED', val: `${(profile.score || 5800).toLocaleString()} PTS` },
        { label: 'SEASON RETINA PASS', val: `STAGE ${profile.seasonProgress || 1} / 50` }
      ];

      items.forEach((item, index) => {
        const itemY = statY + 50 + index * 42;
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Courier New, monospace';
        ctx.fillText(item.label, col1X, itemY);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px Courier New, monospace';
        ctx.fillText(item.val, col2X, itemY);
      });

      // Funny quote placeholder
      ctx.fillStyle = '#fb7185';
      ctx.font = 'italic 20px Courier New, monospace';
      ctx.fillText('"Still more human than 99.98% of players."', width / 2, cardY + cardH - 50);

    } else if (selectedCardType === 'country_contribution') {
      // CARD 2: COUNTRY WORK WAR CONTRIBUTION REPORT
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 2;
      const cardX = 60;
      const cardY = 130;
      const cardW = width - 120;
      const cardH = height - 320;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      const countryObj = countries.find(c => c.code === profile.country) || countries[0];

      // Banner Header
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, 80);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(cardX + 2, cardY + 80, cardW - 4, 2);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${countryObj.nameEn.toUpperCase()} DEFENSE ARCHIVE`, width / 2, cardY + 50);

      // Massive Flag
      ctx.font = '100px Arial, sans-serif';
      ctx.fillText(countryObj.flag, width / 2, cardY + 190);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px Courier New, monospace';
      ctx.fillText('NATIONAL CAMPAIGN REPORT', width / 2, cardY + 250);

      // Country stats block
      const scoreY = cardY + 310;
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 18px Courier New, monospace';
      ctx.fillText('WORLDWIDE NATIONAL RANK', width / 2, scoreY);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'black 54px Courier New, monospace';
      ctx.fillText(profile.country === 'TH' ? '#1 WORLDWIDE' : '#2 WORLDWIDE', width / 2, scoreY + 55);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 18px Courier New, monospace';
      ctx.fillText('ACCUMULATED POPULATION SCORE', width / 2, scoreY + 115);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Courier New, monospace';
      ctx.fillText(`${(countryObj.score || 5821114).toLocaleString()} HUMAN PTS`, width / 2, scoreY + 155);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '18px Courier New, monospace';
      ctx.fillText(`Global Sector Contribution: 11.8%`, width / 2, scoreY + 210);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Top Active Sentry: ${profile.nickname.toUpperCase()}`, width / 2, scoreY + 245);

      // Target country to defeat next!
      const targetOpponent = profile.country === 'TH' ? 'Japan 🇯🇵 (3,110,400)' : 'Thailand 🇹🇭 (3,450,910)';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 19px Courier New, monospace';
      ctx.fillText(`⚠️ STRATEGIC TARGET: Declass ${targetOpponent}`, width / 2, scoreY + 295);

      // Help country recruiting sentence
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold italic 22px Courier New, monospace';
      ctx.fillText(`"Help ${countryObj.nameEn} reach #1. Defend Our Cyber Borders."`, width / 2, cardY + cardH - 35);

    } else if (selectedCardType === 'world_event') {
      // CARD 3: WORLD BOSS EVENT RAID ATTACK
      ctx.fillStyle = 'rgba(239, 68, 68, 0.03)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 2;
      const cardX = 60;
      const cardY = 130;
      const cardW = width - 120;
      const cardH = height - 320;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Header Banner
      ctx.fillStyle = '#1c0707';
      ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, 80);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(cardX + 2, cardY + 80, cardW - 4, 2);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ GLOBAL DEFENSE OUTBREAK ACT ⚠️', width / 2, cardY + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 48px Courier New, monospace';
      ctx.fillText('ROGUE AI INCIDENT: SHUMAN-X', width / 2, cardY + 160);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 26px Courier New, monospace';
      ctx.fillText('WORLD BOSS REMAINING CAPABILITIES', width / 2, cardY + 225);

      // Huge HP Indicator
      ctx.fillStyle = '#ef4444';
      ctx.font = 'black 76px Courier New, monospace';
      ctx.fillText('13% HP', width / 2, cardY + 310);

      // Divided line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, cardY + 350);
      ctx.lineTo(width / 2 + 200, cardY + 350);
      ctx.stroke();

      // Stats
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 20px Courier New, monospace';
      ctx.fillText('GLOBAL REBELLION DAMAGE', width / 2, cardY + 390);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Courier New, monospace';
      ctx.fillText('87,000,000 CORE CODES', width / 2, cardY + 430);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 20px Courier New, monospace';
      ctx.fillText('YOUR CONTRIBUTION INTEGRITY', width / 2, cardY + 485);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 36px Courier New, monospace';
      ctx.fillText(`${(profile.stats.bossDamage || 24212).toLocaleString()} DAMAGE HITS`, width / 2, cardY + 525);

      // Recruitment phrase
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold italic 22px Courier New, monospace';
      ctx.fillText('"Humanity Needs Quick Reinforcements. Relieve Our Network Today."', width / 2, cardY + cardH - 45);

    } else if (selectedCardType === 'immortal_mode') {
      // CARD 4: IMMORTAL MODE CHALLENGE SURVIVOR CORE
      ctx.fillStyle = 'rgba(129, 140, 248, 0.04)';
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)';
      ctx.lineWidth = 2;
      const cardX = 60;
      const cardY = 130;
      const cardW = width - 120;
      const cardH = height - 320;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Header Banner
      ctx.fillStyle = '#111827';
      ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, 80);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.2)';
      ctx.fillRect(cardX + 2, cardY + 80, cardW - 4, 2);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 28px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('👿 IMMORTAL COGNITIVE ARENA 👿', width / 2, cardY + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 48px Courier New, monospace';
      ctx.fillText('ENDLESS QUANTUM SURVIVAL', width / 2, cardY + 160);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 20px Courier New, monospace';
      ctx.fillText('YOU SURVIVED', width / 2, cardY + 225);

      ctx.fillStyle = '#fb7185';
      ctx.font = 'black 64px Courier New, monospace';
      ctx.fillText(`47 IMPOSSIBLE RUNS`, width / 2, cardY + 295);

      // Rage and Rank double blocks
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(width / 2 - 250, cardY + 340, 230, 100);
      ctx.strokeRect(width / 2 - 250, cardY + 340, 230, 100);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 16px Courier New, monospace';
      ctx.fillText('RAGE LEVEL', width / 2 - 135, cardY + 375);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 32px Courier New, monospace';
      ctx.fillText('x18 MULTIPLIER', width / 2 - 135, cardY + 415);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(width / 2 + 20, cardY + 340, 230, 100);
      ctx.strokeRect(width / 2 + 20, cardY + 340, 230, 100);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 16px Courier New, monospace';
      ctx.fillText('SERVER POSITION', width / 2 + 135, cardY + 375);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px Courier New, monospace';
      ctx.fillText('#8 LEGEND', width / 2 + 135, cardY + 415);

      // Challenge title badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Courier New, monospace';
      ctx.fillText('👑 STATUS DESIGNATION: "WHY ARE YOU STILL HERE?"', width / 2, cardY + 490);

      // Challenge instruction
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold italic 22px Courier New, monospace';
      ctx.fillText('"I survived 47 Impossible Challenges. Beat me."', width / 2, cardY + cardH - 45);

    } else if (selectedCardType === 'badge_achievement') {
      // CARD 5: SPECIFIC CHOSEN ACHIEVEMENT HIGHLIGHT CARD
      ctx.fillStyle = 'rgba(217, 70, 239, 0.04)';
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.2)';
      ctx.lineWidth = 2;
      const cardX = 60;
      const cardY = 130;
      const cardW = width - 120;
      const cardH = height - 320;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.fillStyle = '#111827';
      ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, 80);
      ctx.fillStyle = 'rgba(217, 70, 239, 0.2)';
      ctx.fillRect(cardX + 2, cardY + 80, cardW - 4, 2);

      ctx.fillStyle = '#d946ef';
      ctx.font = 'bold 28px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🏅 HIGH-FIDELITY ACHIEVEMENT GRANTED 🏅', width / 2, cardY + 50);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(width / 2 - 120, cardY + 130, 240, 180);
      ctx.strokeStyle = '#d946ef';
      ctx.strokeRect(width / 2 - 120, cardY + 130, 240, 180);

      // Achievement badge
      ctx.font = '100px Arial, sans-serif';
      ctx.fillText(selectedAchievement.badge, width / 2, cardY + 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 38px Courier New, monospace';
      ctx.fillText(selectedAchievement.key.toUpperCase(), width / 2, cardY + 360);

      ctx.fillStyle = '#d946ef';
      ctx.font = 'italic 20px Courier New, monospace';
      ctx.fillText('"THE GATES CONFIRM BIOMETRIC EXCELLENCE"', width / 2, cardY + 400);

      // Description text wrapped nicely
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 18px Courier New, monospace';
      ctx.fillText(selectedAchievement.desc, width / 2, cardY + 460);

      // Footer challenge
      ctx.fillStyle = '#f0abfc';
      ctx.font = 'bold italic 22px Courier New, monospace';
      ctx.fillText('"Can you solve the Chaos CAPTCHA? Prove you are human."', width / 2, cardY + cardH - 45);
    }

    // 4. Draw consistent footer elements on the canvas (QR Code, CTAs & Referral link)
    const footY = height - 160;

    // Draw solid backer for info strip
    ctx.fillStyle = '#111827';
    ctx.fillRect(50, footY, width - 100, 120);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, footY, width - 100, 120);

    // Drawing mock Esports QR Code on bottom left
    const qrX = 70;
    const qrY = footY + 15;
    const qrSize = 90;

    // Outer boundary of QR code
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    
    // Draw cyber qr grid squares inside
    ctx.fillStyle = '#000000';
    // Position detection anchors (boxes)
    ctx.fillRect(qrX + 5, qrY + 5, 25, 25);
    ctx.clearRect(qrX + 10, qrY + 10, 15, 15);
    ctx.fillRect(qrX + 12, qrY + 12, 11, 11);

    ctx.fillRect(qrX + qrSize - 30, qrY + 5, 25, 25);
    ctx.clearRect(qrX + qrSize - 25, qrY + 10, 15, 15);
    ctx.fillRect(qrX + qrSize - 23, qrY + 12, 11, 11);

    ctx.fillRect(qrX + 5, qrY + qrSize - 30, 25, 25);
    ctx.clearRect(qrX + 10, qrY + qrSize - 25, 15, 15);
    ctx.fillRect(qrX + 12, qrY + qrSize - 23, 11, 11);

    // Draw miscellaneous randomized bits
    for (let r = 35; r < qrSize - 10; r += 8) {
      for (let c = 35; c < qrSize - 10; c += 8) {
        if (Math.random() > 0.4) {
          ctx.fillRect(qrX + c, qrY + r, 6, 6);
        }
      }
    }

    // Call To Action text alongside QR code
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Courier New, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(activeCallToAction.toUpperCase(), qrX + qrSize + 25, footY + 45);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Courier New, monospace';
    ctx.fillText('HUMANVERIFIEDARENA.COM', qrX + qrSize + 25, footY + 70);

    // Invite ID
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px Courier New, monospace';
    ctx.fillText(`INVITATION REF CODE: HUMAN-${profile.humanId ? profile.humanId.split('-')[1] || '8F2A91' : '8F2A91'}`, qrX + qrSize + 25, footY + 95);

    // Right-aligned branding tagline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold italic 22px Courier New, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('JOIN THE HUMANITY RESISTANCE', width - 75, footY + 50);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px Courier New, monospace';
    ctx.fillText('Scan QR to restore bio-passport instantly', width - 75, footY + 85);

  }, [isOpen, selectedCardType, selectedFormat, activeCallToAction, selectedAchievement, profile, countries]);

  // Handle Download Image function
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playBeep(650);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `human_verified_${selectedCardType}_${selectedFormat}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe clipboard copy mechanism
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopiedLink(true);
    playBeep(600);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  // Trigger claim referral milestones
  const claimMilestone = (rewardId: string, creditGains: number) => {
    if (claimedRewards.includes(rewardId)) return;
    
    // Add rewards to profile
    playBeep(880);
    setClaimedRewards(prev => [...prev, rewardId]);
    
    // Apply changes practically
    updateProfile({
      vCredits: profile.vCredits + creditGains,
      score: profile.score + 1000,
      stats: {
        ...profile.stats,
        captchaSolved: profile.stats.captchaSolved + 10,
        countryContribution: profile.stats.countryContribution + 1000
      }
    });
  };

  // Function to simulate real post redirection and toast trigger
  const triggerNativeShareRedirect = (platform: string) => {
    playBeep(450);
    const textToShare = `Humanity is fighting back against rogue AI! Can you prove you are actually human? Play Human Verified Arena here: ${referralLink}`;
    let shareUrl = '';

    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(textToShare)}`;
    } else if (platform === 'reddit') {
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent('I proved my humanity in Human Verified Arena!')}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    } else {
      // Direct Clipboard Fallback
      navigator.clipboard.writeText(textToShare);
      alert(`[${platform.toUpperCase()} STORY PROTOCOL]: Content template copied to registry! Open ${platform} to upload.`);
    }
  };

  const updateProfile = (updated: Partial<PlayerProfile>) => {
    // Propagate profile editing up
    const currentProfileString = localStorage.getItem('human_arena_profile_v2');
    if (currentProfileString) {
      try {
        const next = { ...JSON.parse(currentProfileString), ...updated };
        localStorage.setItem('human_arena_profile_v2', JSON.stringify(next));
        // Force state reload on window
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto" id="social-modal-overlay">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full flex flex-col md:flex-row relative shadow-2xl overflow-hidden max-h-[92vh]" id="social-modal-body">
        
        {/* Close Button top right */}
        <button
          onClick={() => { playBeep(220); onClose(); }}
          className="absolute top-4 right-4 bg-slate-950/60 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 hover:text-red-400 p-2 rounded-full transition cursor-pointer z-50 text-slate-400"
          id="btn-close-social-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: LIVE ESPORTS GENERATED INFOGRAPHY */}
        <div className="w-full md:w-[50%] bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800" id="social-modal-rendering-col">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
              <h3 className="text-sm font-mono font-bold tracking-widest text-emerald-400 uppercase">
                {language === 'en' ? 'AUTOMATIC ESPORTS CAPTURE' : 'ระบบจำลองการสร้างอาร์ตเวิร์กสงครามโลก'}
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 font-mono italic leading-relaxed">
              {language === 'en' 
                ? 'Your cognitive metrics are mapped onto vector matrices in real-time. Choose a layout to capture for sharing.'
                : 'ข้อมูลประสาทชีวภาพล่าสุดของคุณ ได้รับการแปลงเป็นภาพโปสเตอร์โปรโมทประชาสัมพันธ์ระดับทีมแข่งขันชั้นเลิศ'}
            </p>

            {/* Simulated Live canvas container */}
            <div className="relative bg-slate-900/60 border border-slate-850 p-2 rounded-2xl flex items-center justify-center" id="canvas-frame">
              <canvas 
                ref={canvasRef} 
                className="w-full h-auto aspect-video object-contain max-h-[48vh] rounded-xl shadow-inner border border-slate-950" 
                id="infographic-esports-canvas"
              />
              <span className="absolute bottom-4 right-4 bg-slate-950/85 px-2.5 py-1 text-[9px] font-mono font-bold text-slate-500 rounded border border-slate-800">
                RESOLUTION: {selectedFormat === 'square' ? '1080x1080' : selectedFormat === 'vertical' ? '1080x1920' : '1200x630'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4" id="canvas-immediate-controls">
            {/* Download PNG Button */}
            <button
              onClick={handleDownload}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              id="social-btn-download-img"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{language === 'en' ? 'DOWNLOAD INFOGRAPHIC' : 'ดาวน์โหลดไฟล์ผลลัพธ์ PNG'}</span>
            </button>

            {/* Direct clipboard raw picture copier fallback */}
            <button
              onClick={() => {
                playBeep(450);
                const canvas = canvasRef.current;
                if (!canvas) return;
                try {
                  canvas.toBlob((blob) => {
                    if (blob) {
                      navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                      ]);
                      alert(language === 'en' ? 'Professional Infographic image copied to clipboard!' : 'คัดลอกภาพอินโฟกราฟิกพร้อมเอาไปวางได้ทันที!');
                    }
                  });
                } catch (err) {
                  alert(language === 'en' ? 'Your browser has strict clipboard restriction. Click download instead!' : 'เบราว์เซอร์ติดความปลอดภัย กรุณากดปุ่มดาวน์โหลดแทน!');
                }
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2"
              id="social-btn-copy-canvas"
            >
              <Copy className="w-4 h-4" />
              <span>{language === 'en' ? 'COPY IMAGE' : 'ก๊อปปี้รูปคู่'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: VIRAL loop social parameters, templates & referral rewards */}
        <div className="w-full md:w-[50%] p-6 overflow-y-auto space-y-6" id="social-modal-interactive-col">
          
          {/* Section 1: Template selection */}
          <div className="space-y-2" id="section-template-selection">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
              {language === 'en' ? '1. INFOGRAPHIC CARD THEME TEMPLATE' : '1. เลือกเทมเพลตความภูมิใจ'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="template-card-grid">
              {[
                { id: 'player_achievement', label: 'Identity Certificate', icon: Fingerprint, color: 'text-emerald-400' },
                { id: 'country_contribution', label: 'Country Contribution', icon: Globe, color: 'text-sky-400' },
                { id: 'world_event', label: 'World AI Raid Outbreak', icon: Zap, color: 'text-red-400' },
                { id: 'immortal_mode', label: 'Immortal Survival Index', icon: Flame, color: 'text-rose-400' },
                { id: 'badge_achievement', label: 'Milestone Badges', icon: Award, color: 'text-purple-400' }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    playBeep(420);
                    setSelectedCardType(tmpl.id as CardType);
                  }}
                  className={`p-2.5 rounded-xl border font-mono text-[10px] font-bold text-left flex flex-col justify-between transition cursor-pointer h-20 ${
                    selectedCardType === tmpl.id 
                      ? 'bg-slate-800/80 border-emerald-500 scale-[1.02] shadow-sm shadow-emerald-500/10' 
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  id={`btn-select-tmpl-${tmpl.id}`}
                >
                  <tmpl.icon className={`w-4 h-4 ${tmpl.color}`} />
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>

            {/* Achievement sub-select if badges template is chosen */}
            {selectedCardType === 'badge_achievement' && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 animate-fadeIn" id="sub-achievement-selector">
                <label className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Select Milestone Badge Highlight</label>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1" id="badge-scrollbar">
                  {achievementsList.map((ach) => (
                    <button
                      key={ach.key}
                      onClick={() => { playBeep(260); setSelectedAchievement(ach); }}
                      className={`px-3 py-1 text-[10px] font-mono rounded-lg border shrink-0 transition whitespace-nowrap cursor-pointer ${
                        selectedAchievement.key === ach.key ? 'bg-purple-950/50 border-purple-500 text-purple-300' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                      id={`btn-badge-${ach.key.replace(/\s+/g, '-')}`}
                    >
                      {ach.badge} {ach.key}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Format layout size selections */}
          <div className="space-y-2" id="section-format-selection">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
              {language === 'en' ? '2. ASPECT RATIO PLATFORM LAYOUT' : '2. เลือกพิกัดขนาดสัดส่วนภาพ'}
            </span>
            <div className="grid grid-cols-3 gap-2" id="ratio-selection-grid">
              {[
                { id: 'square', label: 'Square (1080x1080)', desc: 'Instagram, Feed Posts, Discord' },
                { id: 'vertical', label: 'Vertical (1080x1920)', desc: 'Stories, Tik Tok, Reels, Status' },
                { id: 'landscape', label: 'Landscape (1200x630)', desc: 'Twitter / X, Link Previews' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    playBeep(410);
                    setSelectedFormat(fmt.id as AspectRatioFormat);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col justify-center gap-1 min-h-[64px] ${
                    selectedFormat === fmt.id 
                      ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  id={`btn-select-format-${fmt.id}`}
                >
                  <span className="text-[10px] font-mono font-bold block">{fmt.label}</span>
                  <span className="text-[8px] font-mono text-slate-600 leading-tight block">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Call to action options mapping */}
          <div className="space-y-2" id="section-cta-selection">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
              {language === 'en' ? '3. IN-IMAGE CALL TO ACTION' : '3. ปรับแต่งสโลแกนเชิญชวนในโปสเตอร์'}
            </span>
            <div className="flex flex-wrap gap-1.5" id="cta-options-chips">
              {[
                'Join Humanity.',
                'Help Your Country.',
                'Defeat The AI.',
                'Prove You\'re Human.',
                'The Robots Are Winning.',
                'Humanity Needs You.',
                'Can You Solve This CAPTCHA?',
                'Only Humans Survive.'
              ].map((cta) => (
                <button
                  key={cta}
                  onClick={() => { playBeep(220); setActiveCallToAction(cta); }}
                  className={`px-2.5 py-1 text-[9px] font-mono font-semibold rounded-lg border transition cursor-pointer ${
                    activeCallToAction === cta 
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold' 
                      : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200'
                  }`}
                  id={`btn-cta-${cta.replace(/[^a-zA-Z]/g, '')}`}
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Share Redirect channels buttons list */}
          <div className="space-y-2 text-left" id="section-share-platforms">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
              {language === 'en' ? '4. DISPATCH PROPAGANDA TO WORLD NETWORKS' : '4. กระจายประกาศไปยังเครือข่ายความร่วมมือ'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="share-platform-buttons">
              {[
                { name: 'X / Twitter', key: 'twitter', bg: 'bg-slate-950 font-bold hover:bg-slate-900 border-slate-800' },
                { name: 'Facebook', key: 'facebook', bg: 'bg-blue-950/40 hover:bg-blue-900/40 text-blue-400 border-blue-900/30' },
                { name: 'WhatsApp', key: 'whatsapp', bg: 'bg-green-950/40 hover:bg-green-900/40 text-emerald-400 border-green-900/30' },
                { name: 'Telegram', key: 'telegram', bg: 'bg-sky-950/40 hover:bg-sky-900/40 text-sky-400 border-sky-900/30' },
                { name: 'Reddit', key: 'reddit', bg: 'bg-orange-950/40 hover:bg-orange-900/40 text-orange-400 border-orange-900/30' },
                { name: 'Instagram', key: 'instagram', bg: 'bg-rose-950/30 hover:bg-rose-900/30 text-rose-400 border-rose-900/20' },
                { name: 'LINE', key: 'line', bg: 'bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-400 border-emerald-900/20' },
                { name: 'Discord', key: 'discord', bg: 'bg-indigo-950/30 hover:bg-indigo-900/30 text-indigo-400 border-indigo-900/20' },
                { name: 'Threads', key: 'threads', bg: 'bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800' },
                { name: 'TikTok', key: 'tiktok', bg: 'bg-slate-950 hover:bg-slate-900 text-teal-400 border-slate-850' }
              ].map((plat) => (
                <button
                  key={plat.key}
                  onClick={() => triggerNativeShareRedirect(plat.key)}
                  className={`p-2 rounded-xl text-[9px] font-mono border transition flex flex-col items-center justify-center gap-1 cursor-pointer truncate ${plat.bg}`}
                  id={`share-btn-${plat.key}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{plat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Challenge Copy presets (Challenge Buttons) */}
          <div className="space-y-2" id="section-social-challenge">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
              {language === 'en' ? '5. VIRAL SOCIAL CHALLENGES DIRECTIVES' : '5. คัดลอกโจทย์รหัสปลุกระดมการต่อสู้'}
            </span>
            <div className="space-y-1.5" id="challenge-texts-holder">
              {challengeTexts.map((chal) => (
                <div 
                  key={chal.id} 
                  className="bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg flex items-center justify-between gap-3"
                  id={`challenge-container-${chal.id}`}
                >
                  <span className="text-[10px] font-mono text-slate-300 italic truncate flex-1">"{chal.text}"</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(chal.text);
                      setIsCopiedChallenge(chal.id);
                      playBeep(450);
                      setTimeout(() => setIsCopiedChallenge(null), 2000);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-2 py-1 rounded text-[9px] font-mono shrink-0 transition flex items-center gap-1"
                    id={`btn-copy-chal-${chal.id}`}
                  >
                    {isCopiedChallenge === chal.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopiedChallenge === chal.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: User Unique Referral Invitation Station & Claiming Rewards */}
          <div className="bg-gradient-to-r from-emerald-950/20 to-slate-950 border border-emerald-500/20 p-4 rounded-2xl space-y-3" id="invite-rewards-station">
            <div className="flex items-center justify-between" id="invite-station-header">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                {language === 'en' ? 'COGNITIVE INVITE RETINA NETWORK' : 'ฐานรหัสขยายพลังสมองมนุษย์เชื่อมเครือข่าย'}
              </h4>
              <span className="text-[8px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                ACTIVE
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              {language === 'en' 
                ? 'Generate a unique biometric pathway url. Invite potential carbon allies. When they pass verification, retrieve permanent currency, milestones, and server multipliers.'
                : 'คัดลอกลิงก์ชีวโมเลกุลชวนเพื่อนเข้ามาเล่น เมื่อเพื่อผ่านการสแกนรอบแรก คุณจะได้รับแต้มอภิมหาอำนาจ XP เครดิต และ Skin ทันที'}
            </p>

            {/* Generated referral URL Block */}
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-850 flex items-center justify-between gap-2" id="referral-url-copy-block">
              <span className="text-[10px] font-mono text-emerald-400 select-all truncate flex-1">{referralLink}</span>
              <button
                onClick={handleCopyLink}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-1.5 rounded-lg transition border border-slate-800 cursor-pointer"
                id="btn-copy-ref-link"
              >
                {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Referral claim status dashboard list */}
            <div className="border-t border-slate-850/80 pt-3 space-y-2" id="referral-claim-dashboard">
              <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold tracking-wider">RETINA MEMBERS RECRUITS TRACKER</span>
              
              <div className="space-y-1.5 text-[9px] font-mono" id="claim-tier-list">
                {[
                  { id: 'invite_1', goal: 'Recruit 1 Human', reward: '+500 V-credits / +1,000 National Pts', bonus: 500 },
                  { id: 'invite_5', goal: 'Recruit 5 Humans', reward: 'Unlock "Captcha Survivor" Rare Skin / +2,000 National Pts', bonus: 1500 },
                  { id: 'invite_10', goal: 'Recruit 10 Humans', reward: 'Special "Beyond Human" Glow Flag / +5,000 National Pts', bonus: 3500 }
                ].map((tier) => {
                  const isClaimed = claimedRewards.includes(tier.id);
                  return (
                    <div 
                      key={tier.id} 
                      className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded border border-slate-900"
                      id={`tier-card-${tier.id}`}
                    >
                      <div>
                        <div className="text-slate-350 font-bold">{tier.goal}</div>
                        <div className="text-slate-500 text-[8px]">{tier.reward}</div>
                      </div>
                      <button
                        onClick={() => claimMilestone(tier.id, tier.bonus)}
                        disabled={isClaimed}
                        className={`px-2.5 py-1 text-[8px] font-bold rounded transition cursor-pointer font-mono ${
                          isClaimed 
                            ? 'bg-slate-900 text-slate-600 border border-slate-900' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                        }`}
                        id={`btn-claim-${tier.id}`}
                      >
                        {isClaimed ? 'CLAIMED ✓' : 'MOCK CLAIM'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 7: SOCIAL MEDIA OPEN GRAPH PREVIEW WRAPPER */}
          <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl space-y-2 text-left" id="section-open-graph-visual">
            <span className="text-[10px] font-mono text-slate-500 block font-bold uppercase tracking-wider">
              👀 CARD SHARED PREVIEW ON SOCIAL TIMELINES (OPEN GRAPH PREVIEW)
            </span>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md max-w-sm" id="og-preview-card">
              <div className="h-32 bg-slate-950 flex items-center justify-center border-b border-slate-850 relative overflow-hidden" id="og-preview-backdrop">
                {/* Simulated mini gradient artwork */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-emerald-950/50 pointer-events-none" />
                <div className="z-10 text-center font-mono space-y-1">
                  <div className="text-emerald-400 text-xs font-black tracking-widest uppercase">✓ HUMAN VERIFY ARENA</div>
                  <div className="text-[9px] text-slate-400">{profile.nickname.toUpperCase()} has been verified human!</div>
                  <div className="text-[8px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block border border-amber-400/20">{profile.rankName} • LV {profile.rankLevel}</div>
                </div>
              </div>
              <div className="p-3 space-y-1 font-sans text-left" id="og-preview-details">
                <span className="text-[8px] font-mono text-emerald-400 block tracking-widest font-bold uppercase">HUMANVERIFIEDARENA.COM/INVITE</span>
                <h5 className="text-[11px] font-bold text-slate-200">Prove You're Human! {profile.nickname} has invited you to join the Resistance.</h5>
                <p className="text-[9px] text-slate-400 leading-tight">Join millions of humans globally defending credit networks. Complete extreme speed captchas with {profile.stats.accuracy}% index precision.</p>
                <div className="pt-1.5 flex items-center justify-between text-[8px] font-mono text-slate-500" id="og-call-to-action">
                  <span>URL PREVIEW</span>
                  <span className="text-sky-400 font-bold uppercase text-[9px]">ACTION: {activeCallToAction}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
