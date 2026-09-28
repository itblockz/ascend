// All site copy, Thai + English. Sourced from the v1 site and the ASCEND
// IA / Mood & Tone brief. Edit wording here; components only render it.
import type { Bi } from './i18n/LangContext'

const b = (th: string, en: string): Bi => ({ th, en })

export const NAV = [
  { id: 'pillars', label: b('เสาหลัก', 'Pillars') },
  { id: 'impact', label: b('ผลงาน', 'Impact') },
  { id: 'platforms', label: b('แพลตฟอร์ม', 'Platforms') },
  { id: 'technology', label: b('เทคโนโลยี', 'Technology') },
  { id: 'values', label: b('ค่านิยม', 'Values') },
  { id: 'join', label: b('ร่วมงาน', 'Join') },
]

export const UI = {
  about: b('เกี่ยวกับเรา', 'About'),
  virtualOffice: b('Virtual Office', 'Virtual Office'),
  visitVirtualOffice: b('เข้าออฟฟิศเสมือน', 'Visit Virtual Office'),
  explore: b('สำรวจโซลูชันของเรา', 'Explore Our Solutions'),
  scroll: b('เลื่อนลง', 'Scroll'),
  visitPlatform: b('เข้าชมแพลตฟอร์ม', 'Visit platform'),
  comingSoon: b('ลิงก์กำลังจะมา', 'Link coming soon'),
  menuOpen: b('เปิดเมนู', 'Open menu'),
  menuClose: b('ปิดเมนู', 'Close menu'),
  langSwitch: b('Switch to English', 'เปลี่ยนเป็นภาษาไทย'),
  placeholder: b('ภาพตัวอย่าง — แทนที่ด้วย', 'Placeholder — replace with'),
}

export const HERO = {
  badge: b('DEEP-TECH SOCIAL INNOVATOR', 'DEEP-TECH SOCIAL INNOVATOR'),
  sub: b('โครงสร้างพื้นฐานทางสังคมดิจิทัล ผ่าน AI, Game และ Metaverse', 'Digital social infrastructure through AI, Games and the Metaverse'),
  finalKicker: b('Deep-Tech Social Innovator & Immersive Experience Creator', 'Deep-Tech Social Innovator & Immersive Experience Creator'),
  motto: b(
    'เรานำเทคโนโลยี จิตวิทยา ความงาม และความเพลิดเพลิน มารวมกันเพื่อคุณค่าต่อการเติบโตของผู้คน',
    'We bring together technology, psychology, beauty and enjoyment to create value for human growth.',
  ),
  cards: [
    { value: '20,000+', label: b('ผู้เข้าชมงาน', 'Festival visitors'), note: b('Namaste Thailand 2026 · นิวเดลี', 'Namaste Thailand 2026 · New Delhi') },
    { value: '>90%', label: b('ความแม่นยำ AI', 'AI pose accuracy'), note: b('AI Kru Muay Thai · Pose Estimation', 'AI Kru Muay Thai · Pose Estimation') },
    { value: 'Award', label: b('Innovation Cooperation', 'Innovation Cooperation'), note: b('AI Avatar "Ananya" & Foody AI', 'AI Avatar "Ananya" & Foody AI') },
  ],
}

export const INSIDE = {
  badge: b('INSIDE ASCEND', 'INSIDE ASCEND'),
  title: b('หนึ่งสัญลักษณ์ สามเสาหลัก', 'One Mark. Three Pillars.'),
  lead: b(
    'เราไม่ได้มอง AI, เกม และ Metaverse เป็นแค่สื่อบันเทิง แต่เป็นโครงสร้างพื้นฐานที่เชื่อมนวัตกรรมเข้ากับภาครัฐ ธุรกิจ การศึกษา และการพัฒนาคน',
    "We don't see AI, games and the Metaverse as mere entertainment — they are infrastructure linking innovation with government, business, education and human development.",
  ),
  layers: [
    { no: '01', name: b('AI & Conversational Avatars', 'AI & Conversational Avatars'), body: b('มนุษย์เสมือนที่สนทนาได้แบบเรียลไทม์', 'Digital humans that converse in real time') },
    { no: '02', name: b('Game-driven Metaverse', 'Game-driven Metaverse'), body: b('โลกเสมือนเชิงสังคมเพื่อการเรียนรู้และชุมชน', 'Social virtual worlds for learning and community') },
    { no: '03', name: b('Interactive Soft Power', 'Interactive Soft Power'), body: b('นำวัฒนธรรมไทยสู่เวทีโลกด้วยสื่อปฏิสัมพันธ์', 'Interactive media carrying Thai culture worldwide') },
    { no: '∞', name: b('Digital Social Infrastructure', 'Digital Social Infrastructure'), body: b('ฐานที่เชื่อมภาครัฐ ธุรกิจ การศึกษา และเวทีสากล', 'The base connecting government, business, education and the world') },
  ],
}

