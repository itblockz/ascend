// Every image slot below shows a coded placeholder until the real file is
// dropped at the listed path. Specs for each file: public/assets/README.md

export const ASSETS = {
  platformQuantumSoul: '/assets/platform_quantumsoul.png',
  platformEdenVerden: '/assets/platform_edenverden.png',
  platformKruMuayThai: '/assets/platform_krumuaythai.png',
  galleryNewDelhi: '/assets/gallery_newdelhi.jpg',
  galleryAustralia: '/assets/gallery_canberra_sydney.jpg',
  galleryUnesco: '/assets/gallery_unesco.jpg',
} as const

/** Partner logos: /assets/logos/<id>.svg — shown as wordmarks until present. */
export const logoPath = (id: string) => `/assets/logos/${id}.svg`
