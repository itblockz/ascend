import type { L, Lines } from './i18n'

// All copy, in English and Thai, from ASCEND's company documents (portfolio, brand blueprint,
// site structure brief). Links come from the portfolio PDF.

export const LINKS = {
  website: 'https://ascendgroup.asia/',
  /** Gather.town virtual office. Not in the source documents yet: while empty, the header CTA goes to Contact. */
  virtualOffice: '',
  /** Co-Working Challenge application form (Google Form). Not in the source documents yet. */
  coWorkingForm: '',
}

export const COMPANY = {
  name: { en: 'Ascend Co., Ltd.', th: 'บริษัท แอสเซนด์ จำกัด' },
  address: {
    en: '264 Soi Udomsuk 58, Bangna, Bangkok 10260',
    th: '264 ซอยอุดมสุข 58 แขวงบางนา เขตบางนา กรุงเทพฯ 10260',
  },
  positioning: { en: 'Deep-Tech Social Innovator & Immersive Experience Creator', th: 'ผู้นำนวัตกรรมเทคโนโลยีเชิงลึกและประสบการณ์เสมือนจริง เพื่อการพัฒนาสังคมอย่างยั่งยืน' },
}

export const SOCIALS = [
  { name: 'Ascend Group Asia', href: 'https://web.facebook.com/AscendGroupDotAsia' },
  { name: 'V360 Metaverse', href: 'https://web.facebook.com/v360metaverse' },
  { name: 'Eden Arts Studio', href: 'https://web.facebook.com/EdenArtsStudio' },
  { name: 'LifeHack360', href: 'https://web.facebook.com/LifeHack360' },
  { name: 'Quantum Soul AI', href: 'https://web.facebook.com/QuantumSoulAi/' },
  { name: 'Mystery Jars', href: 'https://web.facebook.com/MysteryJars' },
]

/** Chapters on the rail, by number (1–7); each links to the stop that opens it. */
export const CHAPTERS: { id: string; name: L }[] = [
  { id: 'impact', name: { en: 'Global impact', th: 'ผลงานระดับโลก' } },
  { id: 'ai', name: { en: 'AI avatars', th: 'AI Avatar' } },
  { id: 'metaverse', name: { en: 'Metaverse', th: 'เมตาเวิร์ส' } },
  { id: 'soft-power', name: { en: 'Soft power', th: 'ซอฟต์พาวเวอร์' } },
  { id: 'partners', name: { en: 'Partners', th: 'พันธมิตร' } },
  { id: 'values', name: { en: 'Values', th: 'ค่านิยม' } },
  { id: 'careers', name: { en: 'Careers', th: 'ร่วมงาน' } },
]

export const NAV: { id: string; label: L }[] = [
  { id: 'impact', label: { en: 'Impact', th: 'ผลงาน' } },
  { id: 'ai', label: { en: 'Solutions', th: 'โซลูชัน' } },
  { id: 'partners', label: { en: 'Partners', th: 'พันธมิตร' } },
  { id: 'careers', label: { en: 'Careers', th: 'ร่วมงาน' } },
  { id: 'contact', label: { en: 'Contact', th: 'ติดต่อ' } },
]

export const UI = {
  menu: { en: 'Menu', th: 'เมนู' },
  close: { en: 'Close', th: 'ปิด' },
  scroll: { en: 'Scroll to explore', th: 'เลื่อนเพื่อสำรวจ' },
  watch: { en: 'Watch', th: 'ชมวิดีโอ' },
  contact: { en: 'Contact us', th: 'ติดต่อเรา' },
  virtualOffice: { en: 'Virtual office', th: 'ออฟฟิศเสมือน' },
  chapters: { en: 'Chapters', th: 'บท' },
  language: { en: 'Language', th: 'ภาษา' },
  home: { en: 'ASCEND, back to the start', th: 'ASCEND กลับไปจุดเริ่มต้น' },
  video: { en: 'Video', th: 'วิดีโอ' },
}

