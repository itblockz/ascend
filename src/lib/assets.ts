// Every slot below has a coded stand-in, so the site runs with an empty
// public/assets folder. Drop a real file at the listed path and it takes over.
// Specs for each file: public/assets/README.md

const pad = (n: number) => String(n).padStart(3, '0')

export const HERO_FRAME_COUNT = 240
export const LAYERS_FRAME_COUNT = 24

export const heroFrames = Array.from({ length: HERO_FRAME_COUNT }, (_, i) => `/assets/frames_hero/frame-${pad(i + 1)}.webp`)

export const layerFrames = Array.from({ length: LAYERS_FRAME_COUNT }, (_, i) => `/assets/frames_layers/frame-${pad(i + 1)}.webp`)

export const ASSETS = {
  loopVideoMp4: '/assets/ascend_loop.mp4',
  loopVideoWebm: '/assets/ascend_loop.webm',
  platformQuantumSoul: '/assets/platform_quantumsoul.png',
  platformEdenVerden: '/assets/platform_edenverden.png',
  platformKruMuayThai: '/assets/platform_krumuaythai.png',
  galleryNewDelhi: '/assets/gallery_newdelhi.jpg',
  galleryAustralia: '/assets/gallery_canberra_sydney.jpg',
  galleryUnesco: '/assets/gallery_unesco.jpg',
} as const

/** Partner logos: /assets/logos/<id>.svg — shown as wordmarks until present. */
export const logoPath = (id: string) => `/assets/logos/${id}.svg`
