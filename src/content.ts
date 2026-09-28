// All site copy, Thai + English. Sourced from the ASCEND IA / Mood & Tone
// brief, the Brand Strategy Blueprint and the Company Experience & Project
// Portfolio. Edit wording here; components only render it.
import type { Bi } from './i18n/LangContext'

const b = (th: string, en: string): Bi => ({ th, en })

export const NAV = [
  { id: 'pillars', label: b('เสาหลัก', 'Pillars') },
  { id: 'works', label: b('ผลงาน', 'Works') },
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
  motto: b(
    'เรานำเทคโนโลยี จิตวิทยา ความงาม และความเพลิดเพลิน มารวมกันเพื่อคุณค่าต่อการเติบโตของผู้คน และการสร้างชุมชนที่ยั่งยืน',
    'We bring together technology, psychology, beauty and enjoyment to create value for human growth and sustainable communities.',
  ),
}

export const INSIDE = {
  badge: b('INSIDE ASCEND', 'INSIDE ASCEND'),
  title: b('หนึ่งสัญลักษณ์ สามเสาหลัก', 'One Mark. Three Pillars.'),
  lead: b(
    'เราไม่ได้มอง AI, เกม และ Metaverse เป็นแค่สื่อบันเทิง แต่เป็นโครงสร้างพื้นฐานที่เชื่อมนวัตกรรมเข้ากับภาครัฐ ธุรกิจ การศึกษา และการพัฒนาคน',
    "We don't see AI, games and the Metaverse as mere entertainment — they are infrastructure linking innovation with government, business, education and human development.",
  ),
  layers: [
    { name: b('AI & Conversational Avatars', 'AI & Conversational Avatars'), body: b('มนุษย์เสมือนที่สนทนาได้แบบเรียลไทม์', 'Digital humans that converse in real time') },
    { name: b('Game-driven Metaverse', 'Game-driven Metaverse'), body: b('โลกเสมือนเชิงสังคมเพื่อการเรียนรู้และชุมชน', 'Social virtual worlds for learning and community') },
    { name: b('Interactive Soft Power', 'Interactive Soft Power'), body: b('นำวัฒนธรรมไทยสู่เวทีโลกด้วยสื่อปฏิสัมพันธ์', 'Interactive media carrying Thai culture worldwide') },
    { name: b('Digital Social Infrastructure', 'Digital Social Infrastructure'), body: b('ฐานที่เชื่อมภาครัฐ ธุรกิจ การศึกษา และเวทีสากล', 'The base connecting government, business, education and the world') },
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

export const PILLARS: { id: string; badge: Bi; title: Bi; lead: Bi; items: PillarItem[]; accent: 'cyan' | 'blue' | 'teal' }[] = [
  {
    id: 'pillars',
    accent: 'cyan',
    badge: b('AI', 'AI'),
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
    accent: 'blue',
    badge: b('METAVERSE', 'METAVERSE'),
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
    accent: 'teal',
    badge: b('SOFT POWER', 'SOFT POWER'),
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
    { name: b('MetaHuman & AI Avatars', 'MetaHuman & AI Avatars'), spec: 'Foody AI · Ananya', body: b('Foody AI Avatar พัฒนาด้วย MetaHuman และ AI Avatar "Ananya" ที่สนทนาภาษาฮินดีและอังกฤษ ทำหน้าที่ทูตวัฒนธรรมอาหารไทยในรูปแบบดิจิทัล', 'Foody AI Avatar built on MetaHuman, and AI Avatar "Ananya" conversing in Hindi and English, serving as digital Thai food cultural ambassadors.') },
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
    { id: 'moe', name: 'Ministry of Education' },
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
      body: b('ได้รับความไว้วางใจจากธนาคารออมสินให้พัฒนาโลกเสมือน "Aomunity" สร้างกิจกรรมและเกมภายในแพลตฟอร์ม และวางกลยุทธ์การตลาดและประชาสัมพันธ์แบบครบวงจร', 'Commissioned by the Government Savings Bank to build the "Aomunity" virtual world, create in-platform activities and games, and plan and run its marketing and PR.'),
      meta: b('Metaverse · Interactive Content · Strategic Marketing', 'Metaverse · Interactive Content · Strategic Marketing'),
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
  address: b('264 ซอยอุดมสุข 58 แขวงบางนา เขตบางนา กรุงเทพฯ 10260', '264 Soi Udomsuk 58, Bangna Subdistrict, Bangna District, Bangkok 10260'),
  virtualTitle: b('ออฟฟิศเสมือน', 'Virtual office'),
  socialTitle: b('ช่องทางโซเชียล', 'Social'),
  rights: b('สงวนลิขสิทธิ์', 'All rights reserved.'),
}

export type WorkCategory = 'ai' | 'metaverse' | 'game' | 'vrar' | 'softpower'

export interface Work {
  title: string
  /** client or context, as named in the portfolio */
  client: Bi
  year?: string
  ongoing?: boolean
  cats: WorkCategory[]
  body: Bi
}

// Every project in the Company Experience & Project Portfolio. "ongoing" marks
// the items listed under its "Ongoing Projects" heading.
export const WORKS = {
  badge: b('PORTFOLIO', 'PORTFOLIO'),
  title: b('ผลงานและโครงการสำคัญ', 'Selected Works & Projects'),
  lead: b(
    'ผลงานที่เราทำร่วมกับองค์กรระหว่างประเทศ สถานทูต ภาครัฐ สถาบันการศึกษา และภาคธุรกิจ',
    'Work delivered with international organisations, embassies, government, academia and business.',
  ),
  filters: [
    { id: 'all', label: b('ทั้งหมด', 'All') },
    { id: 'ai', label: b('AI Avatar', 'AI Avatar') },
    { id: 'metaverse', label: b('Metaverse', 'Metaverse') },
    { id: 'game', label: b('เกม', 'Games') },
    { id: 'vrar', label: b('VR/AR', 'VR/AR') },
    { id: 'softpower', label: b('Soft Power', 'Soft Power') },
  ] as const,
  ongoing: b('กำลังดำเนินการ', 'Ongoing'),
  showAll: b('ดูผลงานทั้งหมด', 'Show all works'),
  showLess: b('แสดงน้อยลง', 'Show fewer'),
  items: [
    {
      title: 'Sustaining Our Oceans',
      client: b('UNESCO Regional Office in Bangkok', 'UNESCO Regional Office in Bangkok'),
      year: '2025–2026',
      cats: ['vrar', 'game'],
      body: b(
        'ออกแบบและผลิตนิทรรศการการเรียนรู้เชิงโต้ตอบ 3 ชุด ผสาน VR/AR คอนเทนต์มัลติมีเดีย และ Gamified Learning ติดตั้งที่ UNESCO กรุงเทพฯ เขตสงวนชีวมณฑลระนอง และพิพิธภัณฑ์เด็กกรุงเทพมหานคร พร้อมรับประกัน 24 เดือน',
        'Three interactive learning exhibition sets combining VR/AR, multimedia and gamified learning, installed at UNESCO Bangkok, Ranong Biosphere Reserve and the Children’s Discovery Museum Bangkok, with a 24-month warranty.',
      ),
    },
    {
      title: 'Namaste Thailand Festival 2026 — "Ananya"',
      client: b('สถานเอกอัครราชทูตไทย ณ กรุงนิวเดลี', 'Royal Thai Embassy, New Delhi'),
      year: '2026',
      cats: ['ai', 'softpower'],
      body: b(
        'AI Avatar "Ananya" สนทนาเรียลไทม์ภาษาฮินดีและอังกฤษ เป็นทูตวัฒนธรรมอาหารไทย–อินเดียในรูปแบบดิจิทัล ในงานที่มีผู้เข้าร่วมกว่า 20,000 คน ได้รับรางวัล Innovation Cooperation Award',
        'Real-time conversational AI Avatar "Ananya", speaking Hindi and English as the Thai–Indian digital food cultural ambassador at a festival of 20,000+ visitors. Winner of the Innovation Cooperation Award.',
      ),
    },
    {
      title: 'Thai Festival Canberra & Grand Festival Sydney 2026',
      client: b('สถานเอกอัครราชทูตไทย ณ กรุงแคนเบอร์รา · สถานกงสุลใหญ่ ณ นครซิดนีย์', 'Royal Thai Embassy, Canberra · Royal Thai Consulate-General, Sydney'),
      year: '2026',
      cats: ['ai', 'softpower'],
      body: b(
        'Foody AI Avatar (MetaHuman) เป็นทูตวัฒนธรรมอาหารดิจิทัล ร่วมออกแบบ Opening Animation ที่ AI Avatar กล่าวต้อนรับร่วมกับคณะนักการทูต และ AI Muay Thai (Digital Immortality) ให้ผู้ชมฝึกมวยไทยกับครูมวยเสมือนด้วย AI Pose Estimation ความแม่นยำมากกว่า 90%',
        'Foody AI Avatar (MetaHuman) as digital food ambassador, a co-created Opening Animation with the AI Avatar greeting alongside diplomats, and AI Muay Thai (Digital Immortality): practise with virtual masters via AI Pose Estimation at >90% accuracy.',
      ),
    },
    {
      title: 'Aomunity',
      client: b('ธนาคารออมสิน (GSB)', 'Government Savings Bank (GSB)'),
      cats: ['metaverse', 'game'],
      body: b(
        'พัฒนาโลกเสมือน "Aomunity" ด้วย Game-driven Metaverse สร้างกิจกรรมและเกมภายในแพลตฟอร์ม และวางกลยุทธ์การตลาดและประชาสัมพันธ์แบบครบวงจร',
        'Built the "Aomunity" virtual world with Game-driven Metaverse technology, created in-platform activities and games, and planned and ran its marketing and PR.',
      ),
    },
    {
      title: 'Hybrid Events Metaverse — DGT2023',
      client: b('ETDA ร่วมกับ V360', 'ETDA with V360'),
      year: '2023',
      cats: ['metaverse'],
      body: b(
        'แพลตฟอร์ม Hybrid Event บน Metaverse เพื่อยกระดับการมีส่วนร่วมและการเปลี่ยนผ่านสู่ดิจิทัล',
        'A Metaverse-based hybrid event platform to enhance digital transformation and virtual engagement.',
      ),
    },
    {
      title: 'EdenVerden Metaverse Platform',
      client: b('แพลตฟอร์มของ ASCEND', 'ASCEND platform'),
      cats: ['metaverse'],
      body: b(
        'แพลตฟอร์มจำลองสถานการณ์บน Metaverse สำหรับการเรียนรู้แบบ Immersive รองรับ PC และ Mobile',
        'A Metaverse-based simulation platform for immersive learning, on PC and mobile.',
      ),
    },
    {
      title: 'QuantumSoul AI',
      client: b('บริการสาธารณะ · การแพทย์ · การศึกษา', 'Public service · Healthcare · Education'),
      cats: ['ai'],
      body: b(
        'แพลตฟอร์ม Conversational AI Avatar แบบเรียลไทม์ (RAG) ลดภาระบุคลากรและเพิ่มการเข้าถึงข้อมูลสำคัญของประชาชน',
        'A real-time conversational AI Avatar platform (RAG) that reduces staff workload and widens public access to essential information.',
      ),
    },
    {
      title: 'Foody AI Avatar for Smart Restaurants',
      client: b('ธุรกิจอาหารและเครื่องดื่ม', 'Food & beverage'),
      cats: ['ai'],
      body: b(
        'AI Live Commerce แนะนำเมนูเฉพาะบุคคล วิเคราะห์พฤติกรรมผู้บริโภค เชื่อม POS บน Cloud แบบเรียลไทม์ ได้รับรางวัล Innovation Cooperation Award',
        'AI Live Commerce with personalised menus and consumer-behaviour analysis, integrated with cloud POS in real time. Winner of the Innovation Cooperation Award.',
      ),
    },
    {
      title: 'AI Avatar "Spark" — Zero Food Waste',
      client: b('มูลนิธิ SOS Thailand', 'SOS Thailand Foundation'),
      cats: ['ai', 'game'],
      body: b(
        'AI Avatar "Wasty" บนแพลตฟอร์ม Game × Crowdfunding เชื่อมร้านอาหารกับเครือข่าย SOS Thailand เพื่อบริจาคอาหารส่วนเกินแบบเรียลไทม์ให้โรงเรียนและเด็กในพื้นที่ห่างไกล พร้อมรายงานผลโปร่งใส',
        'The "Wasty" AI Avatar on a Game × Crowdfunding platform, linking restaurants with the SOS Thailand network to donate surplus food in real time to remote schools, with transparent reporting.',
      ),
    },
    {
      title: 'AI Avatar for Education',
      client: b('SCB Academy', 'SCB Academy'),
      ongoing: true,
      cats: ['ai'],
      body: b('AI Avatar เพื่อการศึกษา รองรับการเรียนรู้เฉพาะบุคคลและการมีส่วนร่วมของผู้เรียน', 'An AI-powered Avatar for education, enabling personalised learning and student engagement.'),
    },
    {
      title: 'Muay Thai Wellness',
      client: b('AI & Game-Based Fitness', 'AI & Game-Based Fitness'),
      ongoing: true,
      cats: ['ai', 'game', 'softpower'],
      body: b('ผสาน AI และ Game-Based Learning เพื่อการฝึกมวยไทย ส่งเสริมสุขภาพ และเผยแพร่ศิลปะการต่อสู้ไทย', 'AI and game-based learning for Muay Thai training, fitness and the promotion of Thai martial arts.'),
    },
    {
      title: 'Mistertel’s Mystery Jars',
      client: b('เกม Interactive Mystery', 'Interactive mystery game'),
      ongoing: true,
      cats: ['game'],
      body: b('เกมแนว Interactive Mystery ที่ผสมผสาน Puzzle Solving และ Storytelling', 'A narrative-driven mystery game blending puzzle-solving and storytelling.'),
    },
    {
      title: 'AI Specialist for Electrical & Air Conditioning Services',
      client: b('Link Service & Starservice and Management Co., Ltd.', 'Link Service & Starservice and Management Co., Ltd.'),
      ongoing: true,
      cats: ['ai'],
      body: b('ระบบ AI Expert System สำหรับช่างไฟฟ้าและเครื่องปรับอากาศ เพิ่มประสิทธิภาพการบริการและการฝึกอบรม', 'An AI expert system for electrical and air-conditioning technicians, improving service efficiency and training.'),
    },
    {
      title: '"Tai Kong" — Game-Based Learning (POC)',
      client: b('สำนักงานศึกษาธิการจังหวัดสมุทรสาคร', 'Samut Sakhon Provincial Education Office'),
      ongoing: true,
      cats: ['game'],
      body: b('Game-Based Learning ส่งเสริมอาชีพ การท่องเที่ยวเชิงวัฒนธรรม และอัตลักษณ์ท้องถิ่น', 'Game-based learning promoting careers, cultural tourism and local identity.'),
    },
    {
      title: 'Metaverse & Game for Health Literacy',
      client: b('โรงเรียนเอกชน', 'A private school'),
      ongoing: true,
      cats: ['metaverse', 'game'],
      body: b('Metaverse เพื่อส่งเสริมความรู้ด้านสุขภาพผ่านการเรียนรู้เชิงโต้ตอบ', 'A Metaverse learning experience to improve health literacy through interaction.'),
    },
    {
      title: 'GlowSpace',
      client: b('Mindfulness · VR & AI', 'Mindfulness · VR & AI'),
      ongoing: true,
      cats: ['vrar', 'ai'],
      body: b('ประสบการณ์ Mindfulness ที่ผสาน VR และ AI พาผู้ใช้สำรวจจิตใจภายในผ่านเวิร์กช็อปแบบ Immersive', 'A mindfulness experience fusing VR and AI, taking people on an inner journey through immersive workshops.'),
    },
    {
      title: 'VR-Based First Aid Learning System (POC)',
      client: b('การฝึกอบรมปฐมพยาบาล', 'First-aid training'),
      cats: ['vrar'],
      body: b('ระบบฝึกอบรมปฐมพยาบาลด้วย VR เพื่อยกระดับประสบการณ์การเรียนรู้เชิงปฏิบัติ', 'A VR training system for first-aid education, enhancing hands-on learning.'),
    },
    {
      title: 'Himmaphan Beast Online',
      client: b('เทศกาลประติมากรรมทรายนานาชาติ 2024', 'International Sand Sculpture Festival 2024'),
      year: '2024',
      cats: ['game'],
      body: b('เกมแฟนตาซีสำหรับเทศกาล เพื่อสร้างการมีส่วนร่วมของผู้เข้าชม', 'A fantasy-themed game built to engage festival visitors.'),
    },
    {
      title: 'Christmas Give with Love',
      client: b('องค์กรคริสเตียน', 'Christian organisations'),
      cats: ['metaverse', 'game'],
      body: b('กิจกรรมคริสต์มาสบน Metaverse 2D ที่มี Interactive Missions และ Storytelling', 'A 2D Metaverse Christmas event with interactive missions and storytelling.'),
    },
    {
      title: 'Cartoon & Game 3D Animation',
      client: b('แอนิเมชันและเกม', 'Animation & games'),
      cats: ['game'],
      body: b('งานแอนิเมชัน 3D สำหรับการ์ตูนและเกม', '3D animation for cartoons and games.'),
    },
  ] satisfies Work[],
}