export const HERO = {
  eyebrow: { en: 'The future of digital experiences', th: 'อนาคตของประสบการณ์ดิจิทัล' },
  title: { en: ['Build Worlds.', 'Shape Experiences.'], th: ['สร้างโลกใบใหม่', 'ออกแบบประสบการณ์'] } as Lines,
  body: {
    en: 'We create immersive digital experiences where AI, games, learning and technology converge.',
    th: 'เราสร้างประสบการณ์ดิจิทัลแบบ Immersive ที่ AI เกม การเรียนรู้ และเทคโนโลยีมาบรรจบกัน',
  },
  cta: { en: 'Explore our universe', th: 'สำรวจจักรวาลของเรา' },
}

export interface TitleCard {
  eyebrow: L
  title: Lines
  intro: L
}

export const TITLES: Record<string, TitleCard> = {
  impact: {
    eyebrow: { en: 'Global impact', th: 'ผลงานระดับโลก' },
    title: { en: ['Trusted across', 'borders.'], th: ['ได้รับความไว้วางใจ', 'ข้ามพรมแดน'] },
    intro: {
      en: 'From UNESCO to Royal Thai Embassies, we turn deep tech into digital social infrastructure — for people, public policy and sustainability.',
      th: 'จาก UNESCO ถึงสถานเอกอัครราชทูตไทย เราเปลี่ยนเทคโนโลยีเชิงลึกให้เป็นโครงสร้างพื้นฐานทางสังคมดิจิทัล เพื่อผู้คน นโยบายสาธารณะ และความยั่งยืน',
    },
  },
  ai: {
    eyebrow: { en: 'AI & conversational avatars', th: 'AI และอวตารสนทนา' },
    title: { en: ['Intelligence with', 'a human face.'], th: ['ปัญญาประดิษฐ์', 'ที่มีใบหน้ามนุษย์'] },
    intro: {
      en: 'Real-time AI avatars that listen, answer and serve — in public services, healthcare, education and restaurants.',
      th: 'AI Avatar ที่ฟัง ตอบ และให้บริการได้แบบเรียลไทม์ ทั้งงานบริการภาครัฐ การแพทย์ การศึกษา และร้านอาหาร',
    },
  },
  metaverse: {
    eyebrow: { en: 'Game-driven metaverse', th: 'เมตาเวิร์สขับเคลื่อนด้วยเกม' },
    title: { en: ['Worlds people', 'gather in.'], th: ['โลกเสมือน', 'ที่ผู้คนมาพบกัน'] },
    intro: {
      en: 'Virtual worlds built with game technology — for learning, communities and events, on PC and mobile.',
      th: 'โลกเสมือนที่สร้างด้วยเทคโนโลยีเกม เพื่อการเรียนรู้ ชุมชน และอีเวนต์ ใช้ได้ทั้งบน PC และมือถือ',
    },
  },
  'soft-power': {
    eyebrow: { en: 'Interactive soft power', th: 'ซอฟต์พาวเวอร์เชิงโต้ตอบ' },
    title: { en: ['Culture you', 'can play.'], th: ['วัฒนธรรม', 'ที่เล่นได้'] },
    intro: {
      en: 'Motion AI, games and stories that carry Thai culture to audiences around the world.',
      th: 'AI จับท่าทาง เกม และเรื่องเล่า ที่พาวัฒนธรรมไทยไปถึงผู้คนทั่วโลก',
    },
  },
}

export const PARTNERS: L[] = [
  { en: 'UNESCO Bangkok', th: 'UNESCO กรุงเทพฯ' },
  { en: 'Royal Thai Embassies', th: 'สถานเอกอัครราชทูตไทย' },
  { en: 'Government Savings Bank', th: 'ธนาคารออมสิน' },
  { en: 'ETDA', th: 'ETDA' },
  { en: 'SOS Thailand', th: 'มูลนิธิ SOS Thailand' },
]

export interface Video {
  youtube: string
  title: L | string
}

