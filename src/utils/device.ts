import { PlayerProfile } from '../types';

export interface DeviceSpecs {
  screenSize: string;
  touchSupport: boolean;
  pointerType: 'mouse' | 'touch' | 'pen' | 'hybrid';
  aspectRatio: string;
  pixelDensity: number;
  orientation: 'portrait' | 'landscape';
  deviceClass: 'DESKTOP' | 'TABLET' | 'MOBILE';
}

/**
 * Procedurally detects current device specifications, screen metrics, and touch capabilities.
 */
export function detectDevice(): DeviceSpecs {
  const width = window.screen.width || window.innerWidth;
  const height = window.screen.height || window.innerHeight;
  const screenSize = `${width}x${height}`;
  
  const touchSupport = (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0
  );

  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /mobile|iphone|ipad|ipod|android|blackberry|iemobile|webos/i.test(ua);
  const isTabletUA = /ipad|android(?!.*mobile)/i.test(ua) || (touchSupport && width >= 768 && width <= 1024);

  let deviceClass: 'DESKTOP' | 'TABLET' | 'MOBILE' = 'DESKTOP';
  if (isMobileUA && !isTabletUA && width < 768) {
    deviceClass = 'MOBILE';
  } else if (isTabletUA || (touchSupport && width >= 768 && width <= 1024)) {
    deviceClass = 'TABLET';
  } else if (width < 768) {
    deviceClass = 'MOBILE';
  } else if (width <= 1180 && touchSupport) {
    deviceClass = 'TABLET';
  }

  // Pointer Type Resolution
  let pointerType: 'mouse' | 'touch' | 'pen' | 'hybrid' = 'mouse';
  if (touchSupport) {
    pointerType = deviceClass === 'DESKTOP' ? 'hybrid' : 'touch';
  }

  const aspectRatioNum = window.innerWidth / (window.innerHeight || 1);
  const aspectRatio = `${window.innerWidth}:${window.innerHeight} (${aspectRatioNum.toFixed(2)})`;
  const pixelDensity = window.devicePixelRatio || 1;
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

  return {
    screenSize,
    touchSupport,
    pointerType,
    aspectRatio,
    pixelDensity,
    orientation,
    deviceClass,
  };
}

/**
 * Synchronizes detected device specifications to player profile, creating/keeping existing stats.
 */
export function syncDeviceToProfile(profile: PlayerProfile): PlayerProfile {
  const specs = detectDevice();
  const deviceClass = specs.deviceClass;

  const defaultStats = { attempts: 0, solved: 0, fastestSolveMs: 0, accuracy: 0 };
  
  const existingStats = profile.gameplayStatsPerDevice || {
    DESKTOP: { ...defaultStats },
    TABLET: { ...defaultStats },
    MOBILE: { ...defaultStats }
  };

  // Ensure all keys exist
  const updatedStats = {
    DESKTOP: existingStats.DESKTOP || { ...defaultStats },
    TABLET: existingStats.TABLET || { ...defaultStats },
    MOBILE: existingStats.MOBILE || { ...defaultStats }
  };

  return {
    ...profile,
    deviceType: deviceClass,
    preferredDevice: profile.preferredDevice || deviceClass,
    deviceSpecs: specs,
    gameplayStatsPerDevice: updatedStats
  };
}

/**
 * Register attempts or solves in the per-device statistics panel.
 */
export function recordDeviceGameplay(
  profile: PlayerProfile,
  deviceClass: 'DESKTOP' | 'TABLET' | 'MOBILE',
  isSolved: boolean,
  solveTimeMs: number
): PlayerProfile {
  const stats = profile.gameplayStatsPerDevice || {
    DESKTOP: { attempts: 0, solved: 0, fastestSolveMs: 0, accuracy: 0 },
    TABLET: { attempts: 0, solved: 0, fastestSolveMs: 0, accuracy: 0 },
    MOBILE: { attempts: 0, solved: 0, fastestSolveMs: 0, accuracy: 0 }
  };

  const current = stats[deviceClass] || { attempts: 0, solved: 0, fastestSolveMs: 0, accuracy: 0 };
  const newAttempts = current.attempts + 1;
  const newSolved = current.solved + (isSolved ? 1 : 0);
  const newAccuracy = Math.round((newSolved / newAttempts) * 100);
  
  let newFastest = current.fastestSolveMs;
  if (isSolved) {
    newFastest = current.fastestSolveMs === 0 ? solveTimeMs : Math.min(current.fastestSolveMs, solveTimeMs);
  }

  const updatedStats = {
    ...stats,
    [deviceClass]: {
      attempts: newAttempts,
      solved: newSolved,
      fastestSolveMs: newFastest,
      accuracy: newAccuracy
    }
  };

  return {
    ...profile,
    gameplayStatsPerDevice: updatedStats
  };
}

/**
 * Detect Performance Level of currently running environment to set effects scaling.
 */
export function getPerformanceTier(): 'LOW' | 'MID' | 'HIGH' {
  // Simple hardware/browser capability heuristic
  const cores = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  // Mobile or tablet can default to mid if specs are decent, but low-end or old devices should be mid/low
  const specs = detectDevice();
  if (specs.deviceClass === 'MOBILE') {
    if (cores <= 4 || deviceMemory <= 3) return 'LOW';
    return 'MID';
  }

  if (cores >= 8 && deviceMemory >= 8) {
    return 'HIGH';
  } else if (cores <= 2 || deviceMemory <= 4) {
    return 'LOW';
  }
  return 'MID';
}