export const IMPACT = {
  badge: b('GLOBAL IMPACT', 'GLOBAL IMPACT'),
  title: b('ผลลัพธ์จริง บนเวทีจริง', 'Real Outcomes. Real Stages.'),
  stats: [
    { value: 20000, suffix: '+', label: b('ผู้เข้าร่วมงาน Namaste Thailand Festival 2026 ที่นิวเดลี', 'Visitors at Namaste Thailand Festival 2026, New Delhi') },
    { value: 3, suffix: '', label: b('ชุดนิทรรศการ Interactive "Sustaining Our Oceans" ให้ UNESCO', 'Interactive exhibition sets for UNESCO "Sustaining Our Oceans"') },
    { value: 90, prefix: '>', suffix: '%', label: b('ความแม่นยำ AI Pose Estimation ของ AI Kru Muay Thai', 'AI Pose Estimation accuracy in AI Kru Muay Thai') },
    { value: 10, suffix: '+', label: b('ปีประสบการณ์ด้านสื่อการเรียนรู้ดิจิทัล เกม และ VR/AR', 'Years of experience in digital learning, games and VR/AR') },
  ],
}

export interface PillarItem {
  name: string
  tag: Bi
  body: Bi
}

export const PILLARS: { id: string; no: string; badge: Bi; title: Bi; lead: Bi; items: PillarItem[]; accent: 'cyan' | 'blue' | 'teal' }[] = [
  {
    id: 'pillars',
    no: '01',
    accent: 'cyan',
    badge: b('PILLAR 01 · AI', 'PILLAR 01 · AI'),
    title: b('AI & Conversational Avatars', 'AI & Conversational Avatars'),
    lead: b('นวัตกรรมปัญญาประดิษฐ์และมนุษย์เสมือนที่พูดคุย แนะนำ และให้บริการได้แบบเรียลไทม์', 'AI and digital humans that converse, recommend and serve in real time.'),
    items: [
      { name: 'QuantumSoul.ai', tag: b('Public Service · Healthcare · Education', 'Public Service · Healthcare · Education'), body: b('แพลตฟอร์ม AI Avatar สนทนาแบบเรียลไทม์ (RAG) ช่วยลดภาระบุคลากรและเพิ่มการเข้าถึงข้อมูลของประชาชน', 'Real-time conversational AI Avatar platform (RAG) that reduces staff workload and widens public access to information.') },
      { name: 'Foody AI Avatar', tag: b('AI Live Commerce · Cloud POS', 'AI Live Commerce · Cloud POS'), body: b('AI Avatar สำหรับธุรกิจอาหาร แนะนำเมนูเฉพาะบุคคลและเชื่อม POS บน Cloud แบบเรียลไทม์ ได้รับรางวัล Innovation Cooperation Award', 'AI Avatar for F&B with personalised menus and real-time cloud POS — winner of the Innovation Cooperation Award.') },
      { name: 'Wasty — Spark the World', tag: b('Zero Food Waste · SOS Thailand', 'Zero Food Waste · SOS Thailand'), body: b('Game × Crowdfunding เชื่อมร้านอาหารกับมูลนิธิ SOS เพื่อส่งต่ออาหารส่วนเกินให้โรงเรียนห่างไกล', 'Game × Crowdfunding linking restaurants with SOS Foundation to route surplus food to remote schools.') },
    ],
  },
  {
    id: 'metaverse',
    no: '02',
    accent: 'blue',
    badge: b('PILLAR 02 · METAVERSE', 'PILLAR 02 · METAVERSE'),
    title: b('Game-driven Metaverse & Immersive Space', 'Game-driven Metaverse & Immersive Space'),
    lead: b('โลกเสมือนเชิงสังคมสำหรับการเรียนรู้ ชุมชน และองค์กร', 'Social virtual worlds for learning, community and organisations.'),
    items: [
      { name: 'EdenVerden.io', tag: b('Learning · Enterprise', 'Learning · Enterprise'), body: b('แพลตฟอร์มโลกเสมือนเพื่อการเรียนรู้และองค์กร', 'A virtual world platform for learning and enterprise.') },
      { name: 'Aomunity (GSB)', tag: b('Community · Finance', 'Community · Finance'), body: b('โลกเสมือนเพื่อชุมชนและการเงิน ร่วมกับธนาคารออมสิน', 'A community and finance metaverse with the Government Savings Bank.') },
      { name: 'UNESCO Oceans Exhibition', tag: b('ESD · VR/AR', 'ESD · VR/AR'), body: b('นิทรรศการ Interactive 3 ชุดเรื่องความยั่งยืนของมหาสมุทร ผสาน VR/AR และ Gamified Learning', 'Three interactive exhibition sets on ocean sustainability combining VR/AR and gamified learning.') },
    ],
  },
  {
    id: 'softpower',
    no: '03',
    accent: 'teal',
    badge: b('PILLAR 03 · SOFT POWER', 'PILLAR 03 · SOFT POWER'),
    title: b('Interactive Soft Power & Gamification', 'Interactive Soft Power & Gamification'),
    lead: b('สื่อปฏิสัมพันธ์และการเผยแพร่วัฒนธรรมไทยสู่เวทีโลก', 'Interactive media that carries Thai culture to the world.'),
    items: [
      { name: 'AI Kru Muay Thai', tag: b('AI Pose Estimation', 'AI Pose Estimation'), body: b('วิเคราะห์ท่าทางมวยไทยแบบเรียลไทม์ ความแม่นยำมากกว่า 90%', 'Real-time Muay Thai pose analysis with over 90% accuracy.') },
      { name: 'MysteryJars', tag: b('Gamification', 'Gamification'), body: b('แพลตฟอร์มเกมปฏิสัมพันธ์และ Gamification', 'An interactive game and gamification platform.') },
      { name: 'Thai Festivals Abroad', tag: b('นิวเดลี · แคนเบอร์รา · ซิดนีย์', 'New Delhi · Canberra · Sydney'), body: b('ร่วมกับสถานเอกอัครราชทูตไทย นำ AI Avatar ไปเป็นทูตวัฒนธรรมอาหารดิจิทัล', 'With Royal Thai Embassies, fielding AI Avatars as digital food cultural ambassadors.') },
    ],
  },
]