export interface Project {
  tag: L
  title: L | string
  body: L
  facts?: { value: L | string; label: L }[]
  chips?: L[]
  award?: L
  /** opens in the video layer */
  videos?: Video[]
  /** external pages (open in a new tab) */
  links?: { label: L | string; href: string }[]
  /** labels pinned to the landmark: anchor name → text */
  hud: { anchor: string; label: L | string; kind?: 'reticle' | 'tag' }[]
}

const AWARD = { en: 'Innovation Cooperation Award', th: 'รางวัล Innovation Cooperation Award' }

export const PROJECTS: Record<string, Project> = {
  oceans: {
    tag: { en: 'UNESCO Regional Office in Bangkok · 2025–26', th: 'สำนักงาน UNESCO ประจำภูมิภาค กรุงเทพฯ · 2025–26' },
    title: 'Sustaining Our Oceans',
    body: {
      en: 'Three interactive exhibitions on ocean sustainability, blending VR/AR, multimedia and gamified learning — designed, built and installed at UNESCO Bangkok, the Ranong Biosphere Reserve and the Children’s Discovery Museum.',
      th: 'นิทรรศการเชิงโต้ตอบ 3 ชุด ว่าด้วยความยั่งยืนของมหาสมุทร ผสาน VR/AR มัลติมีเดีย และการเรียนรู้ผ่านเกม ออกแบบ ผลิต และติดตั้งที่ UNESCO กรุงเทพฯ เขตสงวนชีวมณฑลระนอง และพิพิธภัณฑ์เด็กกรุงเทพมหานคร',
    },
    facts: [
      { value: '3', label: { en: 'interactive exhibitions', th: 'ชุดนิทรรศการ' } },
      { value: '3', label: { en: 'venues, Bangkok & Ranong', th: 'สถานที่ กรุงเทพฯ และระนอง' } },
    ],
    chips: [{ en: 'VR / AR', th: 'VR / AR' }, { en: 'Gamified learning', th: 'เรียนรู้ผ่านเกม' }, { en: 'ESD', th: 'ESD' }],
    links: [{ label: { en: 'See the exhibition', th: 'ชมนิทรรศการ' }, href: 'https://www.facebook.com/share/p/1AqZ3eya95/' }],
    hud: [{ anchor: 'crest', label: 'Sustaining Our Oceans' }],
  },
  'world-stage': {
    tag: { en: 'Royal Thai Embassies · New Delhi · Canberra · Sydney', th: 'สถานเอกอัครราชทูตไทย · นิวเดลี · แคนเบอร์รา · ซิดนีย์' },
    title: { en: 'Thai soft power, on the world stage', th: 'ซอฟต์พาวเวอร์ไทย บนเวทีโลก' },
    body: {
      en: 'At Namaste Thailand Festival 2026 in New Delhi, our real-time AI avatar “Ananya” welcomed visitors in Hindi and English as a digital ambassador for Thai food. Canberra and Sydney followed, with a MetaHuman guide to Thai cuisine and AI Muay Thai.',
      th: 'ในงาน Namaste Thailand Festival 2026 ที่นิวเดลี “อนัญญา” AI Avatar สนทนาแบบเรียลไทม์ของเรา ต้อนรับผู้ชมเป็นภาษาฮินดีและอังกฤษ ในฐานะทูตวัฒนธรรมอาหารไทย ตามด้วยแคนเบอร์ราและซิดนีย์ กับไกด์อาหารไทย MetaHuman และ AI มวยไทย',
    },
    facts: [
      { value: '20,000+', label: { en: 'visitors in New Delhi', th: 'ผู้เข้าร่วมงานที่นิวเดลี' } },
      { value: '3', label: { en: 'cities, two countries', th: 'เมือง ใน 2 ประเทศ' } },
    ],
    award: AWARD,
    hud: [
      { anchor: 'bangkok', label: { en: 'Bangkok', th: 'กรุงเทพฯ' }, kind: 'tag' },
      { anchor: 'delhi', label: { en: 'New Delhi', th: 'นิวเดลี' }, kind: 'tag' },
      { anchor: 'sydney', label: { en: 'Canberra · Sydney', th: 'แคนเบอร์รา · ซิดนีย์' }, kind: 'tag' },
    ],
  },
  quantumsoul: {
    tag: { en: 'Conversational AI platform', th: 'แพลตฟอร์ม Conversational AI' },
    title: 'QuantumSoul.ai',
    body: {
      en: 'Real-time, RAG-based AI avatars for public services, healthcare and education. They take routine questions off people’s desks and make essential information easier for everyone to reach.',
      th: 'AI Avatar สนทนาแบบเรียลไทม์ (RAG-based) สำหรับงานบริการภาครัฐ การแพทย์ และการศึกษา ช่วยลดภาระงานของบุคลากร และทำให้ประชาชนเข้าถึงข้อมูลสำคัญได้ง่ายขึ้น',
    },
    chips: [{ en: 'Real-time voice', th: 'สนทนาด้วยเสียงแบบเรียลไทม์' }, { en: 'RAG', th: 'RAG' }, { en: 'Public service · Healthcare · Education', th: 'บริการภาครัฐ · การแพทย์ · การศึกษา' }],
    videos: [
      { youtube: 'YSEisHM9bWI', title: 'QuantumSoul AI' },
      { youtube: '2ICRldCezdY', title: { en: 'AI avatar for SCB Academy', th: 'AI Avatar เพื่อการศึกษา SCB Academy' } },
    ],
    links: [{ label: 'quantumsoul.ai', href: 'https://www.quantumsoul.ai/' }],
    hud: [{ anchor: 'temple', label: 'QuantumSoul.ai' }],
  },
  foody: {
    tag: { en: 'AI for restaurants · Zero food waste', th: 'AI สำหรับร้านอาหาร · Zero Food Waste' },
    title: 'Foody AI & Spark',
    body: {
      en: 'Foody AI gives restaurants live commerce, personal menu picks and customer insight, linked to cloud POS in real time. Its sibling “Wasty”, part of Spark the World, connects restaurants with SOS Thailand to pass surplus food to schools and children in remote areas.',
      th: 'Foody AI เพิ่ม AI Live Commerce การแนะนำเมนูเฉพาะบุคคล และการวิเคราะห์พฤติกรรมลูกค้าให้ร้านอาหาร เชื่อมต่อ POS บนคลาวด์แบบเรียลไทม์ ส่วน “Wasty” ในโครงการ Spark the World เชื่อมร้านอาหารกับมูลนิธิ SOS Thailand เพื่อส่งต่ออาหารส่วนเกินให้โรงเรียนและเด็กในพื้นที่ห่างไกล',
    },
    chips: [{ en: 'AI live commerce', th: 'AI Live Commerce' }, { en: 'Cloud POS', th: 'Cloud POS' }, { en: 'with SOS Thailand', th: 'ร่วมกับมูลนิธิ SOS' }],
    award: AWARD,
    links: [
      { label: { en: 'Watch Foody AI', th: 'ชม Foody AI' }, href: 'https://www.facebook.com/share/p/1AjffgsLkz/' },
      { label: 'sparkworld.org', href: 'https://sos.sparkworld.org/' },
    ],
    hud: [{ anchor: 'food', label: 'Foody AI' }],
  },
  edenverden: {
    tag: { en: 'Metaverse platform', th: 'แพลตฟอร์มเมตาเวิร์ส' },
    title: 'EdenVerden.io',
    body: {
      en: 'A metaverse simulation platform for immersive learning and organisations: explore, train and meet inside one shared world, on PC or mobile.',
      th: 'แพลตฟอร์มจำลองสถานการณ์บนเมตาเวิร์ส เพื่อการเรียนรู้แบบ Immersive และองค์กร สำรวจ ฝึกฝน และพบปะกันในโลกเดียว ทั้งบน PC และมือถือ',
    },
    chips: [{ en: 'Simulation learning', th: 'เรียนรู้ผ่านการจำลอง' }, { en: 'PC · Mobile', th: 'PC · มือถือ' }],
    videos: [
      { youtube: 'DZMgwInSkCw', title: 'EdenVerden' },
      { youtube: 'Yydgj4exnXU', title: 'EdenVerden 2' },
    ],
    hud: [{ anchor: 'town', label: 'EdenVerden.io' }],
  },
  aomunity: {
    tag: { en: 'Government Savings Bank (GSB)', th: 'ธนาคารออมสิน' },
    title: 'Aomunity',
    body: {
      en: 'Commissioned by the Government Savings Bank, we built the Aomunity virtual world with its games and activities, and led the marketing that grew its community. Digital social infrastructure, in practice.',
      th: 'ธนาคารออมสินไว้วางใจให้เราพัฒนาโลกเสมือน “Aomunity” พร้อมเกมและกิจกรรมภายใน และวางกลยุทธ์การตลาดเพื่อสร้างชุมชน — โครงสร้างพื้นฐานทางสังคมดิจิทัลที่เกิดขึ้นจริง',
    },
    chips: [
      { en: 'Metaverse development', th: 'พัฒนาเมตาเวิร์ส' },
      { en: 'Interactive content', th: 'คอนเทนต์เชิงโต้ตอบ' },
      { en: 'Strategic marketing', th: 'กลยุทธ์การตลาด' },
    ],
    videos: [
      { youtube: 'M07LcDHVl6o', title: { en: 'DGT2023 hybrid metaverse event · ETDA', th: 'อีเวนต์ไฮบริดบนเมตาเวิร์ส DGT2023 · ETDA' } },
      { youtube: 'PuCVxuGzwIM', title: 'Christmas Give with Love' },
    ],
    hud: [{ anchor: 'coins', label: 'Aomunity × GSB' }],
  },
  'muay-thai': {
    tag: { en: 'AI pose estimation · Wellness', th: 'AI วิเคราะห์ท่าทาง · สุขภาพ' },
    title: 'AI Kru Muay Thai',
    body: {
      en: 'Train authentic Muay Thai with a virtual master. Real-time pose estimation follows every stance and strike, set against Thailand’s famous landmarks.',
      th: 'ฝึกแม่ไม้มวยไทยกับครูมวยเสมือนจริง ระบบ AI Pose Estimation วิเคราะห์ทุกท่วงท่าแบบเรียลไทม์ ท่ามกลางฉากสถานที่สำคัญของไทย',
    },
    facts: [
      { value: '>90%', label: { en: 'pose accuracy', th: 'ความแม่นยำของท่าทาง' } },
      { value: '2026', label: { en: 'Canberra & Sydney', th: 'แคนเบอร์รา และซิดนีย์' } },
    ],
    videos: [{ youtube: '8yMRNW6bfm0', title: 'Muay Thai Wellness' }],
    links: [{ label: { en: 'In the news', th: 'ข่าว' }, href: 'https://www.facebook.com/share/p/18t5Dnx5Qh/' }],
    hud: [{ anchor: 'knee', label: { en: 'Pose · 90%+ accuracy', th: 'ท่าทาง · แม่นยำ 90%+' } }],
  },
  'mystery-jars': {
    tag: { en: 'Narrative games · Festivals · Learning', th: 'เกมเล่าเรื่อง · เทศกาล · การเรียนรู้' },
    title: 'Mistertel’s Mystery Jars',
    body: {
      en: 'An immersive mystery game of puzzles and storytelling. Alongside it: Himmaphan Beast Online for the International Sand Sculpture Festival 2024, and Tai Kong, game-based learning about careers, culture and local identity for Samut Sakhon.',
      th: 'เกมปริศนาแบบ Immersive ที่ผสานการไขปริศนาและการเล่าเรื่อง พร้อมด้วย Himmaphan Beast Online เกมสำหรับเทศกาลประติมากรรมทรายนานาชาติ 2024 และ Tai Kong เกมเพื่อการเรียนรู้ด้านอาชีพ วัฒนธรรม และอัตลักษณ์ท้องถิ่นของจังหวัดสมุทรสาคร',
    },
    videos: [
      { youtube: 'J2QWXV3BMbY', title: 'Mystery Jars' },
      { youtube: 'cU3RPnptdGY', title: 'Himmaphan Beast Online' },
      { youtube: 'qZRlmGGY7AE', title: 'Tai Kong' },
    ],
    hud: [{ anchor: 'mouth', label: 'Mystery Jars' }],
  },
}

