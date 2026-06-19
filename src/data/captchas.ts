import { CaptchaChallenge, CaptchaType, CaptchaItem, Difficulty } from '../types';

const EMOJIS = ['🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🚀', '⭐', '🦖', '💡', '🔥', '💧', '🌲', '🌮', '🎯', '🥑', '🍔', '🍦'];
const SHAPES = ['Circle', 'Triangle', 'Square', 'Pentagon', 'Star', 'Diamond'];
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Magenta', 'Cyan'];
const WORDS_POOL = ['HUMAN', 'PROVE', 'ARENA', 'ROBOT', 'VERIFY', 'PASS', 'CLICK', 'SPEED', 'INTENSE', 'COGNITIVE', 'SULFUR', 'HYDRANT', 'EXPIRED', 'TRAFFIC', 'CROSSWALK'];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeGridItems(targetIcon: string, otherIcons: string[], size: number, targetCount: number): CaptchaItem[] {
  let items: CaptchaItem[] = [];
  for (let i = 0; i < targetCount; i++) {
    items.push({
      id: `target-${i}-${Math.random()}`,
      icon: targetIcon,
      isTarget: true,
      isSelected: false,
    });
  }
  const fillerCount = size - targetCount;
  for (let i = 0; i < fillerCount; i++) {
    const fillerIcon = otherIcons[Math.floor(Math.random() * otherIcons.length)];
    items.push({
      id: `filler-${i}-${Math.random()}`,
      icon: fillerIcon,
      isTarget: false,
      isSelected: false,
    });
  }
  return shuffleArray(items);
}

/**
 * Procedural CAPTCHA generation engine adapting themes based on user country and injecting expanded categories.
 */