export const PLATFORMS = {
  badge: b('PLATFORMS', 'PLATFORMS'),
  title: b('นวัตกรรม ที่ใช้งานได้จริง', 'Deep Tech, Put to Real Use.'),
  lead: b('สามแพลตฟอร์มหลักที่ขับเคลื่อนงานของเรา ตั้งแต่บริการสาธารณะไปจนถึงเวทีวัฒนธรรมระดับโลก', 'Three flagship platforms powering our work — from public services to global cultural stages.'),
  screens: [
    { key: 'quantumSoul', name: 'QuantumSoul.ai', caption: b('AI Avatar สนทนาเรียลไทม์', 'Real-time conversational AI') },
    { key: 'edenVerden', name: 'EdenVerden.io', caption: b('โลกเสมือนเพื่อการเรียนรู้', 'Virtual world for learning') },
    { key: 'kruMuayThai', name: 'AI Kru Muay Thai', caption: b('วิเคราะห์ท่ามวยด้วย AI', 'AI pose coaching') },
  ] as const,
}

export const TECH = {
  badge: b('TECHNOLOGY STACK', 'TECHNOLOGY STACK'),
  title: b('แปดเทคโนโลยี หนึ่งโครงสร้างพื้นฐาน', 'Eight Technologies. One Infrastructure.'),
  lead: b('ชุดเทคโนโลยีที่เราพัฒนาเองและนำไปใช้ในงานจริง เลือกแต่ละจุดเพื่อดูรายละเอียด', 'The stack we build and ship in real projects. Select a node to trace it.'),
  nodes: [
    { name: b('Conversational AI (RAG)', 'Conversational AI (RAG)'), spec: 'QuantumSoul.ai', body: b('ระบบสนทนาที่ตอบจากฐานความรู้ขององค์กร สำหรับบริการสาธารณะ การแพทย์ และการศึกษา', 'Dialogue grounded in an organisation’s own knowledge, for public service, healthcare and education.') },
    { name: b('MetaHuman Avatar', 'MetaHuman Avatar'), spec: 'Ananya · Foody', body: b('มนุษย์เสมือนที่พูดได้หลายภาษา เช่น ฮินดีและอังกฤษ ทำหน้าที่เป็นทูตวัฒนธรรม', 'Multilingual digital humans — Hindi, English and more — serving as cultural ambassadors.') },
    { name: b('AI Pose Estimation', 'AI Pose Estimation'), spec: '>90% accuracy', body: b('วิเคราะห์ท่าทางร่างกายแบบเรียลไทม์ หัวใจของ AI Kru Muay Thai', 'Real-time body-pose analysis at the heart of AI Kru Muay Thai.') },
    { name: b('Metaverse Worlds', 'Metaverse Worlds'), spec: 'EdenVerden · Aomunity', body: b('โลกเสมือนเชิงสังคมที่ผู้คนเข้ามาเรียนรู้ ทำงาน และสร้างชุมชนร่วมกัน', 'Social virtual worlds where people learn, work and build community together.') },
    { name: b('Gamification Engine', 'Gamification Engine'), spec: 'MysteryJars · Wasty', body: b('กลไกเกมที่เปลี่ยนพฤติกรรม ตั้งแต่การเรียนรู้จนถึงการบริจาคอาหาร', 'Game mechanics that shift behaviour — from learning to food donation.') },
    { name: b('Cloud POS Integration', 'Cloud POS Integration'), spec: 'Foody AI', body: b('เชื่อม AI Avatar กับระบบขายหน้าร้านบน Cloud แบบเรียลไทม์', 'AI Avatars wired into cloud point-of-sale in real time.') },
    { name: b('AI Live Commerce', 'AI Live Commerce'), spec: 'Foody AI', body: b('แนะนำสินค้าเฉพาะบุคคลและวิเคราะห์พฤติกรรมผู้บริโภค', 'Personalised recommendations and consumer-behaviour analytics.') },
    { name: b('VR/AR Exhibition', 'VR/AR Exhibition'), spec: 'UNESCO Oceans', body: b('นิทรรศการผสม VR/AR มัลติมีเดีย และการเรียนรู้แบบเกม ติดตั้งหน้างานครบวงจร', 'VR/AR, multimedia and gamified learning exhibitions, installed end to end.') },
  ],
}

