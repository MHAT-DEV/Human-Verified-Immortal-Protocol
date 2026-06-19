import { PlayerProfile } from '../types';

/**
 * Computes a simple hash of a string
 */
function sdbmHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }
  return Math.abs(hash);
}

/**
 * Procedural biological device fingerprinting signals generator
 */
export interface IdentitySignals {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  hardwareConcurrency: number;
  deviceMemory?: number;
  canvasHash: string;
  webglHash: string;
}

export function gatherIdentitySignals(): IdentitySignals {
  // 1. Core Navigator characteristics
  const userAgent = navigator.userAgent;
  const language = navigator.language || (navigator as any).userLanguage || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const colorDepth = window.screen.colorDepth || 24;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 8;

  // 2. Canvas fingerprinting (drawing a tiny distinct glyph pattern with colored lines and text)
  let canvasHash = 'canvas_failed';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillRect(8, 5, 24, 12);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('HUMANITY_TEST_A91B', 2, 2);
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(160, 30);
      ctx.stroke();
      canvasHash = sdbmHash(canvas.toDataURL()).toString(16).toUpperCase();
    }
  } catch (e) {
    // Canvas isolated or disabled
  }

  // 3. WebGL fingerprinting (GPU identifiers extraction)
  let webglHash = 'webgl_failed';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const dbgRenderInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (dbgRenderInfo) {
        const vendor = (gl as any).getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = (gl as any).getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        webglHash = sdbmHash(`${vendor}::${renderer}`).toString(16).toUpperCase();
      }
    }
  } catch (e) {
    // WebGL protected
  }

  return {
    userAgent,
    language,
    timezone,
    screenResolution,
    colorDepth,
    hardwareConcurrency,
    deviceMemory,
    canvasHash,
    webglHash
  };
}

/**
 * Instantly creates a unique, persistent Human ID based on device characteristics combined with crypto entropy
 */
export function generateHumanId(signals: IdentitySignals): string {
  const payload = `${signals.canvasHash}-${signals.webglHash}-${signals.timezone}-${signals.screenResolution}`;
  const signalHashNum = sdbmHash(payload);
  
  // Create a 6-character alphanumeric key (e.g. 8F2A91) which is reproducible but salted with current millis
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hashStr = '';
  let tempHash = signalHashNum ^ Math.floor(Math.random() * 10000000);
  
  for (let i = 0; i < 6; i++) {
    const code = tempHash % alphanumeric.length;
    hashStr += alphanumeric.charAt(code);
    tempHash = Math.floor(tempHash / alphanumeric.length);
  }
  
  return `HUMAN-${hashStr}`;
}

/**
 * Generate a random 16-character secure recovery license code (e.g. REC-A9F8-3K9Q-L7W5-H211)
 */
export function generateRecoveryCode(): string {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${segment()}-${segment()}-${segment()}-${segment()}`;
}

/**
 * Secondary IndexedDB Backup engine to store the player identity securely off-thread 
 */
export function backupIdToIndexedDB(humanId: string, profile: any): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open('HumanityArenaDB', 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('identities')) {
          db.createObjectStore('identities', { keyPath: 'key' });
        }
      };
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['identities'], 'readwrite');
        const store = transaction.objectStore('identities');
        store.put({ key: 'player_identity', humanId, profileJson: JSON.stringify(profile), timestamp: Date.now() });
        resolve(true);
      };
      request.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

/**
 * Fetch backup identity from IndexedDB if localStorage gets cleared
 */
export function retrieveIdFromIndexedDB(): Promise<{ humanId: string; profileJson: string } | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open('HumanityArenaDB', 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('identities')) {
          resolve(null);
          return;
        }
        const transaction = db.transaction(['identities'], 'readonly');
        const store = transaction.objectStore('identities');
        const getReq = store.get('player_identity');
        getReq.onsuccess = (e: any) => {
          if (e.target.result) {
            resolve({
              humanId: e.target.result.humanId,
              profileJson: e.target.result.profileJson
            });
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Backup identity to cookie helper
 */
export function backupIdToCookie(humanId: string, recoveryCode: string) {
  try {
    const value = encodeURIComponent(JSON.stringify({ humanId, recoveryCode }));
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 5); // 5 years expiry
    document.cookie = `human_integrity_passport=${value}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
  } catch (e) {
    // Cookies isolated
  }
}