export const CHOICE = {
  eyebrow: { en: 'Build with us', th: 'ร่วมสร้างกับเรา' },
  title: { en: ['Choose', 'your path.'], th: ['เลือก', 'เส้นทางของคุณ'] } as Lines,
  intro: {
    en: 'Three kinds of partners, one shared goal: technology that helps people grow.',
    th: 'พันธมิตรสามแบบ เป้าหมายเดียวกัน คือเทคโนโลยีที่ช่วยให้ผู้คนเติบโต',
  },
  options: [
    {
      label: { en: 'Government & institutions', th: 'ภาครัฐและองค์กรสากล' },
      message: {
        en: 'Digital infrastructure for human development, public policy and sustainability.',
        th: 'โครงสร้างพื้นฐานดิจิทัลเพื่อการพัฒนาคน นโยบายสาธารณะ และความยั่งยืน',
      },
      refs: [
        { en: 'UNESCO “Sustaining Our Oceans”', th: 'UNESCO “Sustaining Our Oceans”' },
        { en: 'Royal Thai Embassies, soft power', th: 'สถานเอกอัครราชทูตไทย (Soft Power)' },
        { en: 'Aomunity × GSB', th: 'Aomunity × ธนาคารออมสิน' },
      ],
      cta: { label: { en: 'Start a conversation', th: 'เริ่มคุยกับเรา' }, to: 'contact' },
    },
    {
      label: { en: 'Business', th: 'ภาคธุรกิจ' },
      message: {
        en: 'Deep tech that raises efficiency, cuts costs and builds engagement.',
        th: 'นวัตกรรม Deep-Tech ที่เพิ่มประสิทธิภาพ ลดต้นทุน และสร้างการมีส่วนร่วม',
      },
      refs: [
        { en: 'Foody AI for restaurants', th: 'Foody AI สำหรับร้านอาหาร' },
        { en: 'QuantumSoul.ai', th: 'QuantumSoul.ai' },
        { en: 'Office automation on Gather.town', th: 'ระบบอัตโนมัติสำนักงานบน Gather.town' },
      ],
      cta: { label: { en: 'Start a conversation', th: 'เริ่มคุยกับเรา' }, to: 'contact' },
    },
    {
      label: { en: 'Universities & talent', th: 'มหาวิทยาลัยและคนรุ่นใหม่' },
      message: {
        en: 'A real field to prove yourself: real work, real problems, real growth — on a global stage.',
        th: 'พื้นที่ปล่อยของ ลงมือทำจริง แก้ปัญหาจริง โตจริง บนสนามระดับโลก',
      },
      refs: [
        { en: 'Co-Working Challenge with SPU', th: 'Co-Working Challenge ร่วมกับ SPU' },
        { en: 'Cooperative education', th: 'สหกิจศึกษา' },
        { en: 'AI research', th: 'งานวิจัย AI' },
      ],
      cta: { label: { en: 'See careers', th: 'ดูการร่วมงาน' }, to: 'careers' },
    },
  ],
}