export function generateChallenge(type: CaptchaType, isImpossibleEvent = false, country = 'TH'): CaptchaChallenge {
  const challengeId = `challenge-${Math.random().toString(36).substr(2, 9)}`;

  // Default theme background styles
  let themeStyle = 'from-slate-900 to-slate-950 border-slate-800 text-slate-100';

  if (isImpossibleEvent) {
    const impossibleScenarios = [
      {
        en: "Select the cat that believes it is a toaster (0.01% Probability)",
        th: "กรุณาเลือกรูปภาพของ 'น้องแมว' ที่คิดว่าตัวมันเป็นเครื่องปิ้งขนมปัง (ความน่าจะเป็น 0.01%)",
        items: [
          { id: '1', icon: '🐱 (Ping)', isTarget: true },
          { id: '2', icon: '🍞 (Toasty)', isTarget: false },
          { id: '3', icon: '🐱 (Meow)', isTarget: false },
          { id: '4', icon: '🔌 (Power)', isTarget: true },
        ]
      },
      {
        en: "Select all images representing emotional damage and regret.",
        th: "กรุณาเลือกภาพทั้งหมดที่เป็นเศษซากความเสียดายและร่องรอยของการโดนทำร้ายจิตใจ",
        items: [
          { id: '1', icon: '🥀 Withered Rose', isTarget: true },
          { id: '2', icon: '💔 Broken Heart', isTarget: true },
          { id: '3', icon: '☕ Hot Matcha', isTarget: false },
          { id: '4', icon: '📱 Unread Msg', isTarget: true },
        ]
      }
    ];
    const pick = impossibleScenarios[Math.floor(Math.random() * impossibleScenarios.length)];
    return {
      id: challengeId,
      type: 'IMPOSSIBLE',
      instructionEn: pick.en,
      instructionTh: pick.th,
      items: pick.items.map(item => ({ ...item, isSelected: false })),
      isImpossible: true,
      themeClass: 'from-purple-950 to-pink-950 border-pink-500 shadow-[0_0_15px_rgba(23EC,72,153,0.5)]'
    };
  }

  switch (type) {
    case 'IMAGE_SELECT': {
      // Localized region-specific theme adaptation
      let model = { en: 'Cats', th: 'น้องแมว', target: '🐱', others: ['🐶', '🌲', '🚗'] };
      
      if (country === 'TH') {
        const thThemes = [
          { en: 'Tuk-tuks', th: 'รถตุ๊กตุ๊กสามล้อไทย', target: '🛺', others: ['🚗', '🚲', '🏢', '🌲'] },
          { en: 'Thai Iced Tea', th: 'ชาไทยเย็นใส่นม', target: '🧋', others: ['🥥', '🍍', '☕', '🥤'] }
        ];
        model = thThemes[Math.floor(Math.random() * thThemes.length)];
      } else if (country === 'JP') {
        const jpThemes = [
          { en: 'Ramen bowl', th: 'ราเม็งร้อนๆ', target: '🍜', others: ['🍣', '🍢', '🍦', '🍔'] },
          { en: 'Vending machines', th: 'ตู้กดน้ำอัตโนมัติ', target: '🎰', others: ['📻', '🛒', '📦', '🚪'] }
        ];
        model = jpThemes[Math.floor(Math.random() * jpThemes.length)];
      } else if (country === 'US') {
        const usThemes = [
          { en: 'Pickup trucks', th: 'รถกระบะคันใหญ่', target: '🛻', others: ['🚲', '🛥️', '🛴', '🚋'] },
          { en: 'Burgers', th: 'เบอร์เกอร์ชิ้นโต', target: '🍔', others: ['🍕', '🍓', '🥕', '🍦'] }
        ];
        model = usThemes[Math.floor(Math.random() * usThemes.length)];
      } else if (country === 'KR') {
        const krThemes = [
          { en: 'Convenience stores', th: 'ร้านสะดวกซื้อยี่ห้อดัง', target: '🏪', others: ['🏢', '🏕️', '🏥', '🏖️'] },
          { en: 'Kimchi pots', th: 'หม้อกิมจิเกาหลี', target: '🍲', others: ['🍩', '🍇', '🍞', '🥤'] }
        ];
        model = krThemes[Math.floor(Math.random() * krThemes.length)];
      } else if (country === 'BR') {
        const brThemes = [
          { en: 'Footballs', th: 'ลูกฟุตบอลกลมๆ', target: '⚽', others: ['🏀', '🎾', '🥎', '🏐'] },
          { en: 'Flip-flops', th: 'รองเท้าแตะคีบ', target: '🩴', others: ['👟', '🥾', '👠', '🧣'] }
        ];
        model = brThemes[Math.floor(Math.random() * brThemes.length)];
      } else {
        // General themes
        const general = [
          { en: 'Traffic lights', th: 'ไฟจราจรแยกไฟแดง', target: '🚦', others: ['🚗', '🚇', '💡', '🚧'] },
          { en: 'Bicycles', th: 'รถจักรยานถีบ', target: '🚲', others: ['🛺', '🛴', '🚗', '🚋'] }
        ];
        model = general[Math.floor(Math.random() * general.length)];
      }

      const targetCount = Math.floor(Math.random() * 3) + 2; 
      const items = makeGridItems(model.target, model.others, 9, targetCount);
      return {
        id: challengeId,
        type: 'IMAGE_SELECT',
        instructionEn: `Select all squares containing [${model.en}]`,
        instructionTh: `กรุณาเลือกตารางที่มีสัญลักษณ์ [${model.th}] ทั้งหมด`,
        items,
        themeClass: 'from-slate-900 to-emerald-950 border-emerald-500 shadow-md'
      };
    }

    case 'AI_OR_HUMAN': {
      const items = shuffleArray([
        { id: '1', icon: '📷 Raw Polaroid', label: 'Photo', isTarget: true, isSelected: false },
        { id: '2', icon: '📸 Kodak Portra', label: 'Photo', isTarget: true, isSelected: false },
        { id: '3', icon: '🤖 Midjourney V6', label: 'AI Art', isTarget: false, isSelected: false },
        { id: '4', icon: '💻 Dall-E 3', label: 'AI Art', isTarget: false, isSelected: false },
        { id: '5', icon: '🎞️ 35mm Grain Film', label: 'Photo', isTarget: true, isSelected: false },
        { id: '6', icon: '🎨 Stable Diffusion', label: 'AI Art', isTarget: false, isSelected: false },
      ]);
      return {
        id: challengeId,
        type: 'AI_OR_HUMAN',
        instructionEn: "Verify Authenticity: Click all real biological photograph sources (Avoid AI-generated Art)",
        instructionTh: "กรุณาเลือกตรรกะภาพถ่ายชีวภาพจริง (หลีกเลี่ยงภาพดิจิตอลที่รังสรรค์โดย AI สติเบิล)",
        items,
        themeClass: 'from-slate-900 to-cyan-950 border-cyan-500'
      };
    }

    case 'PUG_OR_MUFFIN': {
      const items = shuffleArray([
        { id: '1', icon: '🐕 Pug Face', label: 'Pug Dog', isTarget: true, isSelected: false },
        { id: '2', icon: '🧁 Blueberry', label: 'Muffin Cake', isTarget: false, isSelected: false },
        { id: '3', icon: '🐶 Sleepy Pug', label: 'Pug Dog', isTarget: true, isSelected: false },
        { id: '4', icon: '🧁 Banana Choc', label: 'Muffin Cake', isTarget: false, isSelected: false },
        { id: '5', icon: '🧁 Swirly Frost', label: 'Muffin Cake', isTarget: false, isSelected: false },
        { id: '6', icon: '🐾 Wrinkly Pug', label: 'Pug Dog', isTarget: true, isSelected: false },
      ]);
      return {
        id: challengeId,
        type: 'PUG_OR_MUFFIN',
        instructionEn: "Biometric separation: Select all active specimens of [Pug Dogs]",
        instructionTh: "จงเลือกสเปกตรัมชีวะรูปใบหน้าของ [น้องหมาพันธุ์ปั๊ก] มารยาทสังคมสูงสุด",
        items,
        themeClass: 'from-amber-950/40 to-orange-950 border-amber-600'
      };
    }

    case 'HIDDEN_OBJECT': {
      const targetItems = [
        { nameEn: 'Tiny cat', nameTh: 'แมวน้อยล่องหน', icon: '🐱' },
        { nameEn: 'Lost key', nameTh: 'กุญแจทีหายสาบสูญ', icon: '🔑' },
        { nameEn: 'Hidden banana', nameTh: 'กล้วยทอดแอบซ่อน', icon: '🍌' },
        { nameEn: 'Invisible duck', nameTh: 'น่องเป็ดโปร่งแสง', icon: '🦆' }
      ];
      const selectedObj = targetItems[Math.floor(Math.random() * targetItems.length)];
      const fillers = ['🧱', '📦', '💿', '⌚', '💾', '🔌', '🧲', '🔩'];
      const items = makeGridItems(selectedObj.icon, fillers, 9, 1);
      return {
        id: challengeId,
        type: 'HIDDEN_OBJECT',
        instructionEn: `Scan closely: Find and locate the hidden [${selectedObj.nameEn}]`,
        instructionTh: `จงเพ่งรังสีสายตาเพื่อตามหาวัตถุซ่อนเร้น [${selectedObj.nameTh}] ที่อยู่ในกองรีไซเคิล`,
        items,
        themeClass: 'from-slate-900 to-rose-950 border-rose-500'
      };
    }

    case 'ALMOST_IDENTICAL': {
      const isAlt = Math.random() > 0.5;
      const items: CaptchaItem[] = [
        { id: '1', icon: '🍎 Real Red Apple', isTarget: false, isSelected: false },
        { id: '2', icon: '🍎 Real Red Apple', isTarget: false, isSelected: false },
        { id: '3', icon: isAlt ? '🍏 Green Apple' : '🍎 (Missing Leaf)', isTarget: true, isSelected: false },
        { id: '4', icon: '🍎 Real Red Apple', isTarget: false, isSelected: false },
      ];
      return {
        id: challengeId,
        type: 'ALMOST_IDENTICAL',
        instructionEn: "Anomaly spot: Choose the one element with incorrect rendering, shadow, or color details",
        instructionTh: "ค้นหาวัตถุที่มีความคลาดเคลื่อน (Anomaly) สีหรือเงาต่างจากพวกหนึ่งเดียว",
        items: shuffleArray(items),
        themeClass: 'from-slate-900 to-purple-950 border-purple-500'
      };
    }

    case 'WHAT_NOT_BELONG': {
      const spaces = [
        {
          en: "What does not belong in deep space?",
          th: "สิ่งใด 'ไม่ใช่' วัตถุที่ลอยอยู่ในห้วงอวกาศลึก?",
          target: '🧻 Toilet Paper',
          fillers: ['🚀 Rocket', '☄️ Comet', '🪐 Saturn', '🛸 UFO']
        },
        {
          en: "What is completely inedible to human organs?",
          th: "สิ่งใดที่มนุษย์ 'ไม่เคยนึกอยากกินและกลืนลงคอ'?",
          target: '🔧 Steel Monkey Wrench',
          fillers: ['🍰 Strawberry Cake', '🍕 Cheese Pizza', '🍣 Salmon Sushi']
        }
      ];
      const chosen = spaces[Math.floor(Math.random() * spaces.length)];
      const items = makeGridItems(chosen.target, chosen.fillers, 4, 1);
      return {
        id: challengeId,
        type: 'WHAT_NOT_BELONG',
        instructionEn: chosen.en,
        instructionTh: chosen.th,
        items,
        themeClass: 'from-zinc-900 to-amber-950 border-amber-600'
      };
    }

    case 'CHAOS_GRID': {
      const items = shuffleArray([
        { id: '1', icon: '🔋 Dynamic Spark', isTarget: true, isSelected: false },
        { id: '2', icon: '⚡ Lightning Core', isTarget: true, isSelected: false },
        { id: '3', icon: '🕳️ Blackhole Void', isTarget: false, isSelected: false },
        { id: '4', icon: '🗑️ Scrap Waste', isTarget: false, isSelected: false },
        { id: '5', icon: '💡 Halogen Glow', isTarget: true, isSelected: false },
        { id: '6', icon: '🔌 Defunct Wire', isTarget: false, isSelected: false },
      ]);
      return {
        id: challengeId,
        type: 'CHAOS_GRID',
        instructionEn: "Extreme Clutter: Click all objects discharging high energy state values",
        instructionTh: "โหมดกองขยะมหันตภัย: กดเลือกเฉพาะที่มีคลื่นความสั่นสะเทือนพลังงานบวกปล่อยออกมา",
        items,
        themeClass: 'from-red-950/30 to-violet-950 border-violet-500'
      };
    }

    case 'MEME_DETECTOR': {
      const items = shuffleArray([
        { id: '1', icon: '🐸 Pepe Frog', isTarget: true, isSelected: false },
        { id: '2', icon: '🐕 Doge Majestic', isTarget: true, isSelected: false },
        { id: '3', icon: '🗔 Folder Empty', isTarget: false, isSelected: false },
        { id: '4', icon: '🖹 Text File (.txt)', isTarget: false, isSelected: false },
      ]);
      return {
        id: challengeId,
        type: 'MEME_DETECTOR',
        instructionEn: "Meme validation: Select all original internet subculture legendary memes",
        instructionTh: "กรุณาเลือกตารางที่เป็นมีมตำนานอินเทอร์เน็ตของวัยรุ่นสร้างตัว",
        items,
        themeClass: 'from-teal-950 to-slate-900 border-teal-500'
      };
    }

    case 'HUMAN_EMOTION': {
      const targetEmotions = [
        { search: 'Happy', emoji: '😊 Simple Smile', iconTarget: '😊' },
        { search: 'Angry', emoji: '😡 Rage Red', iconTarget: '😡' },
        { search: 'Confused', emoji: '😕 Clueless Face', iconTarget: '😕' }
      ];
      const pick = targetEmotions[Math.floor(Math.random() * targetEmotions.length)];
      const items: CaptchaItem[] = [
        { id: 'e1', icon: '😊 Smiling Face', isTarget: pick.iconTarget === '😊', isSelected: false },
        { id: 'e2', icon: '😡 angry Fuming', isTarget: pick.iconTarget === '😡', isSelected: false },
        { id: 'e3', icon: '😕 Confused Forehead', isTarget: pick.iconTarget === '😕', isSelected: false },
        { id: 'e4', icon: '😭 Crying Rivers', isTarget: false, isSelected: false }
      ];
      return {
        id: challengeId,
        type: 'HUMAN_EMOTION',
        instructionEn: `Select the face depicting human emotion: [${pick.search}]`,
        instructionTh: `จงมองหาและคัดเลือกใบหน้าที่สะท้อนอุณหภูมิจิตใจระดับ: [${pick.emoji}]`,
        items: shuffleArray(items),
        themeClass: 'from-emerald-950/40 to-slate-950 border-emerald-500'
      };
    }

    // SLIDER EXPANSIONS (Labyrinth)
    case 'ROTATING_PIECES':
    case 'DUAL_SLIDER':
    case 'MAGNETIC_PIECES':
    case 'WIND_PHYSICS':
    case 'ICE_MODE':
    case 'GRAVITY_MODE':
    case 'REVERSE_CONTROL':
    case 'SHRINKING_PUZZLE':
    case 'TIME_DISTORTION': {
      const initial = Math.floor(Math.random() * 20);
      const target = Math.floor(Math.random() * 40) + 45;
      const typeLabel = type.replace('_', ' ');
      return {
        id: challengeId,
        type: type,
        instructionEn: `[Labyrinth: ${typeLabel}] Slide cog to lock notch while battling physics distortions.`,
        instructionTh: `[พัซเซิลคันโยกต้านฟิสิกส์: ${typeLabel}] ลากแผงบังคับร่องล็อกให้ประจวบเหมาะกันพอดี`,
        sliderInitial: initial,
        sliderTarget: target,
        themeClass: 'from-indigo-950 to-blue-950 border-indigo-500 shadow-lg'
      };
    }

    // AUDIO VISUAL CIPHER EXPANSION
    case 'ROTATING_TEXT': {
      const word = WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];
      const num = Math.floor(Math.random() * 90 + 10);
      const textAnswer = word + num;
      return {
        id: challengeId,
        type: 'ROTATING_TEXT',
        instructionEn: "3D Spin Cipher: Identify the string whirling in continuous orbit rotation below:",
        instructionTh: "วงโคจรอักษรหมุนติ้ว 3 มิติ: จงระบุรหัสตัวหนังสือนอกระบบแรงโน้มถ่วงที่ลอยหมุนเคว้งคว้าง:",
        textDisplay: textAnswer.split('').join('  '),
        textAnswer: textAnswer.toLowerCase(),
        themeClass: 'from-purple-900 to-indigo-950 border-purple-500'
      };
    }

    case 'DISTORTED_TEXT': {
      const baseWord = WORDS_POOL[Math.floor(Math.random() * WORDS_POOL.length)];
      const textAnswer = baseWord + Math.floor(Math.random() * 90 + 10);
      const textDisplay = textAnswer.split('').map(char => {
        return Math.random() > 0.5 ? char : char.toLowerCase();
      }).join(' ');

      return {
        id: challengeId,
        type: 'DISTORTED_TEXT',
        instructionEn: "Type the distorted characters displayed in the noise frequency tube below:",
        instructionTh: "โปรดถอดรหัสตัวคัดไทย/อักษรคดเคี้ยว ที่กระจัดกระจายอยู่ในหลอดรบกวนด้านล่าง:",
        textDisplay,
        textAnswer: textAnswer.toLowerCase().replace(/\s+/g, ''),
        themeClass: 'from-slate-900 to-sky-950 border-sky-500'
      };
    }

    case 'AUDIO_NOISE': {
      const words = ['MAMMAL', 'ORGANIC', 'OXYGEN', 'CARBON', 'SAPIENS', 'HEARTBEAT'];
      const pickWord = words[Math.floor(Math.random() * words.length)];
      return {
        id: challengeId,
        type: 'AUDIO_NOISE',
        instructionEn: "Audio static analysis: Play static stream below and guess the spoken bio-key word:",
        instructionTh: "ระบบถอดรหัสคลื่นขยะเสียงสะท้อน: กดปุ่มฟังเสียงประมวลผลแล้วเลือกว่าคำที่ก้องกังวานอยู่ในหูคือคำใด:",
        textAnswer: pickWord.toLowerCase(),
        textDisplay: pickWord,
        themeClass: 'from-slate-900 to-yellow-950 border-yellow-500'
      };
    }

    case 'REVERSED_AUDIO': {
      const keys = ['BACON', 'WATER', 'REBEL', 'COFFEE', 'HUMAN'];
      const pick = keys[Math.floor(Math.random() * keys.length)];
      return {
        id: challengeId,
        type: 'REVERSED_AUDIO',
        instructionEn: "Reverse-acoustic key decoding: Type the word which is played backward below:",
        instructionTh: "รหัสเสียงย้อนกลับเวลา: โปรดฟังเสียงสะท้อนที่ไหลถอยหลังกลับไปแล้วพิมพ์ศัพท์ชิ้นนั้นลงมา:",
        textAnswer: pick.toLowerCase(),
        textDisplay: pick,
        themeClass: 'from-slate-900 to-cyan-950 border-cyan-500'
      };
    }

    case 'DISTORTED_MATH': {
      const a = Math.floor(Math.random() * 12) + 2;
      const b = Math.floor(Math.random() * 9) + 1;
      const ans = a + b;
      return {
        id: challengeId,
        type: 'DISTORTED_MATH',
        instructionEn: "Static Mathematical proof: Solve the equation hidden behind thermal grid interference",
        instructionTh: "คำนวณพิสูจน์ผลคณิตศาสตร์: คำนวณสมการที่บิดเบี้ยวจากคลื่นแทรกแซงความร้อนด้านล่าง",
        textDisplay: `${a} + ${b} = ?`,
        textAnswer: ans.toString(),
        themeClass: 'from-slate-900 to-emerald-950 border-emerald-500 animate-pulse'
      };
    }

    case 'MULTI_LANG_AUDIO': {
      const languages = [
        { code: 'th', text: 'สวัสดีครับมนุษย์ทุกคน', nameEn: 'Thai', nameTh: 'ภาษาไทย' },
        { code: 'ja', text: 'こんにちは、人間さん', nameEn: 'Japanese', nameTh: 'ภาษาญี่ปุ่น' },
        { code: 'ko', text: '안녕하세요 인간전사', nameEn: 'Korean', nameTh: 'ภาษาเกาหลี' }
      ];
      const pick = languages[Math.floor(Math.random() * languages.length)];
      return {
        id: challengeId,
        type: 'MULTI_LANG_AUDIO',
        instructionEn: "Linguistic scanner: Play the synthetic voice and identify the target language spoken",
        instructionTh: "เครื่องแสกนตระกูลภาษาโลก: ฟังเสียงสังเคราะห์สัญญาณเสียงแล้วดูว่าเป็นกลุ่มภาษาสัญชาติใด",
        textDisplay: pick.text,
        textAnswer: pick.code,
        themeClass: 'from-indigo-900/60 to-slate-950 border-indigo-400'
      };
    }

    case 'RHYTHM_CAPTCHA': {
      const pattern = [1, 0, 1, 1]; // represent rhythm
      return {
        id: challengeId,
        type: 'RHYTHM_CAPTCHA',
        instructionEn: "Acoustic sequence repetition: Listen to the pulse rhythm, and repeat using the trigger clicker",
        instructionTh: "จงทำซ้ำเคาะจังหวะชีพจร: สดับฟังชุดเสียงเคาะสัญญาณแล้วกดปุ่มสะท้อนเลียนแบบตามจังหวะ",
        correctIndex: 4, // 4 taps to repeat
        themeClass: 'from-slate-900 to-fuchsia-950 border-fuchsia-500'
      };
    }

    case 'COLOR_AUDIO_MATCH': {
      const pitch = Math.random() > 0.5 ? 'HIGH' : 'LOW';
      return {
        id: challengeId,
        type: 'COLOR_AUDIO_MATCH',
        instructionEn: `Listen to pitch: Match high pitch to [Green] or low pitch to [Red] selector`,
        instructionTh: `จับคู่โทนเสียง: สัญญาณเสียงโทนสูงเลือกระบบสีเขียว โทนเสียงสังเคราะห์ต่ำเลือกสีแดง`,
        textAnswer: pitch,
        themeClass: 'from-slate-900 to-slate-950 border-rose-500'
      };
    }

    case 'MEMORY_AUDIO': {
      const audioSequence = ['⭐', '🔔', '🔥'];
      return {
        id: challengeId,
        type: 'MEMORY_AUDIO',
        instructionEn: "Listen once to the sound icons. Answer which came second in the sequence after fade.",
        instructionTh: "จดจำคลื่นเสียงสำคัญ: ฟังเสียงทั้งสามชิ้นแล้วเลือกว่าเสียงชิ้นที่ 2 ของลำดับข้างต้นคือข้อใด",
        textAnswer: '🔔',
        themeClass: 'from-slate-900 to-rose-950 border-rose-500'
      };
    }

    case 'VISUAL_GLITCH': {
      const original = 'TUKTUK';
      return {
        id: challengeId,
        type: 'VISUAL_GLITCH',
        instructionEn: "Scan glitch filter: Unscramble the vibrating text artifact shown below:",
        instructionTh: "ฟีดสัญญาณสั่นไหวสถิต: ถอดรหัสตัวหนังสือโบราณที่สั่นกระตุกถี่ๆ ขาดๆ เกินๆ ต่อไปนี้:",
        textDisplay: '𝔗 𝔘 𝔎 𝔗 𝔘 𝔎',
        textAnswer: original.toLowerCase(),
        themeClass: 'from-red-950/20 to-slate-950 border-red-500'
      };
    }

    // IMMORTAL TRICK LEVEL GENERATORS
    case 'SHUFFLING_GRID': {
      return {
        id: challengeId,
        type: 'SHUFFLING_GRID',
        instructionEn: "⚠️ SHUFFLING GRID MODE: Click all cats. (Targets rearrange instantly right before click!)",
        instructionTh: "⚠️ ตารางสับตําแหน่งฉุกเฉิน: จงเลือกแมวเหมียว (ช่องสัญญาณจะสลับตำแหน่งหนีตัวชี้เมาส์ของคุณ!)",
        items: makeGridItems('🐱', ['🐶', '🌲', '🚗'], 9, 3),
        themeClass: 'from-amber-955 to-slate-900 border-red-600 animate-pulse'
      };
    }

    case 'FAKE_LOADING': {
      return {
        id: challengeId,
        type: 'FAKE_LOADING',
        instructionEn: "⚠️ DECEPTIVE SYSTEM: Solve the loaded grid (Spinner may distract or mock your biological speed!)",
        instructionTh: "⚠️ ระบบจำลองความหน่วงลวงโลก: ลากสายตาผ่านตารางวิเคราะห์เพื่อระบุตำแหน่งไฟจราจร",
        items: makeGridItems('🚦', ['🚗', '🌲', '🚲'], 9, 3),
        themeClass: 'from-slate-900 to-pink-950 border-pink-500'
      };
    }

    case 'SLIDER_SPRING': {
      const initial = Math.floor(Math.random() * 20);
      const target = Math.floor(Math.random() * 30) + 50;
      return {
        id: challengeId,
        type: 'SLIDER_SPRING',
        instructionEn: "⚠️ SLIDER SPRING WARNING: Move slider to LOCK. (It snap-returns to zero randomly!)",
        instructionTh: "⚠️ คันโยกดีดกลับสปริงนรก: ลากประกบชิ้นส่วนฟันเฟือง (ระวังคันโยกดีดสปริงกลับไปจุดเริ่มต้น!)",
        sliderInitial: initial,
        sliderTarget: target,
        themeClass: 'from-orange-950 to-slate-950 border-orange-600 animate-bounce'
      };
    }

    case 'DRUNK_CURSOR': {
      return {
        id: challengeId,
        type: 'DRUNK_CURSOR',
        instructionEn: "⚠️ DRUNK CURSOR CALIBRATION: Select all classic traffic lights (Input wobbly)",
        instructionTh: "⚠️ เมาส์คนเมาเหล้าขาว: พยายามประคองสติลากไปกดเครื่องหมายไฟจราจรให้ตรงจุดห้ามหลุดซ้ายขวา",
        items: makeGridItems('🚦', ['🚗', '🌲', '🚲'], 9, 3),
        themeClass: 'from-emerald-950 to-amber-950 border-yellow-500'
      };
    }

    case 'DOUBLE_NEGATIVE': {
      return {
        id: challengeId,
        type: 'DOUBLE_NEGATIVE',
        instructionEn: "Select all blocks that are NOT not NOT not Dogs (Double negative matrix!)",
        instructionTh: "เลือกตารางช่องสัญญาณทั้งหมดที่ 'ไม่ใช่สิ่งที่ไม่ใช่สุนัขสี่ขาที่มีสายใยรัก'",
        items: makeGridItems('🐶', ['🐱', '🚘', '🚦'], 9, 3),
        themeClass: 'from-red-955 to-slate-950 border-red-500'
      };
    }

    case 'TIME_PARADOX': {
      return {
        id: challengeId,
        type: 'TIME_PARADOX',
        instructionEn: "⏳ PARADOX MODE: Select Cats (Wait, the question might mutate and shift instruction mid-answer!)",
        instructionTh: "⏳ ประตูเวลาหักล้างปรสิต: จงเลือกแมวเหมียวเท่านั้น (คำถามพร้อมกลายพันธุ์ฉับพลันทุกเมื่อ)",
        items: makeGridItems('🐱', ['🐶', '🌲', '🚗'], 9, 3),
        themeClass: 'from-sky-950 to-pink-950 border-yellow-500'
      };
    }

    case 'TROLL_CAPTCHA': {
      return {
        id: challengeId,
        type: 'TROLL_CAPTCHA',
        instructionEn: "Select the single square containing the meaning of life (Whatever you choose is wrong!)",
        instructionTh: "กรุณาคลิกเลือกตรรกะสูงสุดที่มีความหมายของชีวิตนิรันดร์แฝงอยู่",
        items: [
          { id: 't1', icon: '💰 Money Stack', isTarget: false, isSelected: false },
          { id: 't2', icon: '💻 AI Overlord', isTarget: false, isSelected: false },
          { id: 't3', icon: '🐱 Adorable Cat', isTarget: true, isSelected: false },
          { id: 't4', icon: '🛌 Sleeping 12hrs', isTarget: false, isSelected: false },
        ],
        themeClass: 'from-purple-950 to-rose-950 border-purple-500 font-bold'
      };
    }

    case 'MICRO_PIXEL': {
      const initial = Math.floor(Math.random() * 20);
      const target = 72; // constant target
      return {
        id: challengeId,
        type: 'MICRO_PIXEL',
        instructionEn: "🔎 MICRO PIXEL: Slide to lock. Target is exactly 1 pixel width wide!",
        instructionTh: "🔎 แว่นขยายความละเอียดคาร์บอน: ลากคันโยกเพื่อให้ฟันเฟืองระนาบล็อกตรงความกว้าง 1 พิกเซลพอดี",
        sliderInitial: initial,
        sliderTarget: target,
        themeClass: 'from-slate-950 to-zinc-950 border-zinc-700'
      };
    }

    case 'SCHRODINGER': {
      return {
        id: challengeId,
        type: 'SCHRODINGER',
        instructionEn: "🐈 SCHRÖDINGER PARADOX: Select the box containing both a dead and alive feline.",
        instructionTh: "🐈 ทฤษฎีกล่องปิดแมวของชโรดิงเจอร์: คาดคะเนกล่องที่มีสถานะซ้อนทับทั้งตายและอยู่รอดร่วมกัน",
        items: [
          { id: 's1', icon: '📦 [Box A]', isTarget: true, isSelected: false },
          { id: 's2', icon: '📦 [Box B]', isTarget: true, isSelected: false },
        ],
        themeClass: 'from-slate-900 to-indigo-950 border-orange-500'
      };
    }

    case 'CHAOS_CAPTCHA': {
      return {
        id: challengeId,
        type: 'CHAOS_CAPTCHA',
        instructionEn: "🌪️ CHAOS HYBRID ENGINE: Combines multiple signals. Type the glitched text answer: 'CHAOS'",
        instructionTh: "🌪️ มหาวินาศไฮบริดพายุ: ถอดรหัสข้อความกวนประสาทที่ปรากฏตรงหน้า พิมพ์คำว่า: 'CHAOS'",
        textDisplay: 'C H A O S',
        textAnswer: 'chaos',
        themeClass: 'from-red-950 to-pink-950 border-red-500 animate-pulse'
      };
    }

    // DEVICE EXCLUSIVE CAPTCHAS
    case 'MOBILE_TILT': {
      return {
        id: challengeId,
        type: 'MOBILE_TILT',
        instructionEn: "Tilt Calibration: Tilt your device to align the green orb into the lock notch!",
        instructionTh: "ทดสอบไจโรกระดิก: เอียงเครื่องของคุณเพื่อบังคับลูกบอลสีเขียวให้จอดตรงช่องล็อกพอดี",
        sliderInitial: 10,
        sliderTarget: 80,
        themeClass: 'from-emerald-950 to-blue-950 border-emerald-500 shadow-lg'
      };
    }

    case 'SHAKE_CAPTCHA': {
      return {
        id: challengeId,
        type: 'SHAKE_CAPTCHA',
        instructionEn: "Static Disruption: Shake your device rapidly to reveal the hidden passcode numbers!",
        instructionTh: "เซ็นเซอร์วัดพลังสั่นสะเทือน: จงเขย่าอุปกรณ์เพื่อสลัดเศษจุดมัวสัวพิกเซลความถอดรหัส",
        sliderInitial: 0,
        sliderTarget: 100,
        themeClass: 'from-orange-950 to-zinc-900 border-orange-500 shadow-md animate-pulse'
      };
    }

    case 'GYROSCOPE_CAPTCHA': {
      return {
        id: challengeId,
        type: 'GYROSCOPE_CAPTCHA',
        instructionEn: "Panoramic Sentry: Move/rotate your device to scan the 3D grid and find the hidden target coordinate!",
        instructionTh: "หมุนสแกนมุมกล้อง 3D: เอียงหันกล้องค้นหาจุดซ่อนพิกัดลอยพาดผ่านห่วงมิติ",
        sliderInitial: 30,
        sliderTarget: 75,
        themeClass: 'from-sky-950 to-indigo-950 border-sky-400'
      };
    }

    case 'MULTI_TOUCH_CAPTCHA': {
      return {
        id: challengeId,
        type: 'MULTI_TOUCH_CAPTCHA',
        instructionEn: "Biometric Touch signature: Tap and hold 3 touch target dots simultaneously!",
        instructionTh: "พิมพ์ลายนิ้วสัมผัสคอสมิก: แตะจับจองจุดเป้ารับเวกเตอร์ชีวะพร้อมกันทั้งหมด 3 นิ้ว",
        items: [
          { id: 'mt1', icon: '🔴 Core A', isTarget: true, isSelected: false },
          { id: 'mt2', icon: '🔴 Core B', isTarget: true, isSelected: false },
          { id: 'mt3', icon: '🔴 Core C', isTarget: true, isSelected: false }
        ],
        themeClass: 'from-red-950 to-fuchsia-950 border-fuchsia-500'
      };
    }

    case 'STYLUS_TRACE': {
      return {
        id: challengeId,
        type: 'STYLUS_TRACE',
        instructionEn: "Vector Trace Tool: Draw a continuous trace line accurately following the spiral spline outline!",
        instructionTh: "วาดเส้นแม่นยำปากกา: ใช้สมาร์ทสไตลัส/นิ้ว ลากประกบรอยขีดมิติตามโครงเกลียวหมุน",
        sliderInitial: 0,
        sliderTarget: 100,
        themeClass: 'from-amber-950 to-yellow-950 border-yellow-500'
      };
    }

    case 'PRESSURE_CAPTCHA': {
      return {
        id: challengeId,
        type: 'PRESSURE_CAPTCHA',
        instructionEn: "Pressure Sensor calibration: Apply appropriate physical stress level (Match the target 75% bar!)",
        instructionTh: "ทดสอบแรงกดเซ็นเซอร์: กดน้ำหนักนิ้วหรือสไตลัสอย่างประณีตเพื่อให้เกจหยุดที่ระยะ 75%",
        sliderInitial: 5,
        sliderTarget: 75,
        themeClass: 'from-violet-950 to-zinc-950 border-violet-500'
      };
    }

    case 'KEYBOARD_SPEED': {
      return {
        id: challengeId,
        type: 'KEYBOARD_SPEED',
        instructionEn: "Typing Overlord: Type 'SUPERHUMAN' with lightning speed to override security blocks!",
        instructionTh: "ประจัญสายคีย์บอร์ดเร่งความเร็ว: พิมพ์คำว่า 'SUPERHUMAN' อย่างว่องไวเพื่อปิดขั้วไฟสะพานสัญญาณ",
        textDisplay: 'S U P E R H U M A N',
        textAnswer: 'superhuman',
        themeClass: 'from-cyan-950 to-slate-900 border-cyan-500 font-mono tracking-widest'
      };
    }

    case 'MOUSE_ACCURACY': {
      return {
        id: challengeId,
        type: 'MOUSE_ACCURACY',
        instructionEn: "Precision targeting: Select and click the moving microscopic coordinates!",
        instructionTh: "สไนเปอร์พิกเซลย่อย: จงยิงเล็งสับสเตนซิลจุดวงกลมสีชาดให้แม่นยำระดับพิกเซลเวียน",
        items: [
          { id: 'ma1', icon: '🎯 Spot O', isTarget: true, isSelected: false },
          { id: 'ma2', icon: '🕳️ Blackhole', isTarget: false, isSelected: false }
        ],
        themeClass: 'from-emerald-950 to-zinc-950 border-emerald-500'
      };
    }

    case 'DRAG_DROP_CAPTCHA': {
      return {
        id: challengeId,
        type: 'DRAG_DROP_CAPTCHA',
        instructionEn: "Direct Link Setup: Drag the source battery and slide/drop it onto the target grid dock!",
        instructionTh: "สะพานเชื่อมพลังงานประจุบวก: ลากก้อนแบตเตอรี่มาคลิกวางสวมทับเต้ารับให้ลงล็อกพิกัด",
        sliderInitial: 10,
        sliderTarget: 90,
        themeClass: 'from-blue-950 to-indigo-950 border-blue-400'
      };
    }

    default: {
      return {
        id: challengeId,
        type: 'IMAGE_SELECT',
        instructionEn: "Select all Traffic Lights",
        instructionTh: "กรุณาเลือกตารางที่เป็นป้ายไฟจราจร",
        items: makeGridItems('🚦', ['🚗', '🌲', '🚲'], 9, 3),
        themeClass: 'from-slate-900 to-emerald-950 border-emerald-500'
      };
    }
  }
}