export const TRUSTED = {
  badge: b('TRUSTED BY', 'TRUSTED BY'),
  title: b('ได้รับความไว้วางใจจากภาครัฐและเวทีสากล', 'Trusted by Government & Global Institutions'),
  partners: [
    { id: 'unesco', name: 'UNESCO Bangkok' },
    { id: 'thai-embassy', name: 'Royal Thai Embassy' },
    { id: 'gsb', name: 'Government Savings Bank' },
    { id: 'etda', name: 'ETDA' },
    { id: 'sos', name: 'SOS Thailand' },
    { id: 'scb-academy', name: 'SCB Academy' },
    { id: 'spu', name: 'Sripatum University' },
  ],
  cases: [
    {
      tag: b('UNESCO · ESD', 'UNESCO · ESD'),
      title: b('"Sustaining Our Oceans" Interactive Exhibition', '"Sustaining Our Oceans" Interactive Exhibition'),
      body: b('ออกแบบและผลิตนิทรรศการการเรียนรู้เชิงโต้ตอบ 3 ชุด ผสาน VR/AR และ Gamified Learning ติดตั้งที่ UNESCO กรุงเทพฯ เขตสงวนชีวมณฑลระนอง และพิพิธภัณฑ์เด็กกรุงเทพมหานคร', 'Three interactive learning exhibition sets combining VR/AR and gamified learning, installed at UNESCO Bangkok, Ranong Biosphere Reserve and the Children’s Discovery Museum Bangkok.'),
      meta: b('ต.ค. 2025 – มี.ค. 2026', 'Oct 2025 – Mar 2026'),
    },
    {
      tag: b('Soft Power · India', 'Soft Power · India'),
      title: b('Namaste Thailand Festival 2026 — AI Avatar "Ananya"', 'Namaste Thailand Festival 2026 — AI Avatar "Ananya"'),
      body: b('AI Avatar ที่สนทนาได้แบบเรียลไทม์ พัฒนาร่วมกับสถานเอกอัครราชทูตไทย ณ กรุงนิวเดลี สื่อสารภาษาฮินดีและอังกฤษ เป็นทูตวัฒนธรรมอาหารไทย–อินเดียในรูปแบบดิจิทัล', 'A real-time conversational AI Avatar co-created with the Royal Thai Embassy in New Delhi, speaking Hindi and English as the Thai–Indian digital food cultural ambassador.'),
      meta: b('ผู้เข้าชม 20,000+ · Innovation Cooperation Award', '20,000+ visitors · Innovation Cooperation Award'),
    },
    {
      tag: b('Soft Power · Australia', 'Soft Power · Australia'),
      title: b('Thai Festival Canberra & Grand Festival Sydney 2026', 'Thai Festival Canberra & Grand Festival Sydney 2026'),
      body: b('นำการจัดแสดงนวัตกรรมดิจิทัลที่แคนเบอร์ราและ Tumbalong Park ซิดนีย์ ภายใต้แนวคิด "Creative Life and Creative Heartbeat" พร้อม Foody AI Avatar (MetaHuman)', 'Led the digital innovation showcases in Canberra and at Tumbalong Park, Sydney, under "Creative Life and Creative Heartbeat", featuring the Foody AI Avatar (MetaHuman).'),
      meta: b('ร่วมกับสถานทูตและสถานกงสุลใหญ่ไทย', 'With the Royal Thai Embassy & Consulate-General'),
    },
    {
      tag: b('Community · Finance', 'Community · Finance'),
      title: b('Aomunity — Government Savings Bank', 'Aomunity — Government Savings Bank'),
      body: b('โลกเสมือนเพื่อชุมชนและการเงิน พัฒนาร่วมกับธนาคารออมสิน เชื่อมความรู้ทางการเงินเข้ากับประสบการณ์แบบเกม', 'A community and finance metaverse built with the Government Savings Bank, connecting financial literacy with game-driven experiences.'),
      meta: b('Game-driven Metaverse', 'Game-driven Metaverse'),
    },
  ],
}

