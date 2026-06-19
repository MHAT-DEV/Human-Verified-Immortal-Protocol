export type Difficulty = 'EASY' | 'HARD' | 'INSANE' | 'IMMORTAL';

export type CaptchaType = 
  | 'IMAGE_SELECT' 
  | 'DISTORTED_TEXT' 
  | 'SLIDER' 
  | 'EMOJI' 
  | 'SHAPE' 
  | 'MEMORY' 
  | 'SEQUENCE' 
  | 'REVERSE_LOGIC' 
  | 'IMPOSSIBLE' 
  | 'LOGIC' 
  | 'REACTION'
  // GRID CONQUEST EXPANSION
  | 'AI_OR_HUMAN'
  | 'PUG_OR_MUFFIN'
  | 'HIDDEN_OBJECT'
  | 'ALMOST_IDENTICAL'
  | 'WHAT_NOT_BELONG'
  | 'CHAOS_GRID'
  | 'MEME_DETECTOR'
  | 'HUMAN_EMOTION'
  // SLIDER LABYRINTH EXPANSION
  | 'ROTATING_PIECES'
  | 'DUAL_SLIDER'
  | 'MAGNETIC_PIECES'
  | 'WIND_PHYSICS'
  | 'ICE_MODE'
  | 'GRAVITY_MODE'
  | 'REVERSE_CONTROL'
  | 'SHRINKING_PUZZLE'
  | 'TIME_DISTORTION'
  // AUDIO VISUAL CIPHER EXPANSION
  | 'ROTATING_TEXT'
  | 'AUDIO_NOISE'
  | 'REVERSED_AUDIO'
  | 'DISTORTED_MATH'
  | 'MULTI_LANG_AUDIO'
  | 'RHYTHM_CAPTCHA'
  | 'COLOR_AUDIO_MATCH'
  | 'MEMORY_AUDIO'
  | 'VISUAL_GLITCH'
  // IMMORTAL TRICK MODES
  | 'SHUFFLING_GRID'
  | 'FAKE_LOADING'
  | 'SLIDER_SPRING'
  | 'DRUNK_CURSOR'
  | 'DOUBLE_NEGATIVE'
  | 'TIME_PARADOX'
  | 'TROLL_CAPTCHA'
  | 'MICRO_PIXEL'
  | 'SCHRODINGER'
  | 'CHAOS_CAPTCHA'
  // DEVICE EXCLUSIVE CAPTCHAS
  | 'MOBILE_TILT'
  | 'SHAKE_CAPTCHA'
  | 'GYROSCOPE_CAPTCHA'
  | 'MULTI_TOUCH_CAPTCHA'
  | 'STYLUS_TRACE'
  | 'PRESSURE_CAPTCHA'
  | 'KEYBOARD_SPEED'
  | 'MOUSE_ACCURACY'
  | 'DRAG_DROP_CAPTCHA';

export interface CaptchaItem {
  id: string;
  url?: string;
  icon?: string; // Lucide icon name or emoji
  label?: string;
  isTarget: boolean; // For image grid / shapes
  isSelected?: boolean;
}

export interface CaptchaChallenge {
  id: string;
  type: CaptchaType;
  instructionEn: string;
  instructionTh: string;
  instructionZh?: string;
  instructionEs?: string;
  instructionPt?: string;
  instructionRu?: string;
  instructionJa?: string;
  instructionKo?: string;
  instructionId?: string;
  instructionVi?: string;
  // Dynamic fields based on type:
  items?: CaptchaItem[]; // For selection / sequencing grid
  textAnswer?: string; // For text-based entries
  textDisplay?: string; // Warped text to show
  correctIndex?: number; // For slider, sequence, emoji
  sliderInitial?: number;
  sliderTarget?: number;
  memoryItems?: string[]; // Emojis/items to remember
  memoryQuestionEn?: string;
  memoryQuestionTh?: string;
  memoryQuestionZh?: string;
  memoryQuestionEs?: string;
  memoryQuestionPt?: string;
  memoryQuestionRu?: string;
  memoryQuestionJa?: string;
  memoryQuestionKo?: string;
  memoryQuestionId?: string;
  memoryQuestionVi?: string;
  reactionWindowMs?: number; // Fast reaction
  themeClass?: string; // Custom styling matching difficulty
  isImpossible?: boolean; // Humanly ridiculous
  immortalFeature?: string; // Trick details if in immortal mode
}

export interface PlayerStats {
  accuracy: number;
  matchesPlayed: number;
  fastestSolveMs: number;
  longestStreak: number;
  captchaSolved: number;
  bossDamage: number;
  easyCount: number;
  hardCount: number;
  insaneCount: number;
  countryContribution: number;
  // Immortal statistics
  immortalSurvivalHigh?: number;
  immortalClearedCount?: number;
  immortalBestSolveMs?: number;
  immortalTotalRagePoints?: number;
}

export interface PlayerProfile {
  humanId: string;
  nickname: string; // Used as Locked Call Sign
  displayName?: string;
  alias?: string;
  country: string; // Country ID
  rankName: string;
  rankXP: number;
  rankLevel: number;
  vCredits: number; // Verification Credits (Monetization Currency / Shop Points)
  score: number;
  stats: PlayerStats;
  purchasedBadges: string[];
  activeBadge: string;
  purchasedThemes: string[];
  activeTheme: string;
  