export const VALUES = {
  eyebrow: { en: 'Our values', th: 'ค่านิยมของเรา' },
  title: { en: ['Six letters.', 'One direction.'], th: ['หกตัวอักษร', 'หนึ่งทิศทาง'] } as Lines,
  items: [
    {
      letter: 'A',
      name: { en: 'Agile innovation', th: 'นวัตกรรมคล่องตัว' },
      text: { en: 'We build and adapt deep tech quickly, to keep pace with a changing world.', th: 'สร้างสรรค์และปรับเทคโนโลยีเชิงลึกอย่างรวดเร็ว ให้ทันต่อการเปลี่ยนแปลงของโลก' },
    },
    {
      letter: 'S',
      name: { en: 'Social infrastructure', th: 'โครงสร้างพื้นฐานสังคม' },
      text: { en: 'AI, games and metaverse that lift society, improve lives and solve real problems.', th: 'สร้าง AI เกม และเมตาเวิร์ส เพื่อยกระดับสังคม พัฒนาคุณภาพชีวิต และแก้ปัญหาจริง' },
    },
    {
      letter: 'C',
      name: { en: 'Co-creation', th: 'การร่วมสร้างสรรค์' },
      text: { en: 'We build with partners across government, business, academia and global organisations.', th: 'ผนึกกำลังกับพันธมิตรทุกภาคส่วน ทั้งภาครัฐ เอกชน สถาบันการศึกษา และองค์กรระดับสากล' },
    },
    {
      letter: 'E',
      name: { en: 'Empowerment', th: 'การเสริมพลังผู้คน' },
      text: { en: 'Technology, psychology and art that bring out what people can do.', th: 'ใช้เทคโนโลยี จิตวิทยา และศิลปะ ดึงศักยภาพและยกระดับคุณค่าของผู้คน' },
    },
    {
      letter: 'N',
      name: { en: 'Next-gen tech', th: 'เทคโนโลยียุคใหม่ที่จับต้องได้' },
      text: { en: 'Deep AI and immersive media that work in the real world, not only in demos.', th: 'พัฒนา AI และ Immersive Media เชิงลึก ที่นำไปใช้งานได้จริง' },
    },
    {
      letter: 'D',
      name: { en: 'Deep impact', th: 'ผลกระทบที่ยั่งยืน' },
      text: { en: 'Positive, lasting results you can measure, at home and around the world.', th: 'สร้างผลลัพธ์เชิงบวกที่ลึกซึ้ง ยั่งยืน และวัดผลได้จริง ทั้งระดับประเทศและสากล' },
    },
  ],
}