export const VALUES = {
  badge: b('FUTURE & IMPACT DRIVEN', 'FUTURE & IMPACT DRIVEN'),
  title: b('ค่านิยมหลัก A-S-C-E-N-D', 'The A-S-C-E-N-D Framework'),
  items: [
    { letter: 'A', name: 'Agile Innovation', th: 'นวัตกรรมคล่องตัว', body: b('สร้างสรรค์และปรับเปลี่ยนเทคโนโลยีเชิงลึกอย่างรวดเร็วให้ทันต่อการเปลี่ยนแปลงของโลก', 'Creating and adapting deep technology quickly to keep pace with a changing world.') },
    { letter: 'S', name: 'Social Infrastructure', th: 'โครงสร้างพื้นฐานสังคม', body: b('สร้าง AI, Game และ Metaverse เพื่อยกระดับสังคม พัฒนาคุณภาพชีวิต และแก้ปัญหาจริง', 'Building AI, games and metaverses that lift society, improve lives and solve real problems.') },
    { letter: 'C', name: 'Co-Creation', th: 'การร่วมสร้างสรรค์', body: b('ผนึกกำลังกับพันธมิตรทุกภาคส่วน ทั้งภาครัฐ เอกชน สถาบันการศึกษา และองค์กรระดับสากล', 'Joining forces with partners across government, business, academia and international bodies.') },
    { letter: 'E', name: 'Empowerment', th: 'การเสริมพลังผู้คน', body: b('ใช้เทคโนโลยี จิตวิทยา และศิลปะ ดึงศักยภาพและยกระดับคุณค่าต่อการเติบโตของมนุษย์', 'Using technology, psychology and art to unlock potential and add value to human growth.') },
    { letter: 'N', name: 'Next-Gen Tech', th: 'เทคโนโลยียุคใหม่ที่จับต้องได้', body: b('พัฒนา AI และ Immersive Media เชิงลึกที่นำไปใช้งานได้จริง', 'Developing deep AI and immersive media that work in the real world.') },
    { letter: 'D', name: 'Deep Impact', th: 'ผลกระทบที่ยั่งยืน', body: b('สร้างผลลัพธ์เชิงบวกที่ลึกซึ้งและวัดผลได้จริง ทั้งในระดับประเทศและสากล', 'Creating deep, measurable positive outcomes at national and international scale.') },
  ],
}