  // SECURE PASSPORT & ANONYMOUS IDENTITY SETTINGS
  trustScore: number; // Hidden trust score (10 to 100)
  recoveryCode: string; // Hex secure backup sequence
  guildMembership?: string; // Optional squad/clan name
  seasonProgress: number; // Level of seasonal battle pass progress (1-50)
  achievements: string[]; // List of decoded achievements
  backupConnected?: {
    google?: boolean;
    discord?: boolean;
    github?: boolean;
    apple?: boolean;
  };

  // IDENTITY-BOUND LOCALIZATION SYSTEM EXTENSIONS
  language?: string;
  languageSource?: 'auto_device' | 'manual_selection' | 'cookie' | 'indexeddb' | 'passport' | 'fallback';
  languageConfirmed?: boolean;
  languageHistory?: string[];
  region?: string;
  timezone?: string;
  localizationPreferences?: {
    largeText?: boolean;
    dyslexiaFont?: boolean;
    highContrast?: boolean;
    rtlSupport?: boolean;
    dynamicFontWeight?: number;
    languageLock?: boolean;
    keyboardNav?: boolean;
  };

  // == NEW MILITARY & PASSPORT EXPANSION SYSTEM FIELDS ==
  accountCreatedDate?: string;
  lastActivityDate?: string;
  agentNumber?: string; // e.g. "HVA-TH-000183"
  serviceNumber?: string; // e.g. "MSN-99421A-K"
  unitAssignment?: string; // e.g. "Alpha Outbreak Squad"
  division?: string; // e.g. "Anti-Bot Strike Force" or "Image Analysis"
  specialization?: string; // e.g. "Image Analysis", "Audio Decryption", "Immortal Survivor"
  deploymentStatus?: 'ACTIVE' | 'RESERVE' | 'RETIRED' | 'LEGENDARY';
  clearanceLevel?: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  combatRating?: number; // Calculated dynamic combat action score
  verificationEfficiency?: number; // Accuracy * speed factor
  threatAssessment?: 'NO THREAT' | 'MINOR SUSPICION' | 'OBSERVED' | 'UNDER REVIEW' | 'POTENTIAL ROBOT';
  disciplinaryRecord?: string[]; // Log of infractions or Warnings

  // Name History & Shop Changes
  callSignLocked?: boolean;
  nameChangesRemaining?: number; // Max 10
  nameHistory?: {
    oldNickname: string;
    oldDisplayName: string;
    newNickname: string;
    newDisplayName: string;
    date: string;
  }[];

  // Country Transfer Audit Trail
  countryTransfersRemaining?: number; // Max 3
  countryHistory?: {
    fromCountry: string;
    toCountry: string;
    date: string;
  }[];

  // Guild Cooldown & Commitment Controls
  guildRole?: 'Recruit' | 'Member' | 'Veteran' | 'Officer' | 'Commander' | 'Founder';
  guildJoinDate?: string; // ISO String to calculate 48h lockouts
  guildLeaveCooldownUntil?: string; // ISO String to represent 24h cooldown
  guildHistory?: {
    guildName: string;
    action: 'JOIN' | 'LEAVE' | 'KICK' | 'CREATE';
    date: string;
  }[];
  guildMissionPoints?: number; // Separate Guild currency
  guildDonatedCredits?: number; // Total Shop Points donated to Treasury
  guildDonatedGMP?: number; // Total Guild Points donated

  // Historical Campaign Progression Lists
  campaignHistory?: {
    missionId: string;
    title: string;
    difficulty: string;
    solveTimeMs: number;
    status: 'SUCCESS' | 'FAILED';
    date: string;
  }[];
  seasonHistory?: {
    seasonId: string;
    finalTier: number;
    pointsEarned: number;
    date: string;
  }[];

  // DEVICE-AWARE GAMEPLAY SYSTEM FIELD ACCREDITATIONS
  deviceType?: 'DESKTOP' | 'TABLET' | 'MOBILE';
  preferredDevice?: 'DESKTOP' | 'TABLET' | 'MOBILE';
  deviceSpecs?: {
    screenSize: string;
    touchSupport: boolean;
    pointerType: 'mouse' | 'touch' | 'pen' | 'hybrid';
    aspectRatio: string;
    pixelDensity: number;
    orientation: 'portrait' | 'landscape';
    deviceClass: 'DESKTOP' | 'TABLET' | 'MOBILE';
  };
  gameplayStatsPerDevice?: {
    DESKTOP?: { attempts: number; solved: number; fastestSolveMs: number; accuracy: number };
    TABLET?: { attempts: number; solved: number; fastestSolveMs: number; accuracy: number };
    MOBILE?: { attempts: number; solved: number; fastestSolveMs: number; accuracy: number };
  };
}

export interface CountryInfo {
  code: string;
  nameEn: string;
  nameTh: string;
  flag: string;
  score: number;
  verifiedCount: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  tag: string;
  score: number;
  memberCount: number;
  agencyLevel: number;
  description: string;
  motto: string;
}

export interface RealtimeVerificationLog {
  id: string;
  nickname: string;
  country: string; // Code
  scoreEarned: number;
  captchaType: string;
  timestamp: string;
  isImpossible: boolean;
}

export interface ChatMessage {
  id: string;
  nickname: string;
  country: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  badge?: string;
}