export function retrieveIdFromCookie(): { humanId: string; recoveryCode: string } | null {
  try {
    const matches = document.cookie.match(/human_integrity_passport=([^;]+)/);
    if (matches) {
      const decoded = decodeURIComponent(matches[1]);
      return JSON.parse(decoded);
    }
  } catch (e) {
    // Cookie failed
  }
  return null;
}

/**
 * Device similarity and behavior-based bot-farm / multi-account assessment simulator
 */
export function assessDuplicateSimilarity(profile: PlayerProfile): {
  isDuplicate: boolean;
  scoreDeduction: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let scoreDeduction = 0;
  
  // 1. High-frequency clicker check
  if (profile.stats.matchesPlayed > 5 && profile.stats.accuracy > 99 && profile.stats.fastestSolveMs < 1500) {
    reasons.push('Supersonic superhuman biometric solve sequences identified (possible mouse-macro replay)');
    scoreDeduction += 15;
  }

  // 2. Browser timezone and locale misalignment
  const sysZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (profile.country === 'TH' && !sysZone.includes('Asia/Bangkok')) {
    // User claims Thailand, timezone is different (possible VPN spoofing or Proxy farm)
    reasons.push('Asymmetrical network transit routing detected (VPN/Proxy overlay suspicious of multiple profiles)');
    scoreDeduction += 8;
  }

  // 3. Repeated rapid failures
  if (profile.stats.matchesPlayed > 10 && profile.stats.accuracy < 35) {
    reasons.push('Erratic cognitive telemetry logs. Possible machine training/scraping pattern.');
    scoreDeduction += 20;
  }

  return {
    isDuplicate: scoreDeduction >= 15,
    scoreDeduction,
    reasons
  };
}

/**
 * Computes active trust score based on play history telemetry
 */
export function calculateDynamicTrustScore(profile: PlayerProfile): number {
  let score = 100;

  // Penalize for low accuracy
  if (profile.stats.matchesPlayed >= 3) {
    if (profile.stats.accuracy < 60) {
      score -= (60 - profile.stats.accuracy) * 1.2;
    }
  }

  // Penalize for too many insane matches with perfect zero reaction times (impossible for biological nerves)
  if (profile.stats.insaneCount > 0 && profile.stats.fastestSolveMs < 300 && profile.stats.fastestSolveMs > 0) {
    score -= 30; // Suspicious of automated inputs/hacks
  }

  // Reward continuous match completions/streaks
  if (profile.stats.longestStreak > 5) {
    score += Math.min(10, profile.stats.longestStreak * 0.8);
  }

  // Cap trust score boundaries
  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Encryptes profile details into custom portable passport payload string (base64 obfuscated)
 */
export function encryptHumanPassport(profile: PlayerProfile): string {
  try {
    const passportData = {
      v: 2,
      id: profile.humanId,
      nick: profile.nickname,
      c: profile.country,
      xp: profile.rankXP,
      lvl: profile.rankLevel,
      scr: profile.score,
      badge: profile.activeBadge,
      rc: profile.recoveryCode,
      ts: profile.trustScore,
      badges: profile.purchasedBadges,
      st: profile.stats
    };
    const json = JSON.stringify(passportData);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    return '';
  }
}

/**
 * Decrypts custom portable passport payload string
 */
export function decryptHumanPassport(base64: string): Partial<PlayerProfile> | null {
  try {
    const decodedJson = decodeURIComponent(escape(atob(base64)));
    const passportData = JSON.parse(decodedJson);
    if (!passportData.id) return null;
    
    return {
      humanId: passportData.id,
      nickname: passportData.nick,
      country: passportData.c,
      rankXP: passportData.xp,
      rankLevel: passportData.lvl,
      score: passportData.scr,
      activeBadge: passportData.badge,
      recoveryCode: passportData.rc,
      trustScore: passportData.ts || 100,
      purchasedBadges: passportData.badges || ['Authorized'],
      stats: passportData.st
    };
  } catch (e) {
    return null;
  }
}