export const GLOBAL_STAGE = {
  badge: b('GLOBAL STAGE', 'GLOBAL STAGE'),
  title: b('จากวิสัยทัศน์ สู่เวทีโลก', 'From Vision to the Global Stage'),
  cards: [
    { key: 'galleryNewDelhi', kicker: 'NEW DELHI · 2026', title: b('Namaste Thailand Festival', 'Namaste Thailand Festival'), body: b('AI Avatar "Ananya" ต้อนรับผู้เข้าชมกว่า 20,000 คน', 'AI Avatar "Ananya" welcomed 20,000+ visitors') },
    { key: 'galleryAustralia', kicker: 'CANBERRA · SYDNEY', title: b('Thai Festival Australia', 'Thai Festival Australia'), body: b('Foody AI Avatar ในบทบาททูตวัฒนธรรมอาหารดิจิทัล', 'Foody AI Avatar as digital food ambassador') },
    { key: 'galleryUnesco', kicker: 'UNESCO · BANGKOK', title: b('Sustaining Our Oceans', 'Sustaining Our Oceans'), body: b('นิทรรศการ VR/AR เพื่อการเรียนรู้เรื่องมหาสมุทร', 'VR/AR exhibitions for ocean learning') },
  ] as const,
}

export const JOIN = {
  badge: b('GROW WITH ASCEND', 'GROW WITH ASCEND'),
  title: b('Real Field, Global Stage', 'Real Field, Global Stage'),
  lead: b(
    'พื้นที่ปล่อยของสำหรับนักศึกษาและคนรุ่นใหม่ ลงมือทำจริง แก้ปัญหาจริง และเติบโตจริงบนสนามระดับประเทศและสากล',
    'A launchpad for students and young talent — do real work, solve real problems and grow on national and global stages.',
  ),
  cta: b('สมัคร Co-Working Challenge', 'Join the Challenge'),
  facts: [
    { value: '8', label: b('Project Tracks', 'Project Tracks') },
    { value: 'SPU', label: b('สถาบันพันธมิตร', 'Academic partner') },
    { value: 'AI · Game · Metaverse', label: b('โจทย์จริง', 'Real briefs') },
  ],
}

