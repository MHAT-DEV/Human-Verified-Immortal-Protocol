import { useState, useEffect, useRef } from 'react';
import { Difficulty, CaptchaChallenge, CaptchaItem, PlayerProfile } from '../types';
import { Language } from '../i18n';
import { generateMatchChallenges } from '../data/captchas';
import { Check, X, ShieldAlert, Timer, Award, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface ArenaGameProps {
  profile: PlayerProfile;
  difficulty: Difficulty;
  language: Language;
  onFinishMatch: (results: {
    totalPointsEarned: number;
    solvedCount: number;
    accuracy: number;
    solveTimeMs: number;
  }) => void;
  onCancelMatch: () => void;
}

export default function ArenaGame({
  profile,
  difficulty,
  language,
  onFinishMatch,
  onCancelMatch
}: ArenaGameProps) {
  const [challenges, setChallenges] = useState<CaptchaChallenge[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [textAnswerInput, setTextAnswerInput] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(20);
  const [sequenceExpected, setSequenceExpected] = useState<number>(1);
  const [memoryRevealed, setMemoryRevealed] = useState<boolean>(true);
  const [reactionClicked, setReactionClicked] = useState<boolean>(false);

  // Score stats per round
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [activeCombo, setActiveCombo] = useState<number>(0);
  const [longestCombo, setLongestCombo] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);

  // Timers and transitions
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [totalWindow, setTotalWindow] = useState<number>(10);
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'SUCCESS' | 'FAIL' | null>(null);

  // Match timestamps
  const matchStartTimestamp = useRef<number>(Date.now());

  // Web Audio Synthesizer Node
  const playFrequency = (frequency: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine', durationSec = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch (e) {
      // Audio context may be inactive, ignore gracefully in sandbox iframe
    }
  };

  // Compile 5 random challenges on load
  useEffect(() => {
    const list = generateMatchChallenges(difficulty, 'TH', profile?.deviceType || 'DESKTOP');
    setChallenges(list);
    setCurrentIdx(0);
    loadChallengeState(list[0]);
    matchStartTimestamp.current = Date.now();
  }, [difficulty, profile]);

  // Load appropriate variables for active challenge
  const loadChallengeState = (chal: CaptchaChallenge) => {
    if (!chal) return;
    setSelectedItems([]);
    setTextAnswerInput('');
    setSliderValue(chal.sliderInitial ?? 20);
    setSequenceExpected(1);
    setMemoryRevealed(true);
    setReactionClicked(false);
    setFeedback(null);
    setLoadingNext(false);

    // Set countdown timers based on difficulty modes:
    let windowSec = 12; // Easy
    if (difficulty === 'HARD') windowSec = 7.5;
    if (difficulty === 'INSANE') windowSec = 4.2;

    // React speed challenges hold extremely narrow reaction popups
    if (chal.type === 'REACTION') {
      windowSec = 1.0;
    }

    setSecondsRemaining(windowSec);
    setTotalWindow(windowSec);

    // If memory trial type, trigger visual occlusion countdown
    if (chal.type === 'MEMORY') {
      playFrequency(650, 'sine', 0.15);
      setTimeout(() => {
        setMemoryRevealed(false);
        playFrequency(480, 'sine', 0.1);
      }, 2000); // 2s memory phase
    } else {
      playFrequency(750, 'triangle', 0.08);
    }
  };

  // Countdown timer clock
  useEffect(() => {
    if (loadingNext || !challenges[currentIdx]) return;

    const tick = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(tick);
          handleTriggerFailure(); // Expired!
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(tick);
  }, [secondsRemaining, loadingNext, currentIdx, challenges]);

  const handleTriggerSuccess = () => {
    const timeRemainingFactor = secondsRemaining / totalWindow;
    let baseAwardPts = 25; // Easy
    if (difficulty === 'HARD') baseAwardPts = 125;
    if (difficulty === 'INSANE') baseAwardPts = 1100;

    // Bonuses mapping
    const comboInc = activeCombo + 1;
    const gained = Math.round(baseAwardPts * comboInc * (1 + timeRemainingFactor));
    
    setFeedback('SUCCESS');
    setSolvedCount(prev => prev + 1);
    setPointsEarned(prev => prev + gained);
    
    const newCombo = activeCombo + 1;
    setActiveCombo(newCombo);
    if (newCombo > longestCombo) {
      setLongestCombo(newCombo);
    }
    setTotalAttempts(p => p + 1);

    // Synthesize victory ring notes
    playFrequency(880, 'sine', 0.06);
    setTimeout(() => playFrequency(1200, 'sine', 0.15), 60);

    advanceNextWithDelay();
  };

  const handleTriggerFailure = () => {
    setFeedback('FAIL');
    setActiveCombo(0);
    setTotalAttempts(p => p + 1);

    // Synthesize bad buzzer
    playFrequency(140, 'square', 0.35);

    advanceNextWithDelay();
  };

  const advanceNextWithDelay = () => {
    setLoadingNext(true);
    setTimeout(() => {
      if (currentIdx + 1 < challenges.length) {
        setCurrentIdx(p => p + 1);
        loadChallengeState(challenges[currentIdx + 1]);
      } else {
        // Complete match! Calculate summaries
        const durationSec = (Date.now() - matchStartTimestamp.current) / 1000;
        const accuracyRate = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 100;

        onFinishMatch({
          totalPointsEarned: pointsEarned,
          solvedCount,
          accuracy: accuracyRate,
          solveTimeMs: Math.round(durationSec * 1000)
        });
      }
    }, 1600); // feedback reveal pause
  };

  // Interactive submit triggers per type:
  const handleSubmitImageSelect = () => {
    const chal = challenges[currentIdx];
    if (!chal || !chal.items) return;

    // Find all target ids, and ensure user selected exactly those
    const targetIds = chal.items.filter(it => it.isTarget).map(it => it.id);
    const correctSelection = 
      selectedItems.length === targetIds.length && 
      selectedItems.every(id => targetIds.includes(id));

    if (correctSelection) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleSubmitDistortedText = () => {
    const chal = challenges[currentIdx];
    if (!chal || !chal.textAnswer) return;

    const userInputNormalized = textAnswerInput.toLowerCase().replace(/\s+/g, '');
    if (userInputNormalized === chal.textAnswer) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleSubmitSlider = () => {
    const chal = challenges[currentIdx];
    if (!chal || chal.sliderTarget === undefined) return;

    // Correct if input lands within target boundaries +/- 4%
    const tolerance = 4;
    const diff = Math.abs(sliderValue - chal.sliderTarget);
    if (diff <= tolerance) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleSelectEmojiItem = (itemId: string, isTarget: boolean) => {
    if (isTarget) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleSelectShapeItem = (itemId: string) => {
    // Shape select uses multiples, toggle check
    let nextList = [...selectedItems];
    if (nextList.includes(itemId)) {
      nextList = nextList.filter(id => id !== itemId);
    } else {
      nextList.push(itemId);
    }
    setSelectedItems(nextList);
    playFrequency(440, 'triangle', 0.05);
  };

  const handleSubmitShapeSelect = () => {
    const chal = challenges[currentIdx];
    if (!chal || !chal.items) return;

    const targets = chal.items.filter(it => it.isTarget).map(it => it.id);
    const correct = 
      selectedItems.length === targets.length && 
      selectedItems.every(id => targets.includes(id));

    if (correct) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleSequenceClick = (numStr: string, itemId: string) => {
    const val = parseInt(numStr, 10);
    if (val === sequenceExpected) {
      playFrequency(350 + val * 100, 'sine', 0.08);
      let nextExpected = val + 1;
      setSequenceExpected(nextExpected);
      
      // Update selected
      setSelectedItems(prev => [...prev, itemId]);

      if (nextExpected > 5) {
        handleTriggerSuccess();
      }
    } else {
      handleTriggerFailure();
    }
  };

  const handleMemorySubmit = (ansIndex: number) => {
    const chal = challenges[currentIdx];
    if (!chal || chal.correctIndex === undefined) return;

    if (ansIndex === chal.correctIndex) {
      handleTriggerSuccess();
    } else {
      handleTriggerFailure();
    }
  };

  const handleReactionClick = () => {
    if (feedback !== null || reactionClicked) return;
    setReactionClicked(true);
    handleTriggerSuccess();
  };

  const handleSkipPenalty = () => {
    playFrequency(120, 'sawtooth', 0.2);
    // Point deduction
    setPointsEarned(p => Math.max(0, p - 35));
    handleTriggerFailure();
  };

  const activeChallenge = challenges[currentIdx];

  if (!activeChallenge) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-mono space-y-4" id="arena-loader">
        <span className="w-8 h-8 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        <p className="text-xs">{language === 'en' ? 'Synchronizing physical inputs...' : 'กำลังจัดเตรียมการสแกนเรตินา...'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-6" id="arena-game-card">
      
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-805 pb-4" id="hud-bar">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 rounded-lg">
            {language === 'en' ? 'DIFFICULTY' : 'ระดับ'}: {difficulty}
          </div>
          <div className="text-xs font-mono font-bold text-slate-400">
            {language === 'en' ? 'CHALLENGE' : 'โจทย์ที่'}: {currentIdx + 1} / 5
          </div>
        </div>

        {/* Combo + Score displays */}
        <div className="flex items-center gap-4" id="hud-combo-scores">
          {activeCombo > 1 && (
            <div className="flex items-center gap-1.5 bg-yellow-950/40 border border-yellow-700/30 text-yellow-400 text-xs font-mono font-black py-1 px-3 rounded-full animate-pulse" id="combo-shouting-box">
              <Award className="w-3.5 h-3.5" />
              <span>COMBO x{activeCombo}</span>
            </div>
          )}

          <div className="text-right" id="score-ticker">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              {language === 'en' ? 'MATCH POINTS' : 'คะแนนรอบนี้'}
            </div>
            <div className="text-lg font-mono font-black text-emerald-400">
              +{pointsEarned.toLocaleString()} pts
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Progress Slider bar */}
      <div className="space-y-1" id="timer-bar-component">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3 text-slate-400" />
            {language === 'en' ? 'IDENTIFICATIVE CORRELATION COUNTER' : 'เกจเวลาพิสูจน์ลมหายใจ'}
          </span>
          <span className={secondsRemaining < 2.5 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300 font-bold'}>
            {secondsRemaining}s
          </span>
        </div>

        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-900" id="timer-tunnel">
          <div 
            className={`h-full rounded-full transition-all duration-100 ease-linear ${
              secondsRemaining < 2.5 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(secondsRemaining / totalWindow) * 100}%` }}
            id="timer-bar-fluid animate-pulse"
          />
        </div>
      </div>

      {/* Impossible scenario warning badge */}
      {activeChallenge.isImpossible && (
        <div className="bg-purple-950/30 border border-purple-500/30 p-2.5 rounded-xl text-center flex items-center justify-center gap-2 animate-bounce" id="impossible-banner">
          <AlertTriangle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
            {language === 'en' ? '⚠️ UNKNOWN PHENOMENON DETECTED ⚠️' : '⚠️ ตรวจพบตรรกะเหนือธรรมชาติของเครื่องจักร ⚠️'}
          </span>
        </div>
      )}

      {/* Puzzle Shell Prompt */}
      <div className={`bg-gradient-to-br p-6 rounded-2xl border transition-all relative ${activeChallenge.themeClass || 'from-slate-950 to-slate-900 border-slate-800'}`} id="puzzle-box">
        
        {/* Main Instruction label */}
        <h3 className="text-sm md:text-base font-bold text-slate-100 mb-4 tracking-tight leading-snug" id="puzzle-instruction-lbl">
          {language === 'en' ? activeChallenge.instructionEn : activeChallenge.instructionTh}
        </h3>

        {/* Challenge Interactive elements rendered by type */}
        <div className="flex items-center justify-center min-h-[160px] pb-2" id="challenge-active-frame">
          
          {/* A. IMAGE_SELECT / REVERSE_LOGIC / IMPOSSIBLE */}
          {(activeChallenge.type === 'IMAGE_SELECT' || activeChallenge.type === 'REVERSE_LOGIC' || activeChallenge.type === 'IMPOSSIBLE') && activeChallenge.items && (
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px]" id="select-grid-box">
              {activeChallenge.items.map((it) => {
                const isChosen = selectedItems.includes(it.id);
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      if (loadingNext) return;
                      // Toggle selected
                      if (isChosen) {
                        setSelectedItems(prev => prev.filter(id => id !== it.id));
                      } else {
                        setSelectedItems(prev => [...prev, it.id]);
                      }
                      playFrequency(400, 'triangle', 0.05);
                    }}
                    className={`aspect-square p-2 border-2 rounded-xl transition flex flex-col items-center justify-center text-4xl hover:scale-105 active:scale-95 shadow cursor-pointer ${
                      isChosen 
                        ? 'border-emerald-400 bg-emerald-950/30' 
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                    id={`grid-item-${it.id}`}
                  >
                    <span>{it.icon}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* B. DISTORTED_TEXT */}
          {activeChallenge.type === 'DISTORTED_TEXT' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm" id="distort-text-box">
              {/* Fake visual sound tube container representing wav distortion */}
              <div className="bg-black/90 border border-slate-800 p-5 rounded-xl text-center relative overflow-hidden select-none tracking-[0.4em] font-extrabold text-2xl skew-x-12 select-none" id="distort-word-canvas">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-45 pointer-events-none" />
                {/* Visual lines overlay */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent -translate-y-1/2" />
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 via-emerald-300 to-indigo-400 font-mono antialiased drop-shadow relative z-10 select-none">
                  {activeChallenge.textDisplay}
                </span>
              </div>

              <input
                type="text"
                value={textAnswerInput}
                onChange={(e) => setTextAnswerInput(e.target.value)}
                disabled={loadingNext}
                placeholder={language === 'en' ? "Verify sequence code..." : "พิมพ์ผลถอดรหัสรบกวนตรงนี้..."}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono tracking-widest uppercase"
                id="distort-text-input"
              />
            </div>
          )}

          {/* C. SLIDER */}
          {activeChallenge.type === 'SLIDER' && activeChallenge.sliderTarget !== undefined && (
            <div className="w-full max-w-sm space-y-6 flex flex-col items-center" id="slider-box">
              {/* Puzzle lock housing */}
              <div className="w-full h-16 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex items-center" id="slider-notch-lane">
                {/* Target locking notch visual block */}
                <div 
                  className="absolute h-full w-12 bg-emerald-500/20 border-x border-emerald-400 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 animate-pulse"
                  style={{ left: `${activeChallenge.sliderTarget - 6}%` }}
                >
                  LOCK
                </div>

                {/* Users sliding notch piece */}
                <div 
                  className="absolute h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center font-mono text-xs font-black text-white shadow-lg transition-transform"
                  style={{ left: `${sliderValue - 4}%` }}
                >
                  ⚙️
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(parseInt(e.target.value, 10));
                  playFrequency(220 + parseInt(e.target.value, 10) * 4, 'sine', 0.05);
                }}
                disabled={loadingNext}
                className="w-full h-2 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="interactive-drag-slider"
              />
            </div>
          )}

          {/* D. EMOJI */}
          {activeChallenge.type === 'EMOJI' && activeChallenge.items && (
            <div className="grid grid-cols-4 gap-2.5 max-w-[320px]" id="emoji-challenge-grid">
              {activeChallenge.items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    if (loadingNext) return;
                    handleSelectEmojiItem(it.id, it.isTarget);
                  }}
                  className="aspect-square p-2 bg-slate-950 border border-slate-850 hover:border-slate-700/80 rounded-xl text-3xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
                  id={`emoji-grid-item-${it.id}`}
                >
                  <span>{it.icon}</span>
                </button>
              ))}
            </div>
          )}

          {/* E. Geometric Colors / SHAPE */}
          {activeChallenge.type === 'SHAPE' && activeChallenge.items && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-sm" id="shape-selectors-grid">
              {activeChallenge.items.map((it) => {
                const isChosen = selectedItems.includes(it.id);
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      if (loadingNext) return;
                      handleSelectShapeItem(it.id);
                    }}
                    className={`p-3 border-2 rounded-xl text-center text-xs font-mono font-bold font-medium hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                      isChosen 
                        ? 'border-emerald-400 bg-emerald-950/20 text-emerald-300' 
                        : 'border-slate-850 bg-slate-950 text-slate-350 hover:border-slate-750'
                    }`}
                    id={`shape-item-${it.id}`}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* F. MEMORY CHALLENGE */}
          {activeChallenge.type === 'MEMORY' && activeChallenge.memoryItems && (
            <div className="flex flex-col items-center gap-6 w-full max-w-sm" id="memory-trial-layout">
              {memoryRevealed ? (
                <div className="flex gap-4 p-4 bg-slate-950 border border-slate-850 rounded-xl" id="mem-sequence-card">
                  {activeChallenge.memoryItems.map((emoji, idx) => (
                    <div key={idx} className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-2xl relative" id={`mem-item-prev-${idx}`}>
                      <span className="absolute top-1 left-1.5 text-[8px] font-mono font-bold text-slate-500">#{idx + 1}</span>
                      <span>{emoji}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-4" id="mem-question-container">
                  <p className="text-sm font-semibold text-slate-200">
                    {language === 'en' ? activeChallenge.memoryQuestionEn : activeChallenge.memoryQuestionTh}
                  </p>

                  <div className="grid grid-cols-4 gap-3" id="mem-answers-row">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleMemorySubmit(num)}
                        className="py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-sm font-mono font-black text-slate-200 active:scale-95 transition cursor-pointer"
                        id={`btn-mem-option-${num}`}
                      >
                        POS {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* G. SEQUENCE CHALLENGE */}
          {activeChallenge.type === 'SEQUENCE' && activeChallenge.items && (
            <div className="flex flex-col items-center gap-3 w-full" id="sequence-panel-box">
              <div className="text-xs font-mono text-slate-400 mb-1" id="sequence-guide">
                {language === 'en' ? 'Expected Node Number' : 'ขั้นลำดับที่คาดไว้'}: <strong className="text-emerald-400 text-sm">[{sequenceExpected}]</strong>
              </div>

              <div className="grid grid-cols-5 gap-3 max-w-[280px]" id="sequence-target-grid">
                {activeChallenge.items.map((it) => {
                  const alreadyPressed = selectedItems.includes(it.id);
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        if (loadingNext || alreadyPressed) return;
                        handleSequenceClick(it.label || '0', it.id);
                      }}
                      className={`aspect-square p-2 border rounded-xl text-sm font-mono font-bold flex flex-col items-center justify-center transition active:scale-95 shadow cursor-pointer ${
                        alreadyPressed
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 pointer-events-none'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:scale-105'
                      }`}
                      id={`seq-btn-${it.id}`}
                    >
                      {alreadyPressed ? '✓' : it.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* H. REACTION FLASHER */}
          {activeChallenge.type === 'REACTION' && (
            <div className="w-full flex justify-center items-center py-4" id="reaction-flicker-area">
              <button
                onClick={handleReactionClick}
                disabled={loadingNext || reactionClicked}
                className="w-32 h-32 rounded-full border-8 border-red-600 bg-gradient-to-r from-red-500 to-rose-600 active:scale-90 transition-all flex flex-col items-center justify-center font-mono font-black text-white text-center shadow-2xl relative animate-pulse cursor-pointer"
                id="btn-reaction-trigger"
              >
                <span className="text-lg uppercase tracking-wider">{language === 'en' ? 'CLICK!' : 'ตบเลย!'}</span>
                <span className="text-[10px] opacity-75">{language === 'en' ? 'NOW' : 'เดี๋ยวนี้'}</span>
              </button>
            </div>
          )}

          {/* I. HUMOROUS DEDUCTIVE LOGIC */}
          {activeChallenge.type === 'LOGIC' && activeChallenge.items && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md" id="logic-questions-grid">
              {activeChallenge.items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    if (loadingNext) return;
                    if (it.isTarget) {
                      handleTriggerSuccess();
                    } else {
                      handleTriggerFailure();
                    }
                  }}
                  className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-600 p-3 rounded-xl text-left text-xs text-slate-300 font-medium active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  id={`logic-item-${it.id}`}
                >
                  <span className="text-base">{it.icon?.split(' ')[0]}</span>
                  <span>{it.icon?.substring(it.icon.indexOf(' ') + 1) || it.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Dynamic feedback overlay layer */}
        {feedback && (
          <div className="absolute inset-0 bg-black/90 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 z-20 animate-fade-in" id="turn-feedback-shield">
            {feedback === 'SUCCESS' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center text-3xl animate-bounce">
                  ✓
                </div>
                <h2 className="text-xl font-mono font-black text-emerald-400">
                  {language === 'en' ? 'HUMAN VERIFIED' : 'รับรองคลื่นชีวภาพเสร็จ'}
                </h2>
                <p className="text-xs text-slate-400 font-mono tracking-tight">
                  {language === 'en' ? 'Combo stream maintained' : 'รักษาความเสถียรคอมโบสำเร็จ'}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border-2 border-red-550 flex items-center justify-center text-3xl animate-shake">
                  ✕
                </div>
                <h2 className="text-xl font-mono font-black text-red-400">
                  {language === 'en' ? 'ARE YOU A ROBOT?' : 'คลื่นสมองเป็นหุ่นยนต์?'}
                </h2>
                <p className="text-xs text-slate-400 font-mono tracking-tight">
                  {language === 'en' ? 'Internal systems report anomaly delay!' : 'ตัวตรวจสอบระบุระดับสั่นไหวของบอท!'}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual Actions panel */}
      <div className="flex items-center justify-between gap-4" id="arena-submit-actions">
        <button
          onClick={onCancelMatch}
          className="text-slate-500 hover:text-slate-300 font-mono text-xs hover:underline transition"
          id="btn-arena-cancel"
        >
          {language === 'en' ? 'Abort match' : 'กดยอมแพ้ล่าถอย'}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSkipPenalty}
            disabled={loadingNext}
            className="px-4 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-mono font-semibold rounded-xl transition"
            id="btn-force-skip"
          >
            {language === 'en' ? 'SKIP CHALLENGE (-35 pts Penalty)' : 'ข้าม (หัก 35 แต้ม)'}
          </button>

          {/* Render manual submit buttons only for Image and Shape grids */}
          {(activeChallenge.type === 'IMAGE_SELECT' || activeChallenge.type === 'SHAPE' || activeChallenge.type === 'REVERSE_LOGIC') && (
            <button
              onClick={
                activeChallenge.type === 'IMAGE_SELECT' 
                  ? handleSubmitImageSelect 
                  : activeChallenge.type === 'REVERSE_LOGIC'
                  ? handleSubmitImageSelect
                  : handleSubmitShapeSelect
              }
              disabled={loadingNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition shadow cursor-pointer shadow-emerald-600/20"
              id="btn-captcha-submit"
            >
              {language === 'en' ? 'SUBMIT CAPTCHA' : 'ส่งคำตอบลุยต่อ'}
            </button>
          )}

          {/* Text check button */}
          {activeChallenge.type === 'DISTORTED_TEXT' && (
            <button
              onClick={handleSubmitDistortedText}
              disabled={loadingNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition shadow cursor-pointer shadow-emerald-600/20"
              id="btn-text-submit"
            >
              {language === 'en' ? 'SUBMIT CAPTCHA' : 'ส่งคำตอบลุยต่อ'}
            </button>
          )}

          {/* Slider check button */}
          {activeChallenge.type === 'SLIDER' && (
            <button
              onClick={handleSubmitSlider}
              disabled={loadingNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition shadow cursor-pointer shadow-emerald-600/20"
              id="btn-slider-submit"
            >
              {language === 'en' ? 'ALIGNED COG' : 'สับสะพานไฟประกบ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