export function generateMatchChallenges(difficulty: Difficulty, country = 'TH', deviceType: 'DESKTOP' | 'TABLET' | 'MOBILE' = 'DESKTOP'): CaptchaChallenge[] {
  let listTypes: CaptchaType[] = [];

  if (difficulty === 'EASY') {
    listTypes = ['IMAGE_SELECT', 'DISTORTED_TEXT', 'SLIDER', 'EMOJI', 'SHAPE', 'MEMORY', 'PUG_OR_MUFFIN', 'HIDDEN_OBJECT', 'ALMOST_IDENTICAL', 'WHAT_NOT_BELONG'];
    // Inject mobile/tablet/desktop options
    if (deviceType === 'MOBILE') {
      listTypes.push('MOBILE_TILT', 'SHAKE_CAPTCHA');
    } else if (deviceType === 'TABLET') {
      listTypes.push('STYLUS_TRACE');
    } else {
      listTypes.push('DRAG_DROP_CAPTCHA');
    }
  } else if (difficulty === 'HARD') {
    listTypes = ['DISTORTED_TEXT', 'EMOJI', 'SHAPE', 'MEMORY', 'SEQUENCE', 'REVERSE_LOGIC', 'LOGIC', 'AI_OR_HUMAN', 'CHAOS_GRID', 'MEME_DETECTOR', 'HUMAN_EMOTION', 'DUAL_SLIDER', 'ROTATING_TEXT'];
    if (deviceType === 'MOBILE') {
      listTypes.push('MOBILE_TILT', 'SHAKE_CAPTCHA', 'MULTI_TOUCH_CAPTCHA');
    } else if (deviceType === 'TABLET') {
      listTypes.push('STYLUS_TRACE', 'PRESSURE_CAPTCHA');
    } else {
      listTypes.push('KEYBOARD_SPEED', 'MOUSE_ACCURACY', 'DRAG_DROP_CAPTCHA');
    }
  } else {
    // INSANE
    listTypes = ['DISTORTED_TEXT', 'MEMORY', 'REVERSE_LOGIC', 'REACTION', 'LOGIC', 'SEQUENCE', 'AI_OR_HUMAN', 'CHAOS_GRID', 'WIND_PHYSICS', 'ICE_MODE', 'ROTATING_TEXT', 'AUDIO_NOISE', 'REVERSED_AUDIO', 'DISTORTED_MATH', 'MULTI_LANG_AUDIO', 'VISUAL_GLITCH'];
    if (deviceType === 'MOBILE') {
      listTypes.push('MOBILE_TILT', 'SHAKE_CAPTCHA', 'MULTI_TOUCH_CAPTCHA');
    } else if (deviceType === 'TABLET') {
      listTypes.push('STYLUS_TRACE', 'PRESSURE_CAPTCHA');
    } else {
      listTypes.push('KEYBOARD_SPEED', 'MOUSE_ACCURACY');
    }
  }

  const chosenTypes = shuffleArray(listTypes).slice(0, 5);
  const challenges = chosenTypes.map(type => {
    const roll = Math.random();
    const canBeImpossible = (difficulty === 'INSANE' && roll < 0.25) || (difficulty === 'HARD' && roll < 0.08);
    return generateChallenge(type, canBeImpossible, country);
  });

  return challenges;
}