export const JOIN_MODAL = {
  title: b('Ascend Co-Working Challenge', 'Ascend Co-Working Challenge'),
  intro: b(
    'โครงการร่วมกับมหาวิทยาลัยศรีปทุม (SPU) และสถาบันการศึกษาพันธมิตร ให้นักศึกษาได้ทำงานกับโจทย์จริงด้าน AI, Game และ Metaverse ใน 8 Project Tracks',
    'Run with Sripatum University (SPU) and partner institutions, giving students real briefs in AI, games and the Metaverse across 8 project tracks.',
  ),
  steps: [
    { title: b('เลือก Track', 'Pick a track'), body: b('เลือกโจทย์ที่ตรงกับความสนใจจาก 8 Project Tracks', 'Choose the brief that fits you from 8 project tracks.') },
    { title: b('ลงทะเบียนออนไลน์', 'Register online'), body: b('กรอกแบบฟอร์มสมัครผ่าน Google Form', 'Fill in the application via Google Form.') },
    { title: b('พบทีมที่ Gather.town', 'Meet us on Gather.town'), body: b('ทำงานร่วมกับทีมทั้งในออฟฟิศเสมือนและออฟฟิศจริงที่อุดมสุข 58', 'Work with the team in our virtual office and at our Udomsuk 58 HQ.') },
    { title: b('ลงสนามจริง', 'Ship real work'), body: b('ร่วมพัฒนาโครงการให้ภาครัฐ ภาคธุรกิจ และเวทีระดับโลก', 'Contribute to projects for government, business and global stages.') },
  ],
  apply: b('ไปที่แบบฟอร์มสมัคร', 'Open application form'),
  roles: b('ดูตำแหน่งงาน', 'See open roles'),
}

export const ABOUT = {
  title: b('เกี่ยวกับ ASCEND', 'About ASCEND'),
  intro: b(
    'ASCEND ก่อตั้งเมื่อกุมภาพันธ์ 2019 ด้วยความเชื่อว่า AI, เกม และ Metaverse คือโครงสร้างพื้นฐานทางสังคมยุคใหม่ ไม่ใช่เพียงสื่อบันเทิง เราเป็น One-stop Consultant & Developer ที่ใช้เทคโนโลยีเป็น "ภาษากลาง" เชื่อมภาครัฐ ภาคธุรกิจ สถาบันการศึกษา และเวทีระดับสากล',
    'Founded in February 2019, ASCEND believes AI, games and the Metaverse are the social infrastructure of a new era — not just entertainment. We are a one-stop consultant and developer using technology as a common language between government, business, academia and the international stage.',
  ),
  facts: [
    { label: b('ก่อตั้ง', 'Founded'), value: b('กุมภาพันธ์ 2019', 'February 2019') },
    { label: b('ทีม', 'Team'), value: b('Lean Team 12 คน', 'Lean team of 12') },
    { label: b('ออฟฟิศ', 'Offices'), value: b('อุดมสุข 58 + Gather.town', 'Udomsuk 58 + Gather.town') },
    { label: b('ภาษา', 'Languages'), value: b('ไทย – อังกฤษ', 'Thai – English') },
  ],
  leadersTitle: b('คณะผู้บริหาร', 'Leadership'),
  leaders: [
    { role: 'CEO', name: b('คุณปกรณ์ ศุภศักดิ์สุทัศน์', 'คุณปกรณ์ ศุภศักดิ์สุทัศน์'), title: b('ประธานเจ้าหน้าที่บริหาร', 'Chief Executive Officer') },
    { role: 'COO', name: b('คุณหทัยทิพย์', 'คุณหทัยทิพย์'), title: b('ประธานเจ้าหน้าที่ฝ่ายปฏิบัติการ', 'Chief Operating Officer') },
    { role: 'CTO', name: b('คุณบูรพา', 'คุณบูรพา'), title: b('ประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี', 'Chief Technology Officer') },
  ],
}

export const FOOTER = {
  tagline: b('Deep-Tech Social Innovator & Immersive Experience Creator', 'Deep-Tech Social Innovator & Immersive Experience Creator'),
  company: b('บริษัท อะเซนด์ จำกัด', 'ASCEND Co., Ltd.'),
  addressTitle: b('ออฟฟิศ', 'Office'),
  address: b('264 ซอยอุดมสุข 58 แขวงบางนา เขตบางนา กรุงเทพฯ 10260', '264 Soi Udomsuk 58, Bang Na, Bangkok 10260, Thailand'),
  virtualTitle: b('ออฟฟิศเสมือน', 'Virtual office'),
  socialTitle: b('ช่องทางโซเชียล', 'Social'),
  rights: b('สงวนลิขสิทธิ์', 'All rights reserved.'),
}