export const CAREERS = {
  eyebrow: { en: 'Careers', th: 'ร่วมงานกับเรา' },
  title: { en: ['Grow with', 'Ascend.'], th: ['เติบโตไปกับ', 'Ascend'] } as Lines,
  intro: {
    en: 'Real field, global stage. Students and new talent work on live projects, from national programmes to festivals abroad.',
    th: 'สนามจริง เวทีระดับโลก นักศึกษาและคนรุ่นใหม่ได้ลงมือทำโปรเจกต์จริง ตั้งแต่โครงการระดับประเทศจนถึงเทศกาลในต่างประเทศ',
  },
  facts: [
    { value: '8', label: { en: 'project tracks', th: 'แทร็กโปรเจกต์' } },
    { value: '12', label: { en: 'people, one lean team', th: 'คน ทีมเล็กที่คล่องตัว' } },
    { value: '2019', label: { en: 'founded', th: 'ปีที่ก่อตั้ง' } },
  ],
  program: {
    en: 'The Ascend Co-Working Challenge runs with Sripatum University (SPU): cooperative education and AI research, in our Bangna office and on Gather.town.',
    th: 'โครงการ Ascend Co-Working Challenge ร่วมกับมหาวิทยาลัยศรีปทุม (SPU) ทั้งสหกิจศึกษาและงานวิจัย AI ทำงานทั้งที่ออฟฟิศบางนาและบน Gather.town',
  },
  apply: { en: 'Join the Co-Working Challenge', th: 'สมัคร Co-Working Challenge' },
  talk: { en: 'Talk to us', th: 'คุยกับเรา' },
}

export const CONTACT = {
  eyebrow: { en: 'Let’s talk', th: 'คุยกับเรา' },
  title: { en: ['Let’s build', 'your world.'], th: ['มาสร้างโลก', 'ของคุณด้วยกัน'] } as Lines,
  body: {
    en: 'Tell us what you want to create. Visit us in Bangna, Bangkok, or drop by our virtual office.',
    th: 'เล่าให้เราฟังว่าคุณอยากสร้างอะไร แวะมาที่ออฟฟิศบางนา หรือเข้ามาที่ออฟฟิศเสมือนของเรา',
  },
  office: { en: 'Office', th: 'ออฟฟิศ' },
  follow: { en: 'Follow', th: 'ติดตาม' },
  website: { en: 'Website', th: 'เว็บไซต์' },
}
