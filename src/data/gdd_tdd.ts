export interface DocSection {
  titleEn: string;
  titleTh: string;
  contentEn: string;
  contentTh: string;
}

export const gddTddSections: DocSection[] = [
  {
    titleEn: "1. Executive Summary & Gameplay Loop",
    titleTh: "1. สรุปภาพรวมโครงการ & วงจรการเล่นหลัก",
    contentEn: `### 1.1 Executive Summary
"Human Verified Arena" is a high-speed, casual competitive multiplayer game where CAPTCHA systems are turned into core gamified battle mechanics. Rather than serving as defensive security checkpoints, CAPTCHA tests represent a global trial system where human remnants compete against time and intense distortion to prove their human superiority over advanced AI entities. 

The game fuses the rhythmic velocity of **Fall Guys**, the intellectual panic of **Kahoot**, the clinical precision of **Human Benchmark**, and the sheer anxiety of **CAPTCHA Hell**. Every puzzle solved adds points to three distinct registers in parallel: the **Individual Player score**, the **National Country ranking**, and the **Global Humanity progress bar**.

### 1.2 The Core Gameplay Loop
1. **Lobby Launch**: The user registers a humanoid nickname, chooses a representative flag, and chooses a core game difficulty.
2. **Matchmaking Queue**: Orchestrator synchronizes up to 8 live or simulated peer players in a rapid Lobby.
3. **The Gauntlet Phase**: A fast-fire series of randomly compiled puzzle vectors (5 consecutive CAPTCHAs of varying styles: selection, text entry, reaction sliders, etc.) with intense time limits.
4. **Combo Escalation**: Each consecutive correct validation builds a multiplier gauge, speeding up ticker sounds but multiplying point rewards.
5. **Session Resolution**: Final calculations feed the player experience points (XP), award V-Credits currency, update the Country War database ratios, and hit the Rogue AI raid boss.

### 1.3 Mathematical Formulations
* **Base Challenge Reward Formula**:
  $$\\text{Reward} = \\text{BaseModePts} \\times \\text{ComboMultiplier} \\times \\left(1 + \\frac{\\text{TimeRemaining}}{\\text{TotalWindow}}\\right)$$
* **XP Required per Level**:
  $$\\text{XP}_{\\text{next}} = \\text{Level} \\times 500 \\times 1.25^{\\text{Level}-1}$$
* **Raid Boss CPU core Damage**:
  $$\\text{Damage} = \\text{BaseModePts} \\times \\text{AccuracyPercentage}$$`,
    contentTh: `### 1.1 บทนำและภาพรวมของเกม
"Human Verified Arena" คือเกมมัลติเพลเยอร์ต่อสู้ความไวแนวแคชชวล คอนเซ็ปต์ใหม่ที่เปลี่ยนระบบการกรอก "CAPTCHA" (ภาพป้อนยืนยันตัวตน) ให้กลายเป็นกลไกเกมหลัก! แทนที่จะเป็นระบบความปลอดภัยที่น่าเอ็นดู ระบบนี้คือเวทีประชันวิทยายุทธ์ความเร็วและความกล้าหาญที่มนุษยชาติที่ยังคงเหลือร่วมมือและแย่งชิงเพื่อพิสูจน์ตนเองเหนือ AI อัจฉริยะที่ครองโลก

ตัวเกมได้รับอิทธิพลจากความลนลานแบบจำกัดของ **Fall Guys**, ความตื่นเต้นและเสียงดนตรีเร้าใจของ **Kahoot**, การทดสอบระบบประสาทแบบหน้ากระจกรถชนของ **Human Benchmark** และระบบทดสอบข้อความปริศนากวนประสาทอย่าง **CAPTCHA Hell** ทุกคำตอบทำให้ผู้เล่นทำคะแนนส่งให้ตนเอง ประเทศบ้านเกิด และมวลมนุษยชาติพร้อมๆ กัน!

### 1.2 วงจรการเล่นหลัก (Core Loop)
1. **ตั้งฐานข้อมูลมนุษย์**: ผู้สวมรอยกรอกชื่อ รหัสประเทศ และเลือกความแรงความยากที่พร้อมปะทะ
2. **ซิงค์สเตจคิว**: ระบบแมตช์เมคกิ้งหาคู่ต่อสู้ 8 คน (หรือจำลองไลฟ์สตรีมหากเล่นทดสอบ) เข้าสู้สนามจับเวลา
3. **เผชิญความบ้าคลั่ง**: รับบททดสอบโจทย์ระบบที่ซอฟต์แวร์สุ่มให้เคลียร์ติดต่อกัน 5 ชุด (เช่น เลือกภาพ, ตีพิมพ์ข้อความโค้งงอ, สไลเดอร์ปรับมุม, หรือวิเคราะห์ภาพลวงตา)
4. **คอมโบทำลายล้าง**: มีระบบรักษาความต่อเนื่อง สะสมคอมโบเพื่อคูณแต้มและเหรียญรางวัลเป็นเท่าตัว ยิ่งคอมโบเยอะจังหวะดนตรีรอบตัวจะเร่งด่วนเพิ่มความระทึกใจ!
5. **กู้ชาติล้มบอส**: การเคลียร์สำเร็จทุกครั้งเป็นดาเมจจ้วงลด HP บอสใหญ่ "Rogue AI" ประจำศตวรรษ เพื่อลุ้นรับเกียรติยศ

### 1.3 สูตรคำนวณเบื้องหลังเกม
* **สูตรแต้มรางวัลพัซเซิล**:
  $$\\text{Reward} = \\text{BaseModePts} \\times \\text{ComboMultiplier} \\times \\left(1 + \\frac{\\text{TimeRemaining}}{\\text{TotalWindow}}\\right)$$
* **สูตรสะสม EXP เลเวลใหม่**:
  $$\\text{XP}_{\\text{next}} = \\text{Level} \\times 500 \\times 1.25^{\\text{Level}-1}$$
* **สูตรดาเมจโจมตี Raid บอส**:
  $$\\text{Damage} = \\text{BaseModePts} \\times \\text{AccuracyPercentage}$$`
  },
  {
    titleEn: "2. The CAPTCHA Difficulty Engine",
    titleTh: "2. คอนเซ็ปต์ความยากบ้าระห่ำ 3 ระดับ",
    contentEn: `### 2.1 Mode 1: Human Mode (Easy)
* **Tagline**: *"The system thinks you might be human."*
* **Response Window**: 10 to 15 seconds per individual test.
* **Point Yield**: 10 - 50 points base.
* **Target Categories**:
  * **Interactive Image Grid**: Classic CAPTCHA selector. Identifying clean targets (Traffic Lights, Cats, Bicycles, Cars, Hydrants).
  * **Basic Distorted Text**: Alphabetic codes with high-contrast background noise curves.
  * **Slider Fit**: Dragging a handle to place a puzzle notch.
  * **Emoji Hunt**: Spotting matching symbols.

### 2.2 Mode 2: Verified Mode (Hard)
* **Tagline**: *"Humans begin questioning their life choices."*
* **Response Window**: 5 to 8 seconds.
* **Point Yield**: 50 - 250 points base.
* **Target Categories**:
  * **Advanced Object Detection**: Overlapping elements, micro targets.
  * **Rotated/Warped Letters**: Curved, flipped, and broken character symbols.
  * **Memory Retain**: Remembering a complex array of colored shapes, then answering a related question after visual occlusion.
  * **Sequence Clicking**: Interactive nodes that must be selected in exact sequential order.

### 2.3 Mode 3: God of Humanity Mode (Insane)
* **Tagline**: *"Even humans are no longer sure they are human."*
* **Response Window**: 2 to 5 seconds. Extremely demanding on physical coordination.
* **Point Yield**: 250 - 5000 points base.
* **Target Categories**:
  * **Nightmare Noise**: Multilayered text masked in visual visual static, optical illusions and ambiguous AI distortions.
  * **Reverse Logic Decisions**: Prompt instructs you to DO THE REVERSE (e.g., "Select everything that is NOT a vehicle or a feline").
  * **Human Intuition Dilemmas**: Subjective questions where correctness is judged by whichever answer has the community majority vote (e.g. "Which cloud feels more expensive?", "Which shadow looks happiest?").
  * **Reaction Flash**: Instantaneous popup that expects physical click sub-700ms.`,
    contentTh: `### 2.1 ระดับที่ 1: โหมดมนุษย์เดินดิน (Easy)
* **นิยาม**: *"ระบบวิเคราะห์ว่าคุณน่าจะเป็นสิ่งมีชีวิตมีกระดูกสันหลังนะ"*
* **เวลาจำกัด**: ข้อละ 10 ถึง 15 วินาที
* **อัตราแต้ม**: 10 ถึง 50 คะแนน
* **โจทย์ที่พบ**:
  * **แผ่นภาพตารางแบบคลิก**: มองหาป้ายจราจร, แมว, จักรยาน, รถบัส, สุนัขตามธรรมดาโลก
  * **ตัวอักษรโค้งงอทั่วไป**: ตัวหนังสือสั้นๆ บิดเบี้ยวเล็กน้อยกับเส้นรบกวนบางเบา
  * **เลื่อนสไลเดอร์**: เลื่อนเศษกระจกปริศนาให้ลงล็อกพอดี
  * **จับคู่อีโมจิ**: ค้นหาระเบิดหรือแมวท่ามกลางกองขยะสัญลักษณ์

### 2.2 ระดับที่ 2: โหมดมนุษย์กลายพันธุ์ (Hard)
* **นิยาม**: *"มนุษย์เริ่มตั้งคำถามกับการกระทำของตนเอง"*
* **เวลาจำกัด**: ข้อละ 5 ถึง 8 วินาที (สั่นประสาทพอดู!)
* **อัตราแต้ม**: 50 ถึง 250 คะแนน
* **โจทย์ที่พบ**:
  * **ภาพเคลื่อนไหว**: แผ่นเป้าหมายมีการขยับหรือหมุนอย่างต่อเนื่อง
  * **อักษรกลับหัวและแตกหัก**: อักษรบิดเบี้ยวสามมิติ ผสมความแตกหักของตัวพิมพ์
  * **ความจำระยะสั้น**: ระบบแสดงบล็อกสีกระพริบ 2 วินาที ก่อนปิดตา แล้วถามว่า "มีจุดสีน้ำเงินกี่จุด?"
  * **ปุ่มกดลำดับขั้น**: ต้องคลิกสอยปุ่มรันเลข 1-5 ให้ทันในเวลาที่กำหนด

### 2.3 ระดับที่ 3: โหมดเวทย์มนุษย์พระเจ้าสร้าง (Insane)
* **นิยาม**: *"แม้แต่สมองกลของบอสก็สับสนว่าคุณเป็นตัวอะไร"*
* **เวลาจำกัด**: ข้อละ 2 ถึง 5 วินาที! พลาดแค่การหายใจเดียวคือแพ้!
* **อัตราแต้ม**: 250 ถึง 5000 คะแนน
* **โจทย์ที่พบ**:
  * **ภาพลวงตา / AI แปลกประหลาด**: ภาพวาดไร้รูปทรงสับสนที่กระพริบถี่ยิบ
  * **ระบบตรรกะผกผัน (Reverse Logic)**: คำสั่งแนวประชดประชัน เช่น "เลือกภาพทุกแผ่นที่ไม่ได้เป็นยานพาหนะและห้ามกดยกเว้นป้ายจราจร"
  * **แบบสอบถามจิตวิญญาณมนุษย์**: ปริศนาที่ "ไม่มีคำตอบที่ถูกแน่นอน" แต่ระบบจะตัดสินคะแนนตาม "เสียงโหวตส่วนใหญ่ของสังคมโลก" (เช่น "ก้อนเมฆกลุ่มไหนดูแล้วรู้สึกรวยกว่ากัน?", "หน้าคนไหนมีแนวโน้มจะยืมเงินแล้วไม่คืน?")
  * **รีแอ็กชันฉับพลัน**: หน้าต่างแตะเป้าหมายที่โผล่มาแวบเดียว ต้องใช้เวลาการกดต่ำกว่า 0.7 วินาที`
  },
  {
    titleEn: "3. Systems Architecture & TDD Requirements",
    titleTh: "3. สถาปัตยกรรมระบบ & ข้อมูลทางเทคนิค (TDD)",
    contentEn: `### 3.1 Relational Database Schema
To support high scalability, we utilize standard PostgreSQL schemas configured via relational ORMs:

\`\`\`sql
-- Users and Rank tracking
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(40) UNIQUE NOT NULL,
  country_code VARCHAR(3) NOT NULL,
  v_credits INT DEFAULT 1000 NOT NULL,
  rank_lvl INT DEFAULT 1 NOT NULL,
  xp_points INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Global score boards
CREATE TABLE country_stats (
  country_code VARCHAR(3) PRIMARY KEY,
  human_score BIGINT DEFAULT 0 NOT NULL,
  total_attempts INT DEFAULT 0 NOT NULL,
  success_rate FLOAT DEFAULT 1.0 NOT NULL
);

-- Guild Verification Agencies
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  tag VARCHAR(6) NOT NULL,
  owner_id UUID REFERENCES users(id),
  motto VARCHAR(255),
  agency_score BIGINT DEFAULT 0 NOT NULL
);
\`\`\`

### 3.2 Real-time Infrastructure & WebSockets
To handle extreme concurrent spikes (10,000 to 100,000 live users), we use an event-driven framework:
1. **Frontend Applet**: Custom React Client with dynamic frame throttle, optimized for light element counts.
2. **WebSocket Gateway**: Built on Node.js/Socket.io utilizing a distributed Redis adapter for session stickiness.
3. **Database Caching**: Write-heavy country war increments are pooled in Redis hashes and committed to PostgreSQL in bulk offsets every 5 seconds, rather than single transactional writes!
4. **Stateless Scale-to-Zero Node**: Microservices deployed to managed Google Cloud Run endpoints.`,
    contentTh: `### 3.1 โครงสร้างฐานข้อมูลเชิงสัมพันธ์ (Database Schema)
เพื่อความเร็วสูงสุดในการสเกลฐานข้อมูล เราเลือกใช้ระบบโครงสร้างแบบแยกตารางดังนี้:

\`\`\`sql
-- ตารางผู้ใช้งานมนุษย์
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(40) UNIQUE NOT NULL,
  country_code VARCHAR(3) NOT NULL,
  v_credits INT DEFAULT 1000 NOT NULL,
  rank_lvl INT DEFAULT 1 NOT NULL,
  xp_points INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ตารางสถิติสงครามระดับประเทศ
CREATE TABLE country_stats (
  country_code VARCHAR(3) PRIMARY KEY,
  human_score BIGINT DEFAULT 0 NOT NULL,
  total_attempts INT DEFAULT 0 NOT NULL,
  success_rate FLOAT DEFAULT 1.0 NOT NULL
);

-- ตารางสมาคมสมาพันธ์ต่อต้านบอท (Guild)
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  tag VARCHAR(6) NOT NULL,
  owner_id UUID REFERENCES users(id),
  motto VARCHAR(255),
  agency_score BIGINT DEFAULT 0 NOT NULL
);
\`\`\`

### 3.2 เครือข่ายการส่งข้อมูลแบบเรียลไทม์ (Real-time Integration)
การประมวลผลสำหรับผู้ใช้งานร่วมกันในระดับแสนรายต่อวันใช้สถาปัตยกรรมระเหยน้ำแบบ Event-driven:
1. **Vite React UI**: เขียนอ้างอิงสถานะภายใน คลุมระบบเรนเดอร์เบาบางเพื่อไม่เป็นภาระของอุปกรณ์พกพา
2. **WebSocket Gateway**: นำทางด้วย Node.js และ Socket.io ต่อท่อส่งข้อมูลคู่ขนานไปยันหน่วยความจำสำรอง
3. **ระบบแคชข้อมูลความไวสูง**: เนื่องจากคะแนนสงครามโลกเกิดการอัพเดทแทบจะทุกๆ มิลลิวินาที เราใช้ Redis Hashes รองรับการสอยการกดอย่างไม่เป็นลายลักษณ์อักษรก่อน ก่อนที่จะทำ Batch Sync รวบยอดทุกลง SQL หลัก ทุกๆ 5 วินาทีเพื่อป้องกันเซิร์ฟเวอร์ฐานข้อมูลพังพินาศ!
4. **ความสามารถ Scale-to-Zero**: เซิร์ฟหลักถูกแพกเกจรวมคอนเทนเนอร์และใช้ Cloud Run ปรับกำลังการทำงานอัตโนมัติ`
  },
  {
    titleEn: "4. Verification Shop & Monetization Philosophy",
    titleTh: "4. นโยบายการหารายได้ & ระบบร้านค้าไอเดนชีวภาพ",
    contentEn: `### 4.1 Cosmetic-Only Monetization
To guarantee absolutely respect for player capability, there is zero pay-to-win mechanism. Real-money microtransactions are routed exclusively to non-functional aesthetic alterations:
* **Themed Verification UI**: Change standard green checkmarks to Glowing Neon, Gothic Decay, Retro CRT, or Golden Glitter textures.
* **National Border Badges**: Frame the player avatar with country banners or animated lasers representing guild participation.
* **Identity Titles**: Custom tags displayed on Global Chat and arena matchup grids (e.g. "Doubtful Organism", "Certified Biocortex").
* **Audio Synthesizer Skins**: Alternate beat sequences and synth configurations that accompany intense gameplay combos.

### 4.2 Cheat-Prevention Engine
1. **Dynamic Canvas Capture**: Checkmark shapes are verified via pixel coordinate offsets before submitting to check if slider operations are completed using linear mathematical jumps (indicative of automation macros).
2. **Biometric Interaction Jitter**: Analyzing tap and hover drag jitter curves. Complete mathematical perfection is interpreted as bot automation, resulting in immediate redirection to an endless God of Humanity Mode.`,
    contentTh: `### 4.1 นโยบายการเก็บรายได้ไม่เอาเปรียบฝีมือ (Cosmetics-Only)
ตัวเกมปฏิเสธระบบเทพทรู (Pay-to-Win) เพื่อพิสูจน์ฝีมือที่แท้จริงของผู้เล่นมนุษย์ การจ่ายเงินจริงจะใช้แลกซื้อสิ่งของไร้ความได้เปรียบทางโหมดเล่นเท่านั้น:
* **สกินกรอบหน้าต่างยืนยัน**: เปลี่ยนช่องเช็ดสีเขียวปกติให้เป็น นีออนคลั่ง, โกธิคมืดมน, หน้าจอคอมสีโบราณ (CRT), หรือเกล็ดทองคำแผ่รังสี
* **ขอบป้ายชื่อผู้เล่นพรีเมียม**: เพิ่มฉากก้นหอยสีธงชาติ, หรือเลเซอร์สะท้อนสมาคมหน่วยสืบสวนบอท
* **ยศตลกร้ายท้ายชื่อ**: แถบป้ายข้อความกวนๆ ทั่วไลฟ์แชท เช่น "ตัวสั่นสั่นเหมือนบอท", "มีคลื่นชีวภาพแท้"
* **เปลี่ยนซาวด์เอฟเฟกต์ซินธ์**: ดนตรีประกอบรอบการเล่นพิเศษที่คุณกำหนดคัสตอมได้เอง

### 4.2 สรุประบบเกราะต้านบอทโกงพัซเซิล (Anti-Cheat)
1. **สุ่มพิกัดลวงล่อ**: พ็อปอัปสุ่มให้เลื่อนตำแหน่งภาพจะไม่มีค่าคงที่ มีการหมุนพารามิเตอร์ทิศและบิดภาพพิกเซลในฝั่งเซิร์ฟเวอร์
2. **ตรวจจับการกดลากแบบเส้นตรง (Jitter Analysis)**: บอทหรือสคริปต์กรอกฟรอนต์มักเลื่อนเมาส์จุด A ไป B ด้วยระยะเวลาลอยตัวสั้นและการเชื่อมต่อเป็นเส้นตรงเป๊ะ มนุษย์มักมีคลื่นสะท้านเบาๆ และเว้นจังหวะตอบสนอง หากพบการกระทำไร้การสั่นไหว ระบบจะโยนผู้เล่นรายนั้นเข้าคุกโหมดยืนยันระดับพระเจ้าชั่วนิรันดร์`
  }
];