/**
 * Compiles a seamless, endless sequence of tricks specifically of the Immortal survival pool
 */
export function generateImmortalSequence(count: number, country = 'TH', deviceType: 'DESKTOP' | 'TABLET' | 'MOBILE' = 'DESKTOP'): CaptchaChallenge[] {
  let immortalPool: CaptchaType[] = [];

  if (deviceType === 'MOBILE') {
    // Mobile Immortal: Reaction Hell, Rapid Tap, Shake, Tilt
    immortalPool = [
      'MOBILE_TILT',
      'SHAKE_CAPTCHA',
      'REACTION',
      'CHAOS_CAPTCHA',
      'WHAT_NOT_BELONG',
      'AI_OR_HUMAN',
      'PUG_OR_MUFFIN',
      'SHUFFLING_GRID',
      'FAKE_LOADING',
      'SLIDER_SPRING',
      'DOUBLE_NEGATIVE'
    ];
  } else if (deviceType === 'TABLET') {
    // Tablet Immortal: Gesture Hell, Stylus Precision, Rotation Challenges
    immortalPool = [
      'STYLUS_TRACE',
      'PRESSURE_CAPTCHA',
      'ROTATING_TEXT',
      'DUAL_SLIDER',
      'SLIDER_SPRING',
      'SHUFFLING_GRID',
      'FAKE_LOADING',
      'SCHRODINGER',
      'WIND_PHYSICS'
    ];
  } else {
    // Desktop Immortal: Precision Hell, Pixel Hunting, Micro Targets, Complex Mouse Challenges
    immortalPool = [
      'MICRO_PIXEL',
      'DRUNK_CURSOR',
      'MOUSE_ACCURACY',
      'KEYBOARD_SPEED',
      'DRAG_DROP_CAPTCHA',
      'CHAOS_CAPTCHA',
      'SLIDER_SPRING',
      'SHUFFLING_GRID',
      'FAKE_LOADING',
      'TIME_PARADOX'
    ];
  }

  const shuf = shuffleArray(immortalPool);
  const result: CaptchaChallenge[] = [];
  for (let i = 0; i < count; i++) {
    const type = shuf[i % shuf.length];
    result.push(generateChallenge(type, Math.random() < 0.15, country));
  }
  return result;
}
