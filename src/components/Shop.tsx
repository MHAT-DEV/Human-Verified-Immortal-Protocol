import { useState } from 'react';
import { PlayerProfile } from '../types';
import { Language } from '../i18n';
import { Award, ShoppingBag, ShieldCheck, Ticket, CircleUser, ShoppingCart } from 'lucide-react';

interface ShopProps {
  profile: PlayerProfile;
  updateProfile: (updated: Partial<PlayerProfile>) => void;
  language: Language;
}

export default function Shop({ profile, updateProfile, language }: ShopProps) {
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const titles = [
    { id: 'title_doubtful', label: 'Doubtful Organism', th: 'สิ่งมีชีวิตสั่นคลอน', price: 200 },
    { id: 'title_certified', label: 'Certified Biocortex', th: 'คอร์เท็กซ์ชีวภาพแท้', price: 600 },
    { id: 'title_speedster', label: '0.1s Retinal Blink', th: 'พริบตามนุษย์วาร์ป 0.1s', price: 1000 },
    { id: 'title_overlord', label: 'V-Arena Legend', th: 'ตำนานผู้พิชิตเวทีโลก', price: 2500 }
  ];

  const badges = [
    { id: 'badge_neon', label: 'Laser Neon Tube', th: 'กรอบไฟนีออนทูป', price: 400, color: 'border-cyan-400 bg-cyan-950/20' },
    { id: 'badge_gothic', label: 'Gothic Decay', th: 'ความเน่าสลายโกธิค', price: 800, color: 'border-purple-600 bg-purple-950/20' },
    { id: 'badge_glitter', label: 'Gold Medal Core', th: 'เหรียญวิทยาดุษฎีทองคำ', price: 1500, color: 'border-yellow-400 bg-yellow-950/20 shadow-[0_0_10px_rgba(250,204,21,0.4)]' }
  ];

  const checkmarks = [
    { id: 'theme_purple', label: 'Sizzling Hot Violet', th: 'พ็อปอัปสีม่วงเข้ม', price: 500, styleClass: 'text-purple-400 border-purple-500 bg-purple-950/20' },
    { id: 'theme_crt', label: 'Retro CRT Green', th: 'กรีนจอดำฉากวิชาการ', price: 1000, styleClass: 'text-emerald-500 border-emerald-600 bg-black' },
    { id: 'theme_cyber', label: 'Cyber Punk Outbreak', th: 'ไซเบอร์พังก์สวรรค์ล่ม', price: 2000, styleClass: 'text-rose-500 border-rose-500 bg-rose-950/20' }
  ];

  const handleBuyTitle = (titleLabel: string, price: number) => {
    if (profile.vCredits < price) {
      setPurchaseError(language === 'en' ? 'Insufficient V-Credits credentials!' : 'เครดิตยืนยันตัวตนของคุณไม่เพียงพอ!');
      setTimeout(() => setPurchaseError(null), 3000);
      return;
    }
    const alreadyOwns = profile.purchasedBadges.includes(titleLabel);
    if (alreadyOwns) {
      updateProfile({
        vCredits: profile.vCredits,
        activeBadge: titleLabel
      });
      return;
    }

    updateProfile({
      vCredits: profile.vCredits - price,
      purchasedBadges: [...profile.purchasedBadges, titleLabel],
      activeBadge: titleLabel
    });
  };

  const handleBuyTheme = (themeId: string, price: number) => {
    if (profile.vCredits < price) {
      setPurchaseError(language === 'en' ? 'Insufficient V-Credits credentials!' : 'เครดิตยืนยันตัวตนของคุณไม่เพียงพอ!');
      setTimeout(() => setPurchaseError(null), 3000);
      return;
    }
    const alreadyOwns = profile.purchasedThemes.includes(themeId);
    if (alreadyOwns) {
      updateProfile({
        activeTheme: themeId
      });
      return;
    }

    updateProfile({
      vCredits: profile.vCredits - price,
      purchasedThemes: [...profile.purchasedThemes, themeId],
      activeTheme: themeId
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8" id="shop-root-container">
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6" id="shop-masthead">
        <div className="space-y-1">
          <h2 className="text-2xl font-mono font-black text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-400" />
            {language === 'en' ? 'IDENTITY CREDENTIALS BOUNTY' : 'ร้านวิทยฐานะมนุษย์'}
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
            {language === 'en' 
              ? 'Differentiate your biological presence from robotic script clones. Licensing cosmetics incurs zero in-game advantage.'
              : 'สร้างความต่างด้านคลื่นชีวภาพของคุณจากระบบหุ่นยนต์ภายนอก สกินทั้งหมดใช้เพื่อความระทึกใจและโอ้อวดเท่านั้น'}
          </p>
        </div>

        {/* Currency ticker */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 px-5 py-3 rounded-xl flex items-center gap-3 shadow-inner" id="shop-wallet-ticker">
          <Ticket className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              {language === 'en' ? 'AVAILABLE CREDITS' : 'เครดิตในครอบครอง'}
            </div>
            <div className="text-xl font-mono font-bold text-slate-100">
              {profile.vCredits.toLocaleString()} V-Credits
            </div>
          </div>
        </div>
      </div>

      {purchaseError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center text-sm font-semibold animate-bounce" id="shop-error-alert">
          {purchaseError}
        </div>
      )}

      {/* Grid segments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="shop-item-columns">
        {/* TITLES */}
        <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4" id="shop-segment-titles">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
            <Award className="w-4 h-4 text-emerald-400" />
            {language === 'en' ? '1. Human Titles' : '1. ฉายามนุษย์กบฏ'}
          </h3>

          <div className="space-y-3">
            {titles.map((t) => {
              const owns = profile.purchasedBadges.includes(t.label);
              const active = profile.activeBadge === t.label;

              return (
                <div key={t.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 flex flex-col justify-between" id={`shop-title-card-${t.id}`}>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{language === 'en' ? t.label : t.th}</h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {owns ? (language === 'en' ? 'OWNED' : 'ซื้อแล้ว') : `${t.price} V-Credits`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyTitle(t.label, t.price)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : owns
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    id={`shop-btn-title-${t.id}`}
                  >
                    {active ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'AUTHORIZED' : 'สวมร่างแล้ว'}</span>
                      </>
                    ) : owns ? (
                      <span>{language === 'en' ? 'EQUIP' : 'เปิดใช้งาน'}</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'LICENSE' : 'เปิดรหัสวิชาชีพ'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BORDER BADGES */}
        <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4" id="shop-segment-badges">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
            <CircleUser className="w-4 h-4 text-emerald-400" />
            {language === 'en' ? '2. Biometric Borders' : '2. ขอบสยบหุ่นยนต์'}
          </h3>

          <div className="space-y-3">
            {badges.map((b) => {
              const owns = profile.purchasedBadges.includes(b.label);
              const active = profile.activeBadge === b.label;

              return (
                <div key={b.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 flex flex-col justify-between" id={`shop-badge-card-${b.id}`}>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${b.color}`} />
                      {language === 'en' ? b.label : b.th}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {owns ? (language === 'en' ? 'OWNED' : 'ซื้อแล้ว') : `${b.price} V-Credits`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyTitle(b.label, b.price)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : owns
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    id={`shop-btn-badge-${b.id}`}
                  >
                    {active ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'AUTHORIZED' : 'สวมร่างแล้ว'}</span>
                      </>
                    ) : owns ? (
                      <span>{language === 'en' ? 'EQUIP' : 'เปิดใช้งาน'}</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'LICENSE' : 'เปิดรหัสวิชาชีพ'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* UI CHECKMARK THEMES */}
        <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4" id="shop-segment-themes">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {language === 'en' ? '3. Verification Themes' : '3. สกินช่องเช็คแคปชา'}
          </h3>

          <div className="space-y-3">
            {checkmarks.map((tm) => {
              const owns = profile.purchasedThemes.includes(tm.id);
              const active = profile.activeTheme === tm.id;

              return (
                <div key={tm.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 flex flex-col justify-between" id={`shop-theme-card-${tm.id}`}>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[10px] ${tm.styleClass}`} >✓</span>
                      {language === 'en' ? tm.label : tm.th}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {owns ? (language === 'en' ? 'OWNED' : 'ซื้อแล้ว') : `${tm.price} V-Credits`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyTheme(tm.id, tm.price)}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : owns
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    id={`shop-btn-theme-${tm.id}`}
                  >
                    {active ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'ACTIVE' : 'ใช้งานอยู่'}</span>
                      </>
                    ) : owns ? (
                      <span>{language === 'en' ? 'EQUIP' : 'เปิดใช้งาน'}</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'LICENSE' : 'เปิดรหัสวิชาชีพ'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
