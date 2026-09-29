// Every image slot below shows a coded placeholder until the real file is
// dropped at the listed path. Specs for each file: public/assets/README.md

const B = import.meta.env.BASE_URL

export const ASSETS = {
  platformQuantumSoul: B + 'assets/platform_quantumsoul.png',
  platformEdenVerden: B + 'assets/platform_edenverden.png',
  platformKruMuayThai: B + 'assets/platform_krumuaythai.png',
  galleryNewDelhi: B + 'assets/gallery_newdelhi.jpg',
  galleryAustralia: B + 'assets/gallery_canberra_sydney.jpg',
  galleryUnesco: B + 'assets/gallery_unesco.jpg',
} as const

/** Partner logos: /assets/logos/<id>.svg — shown as wordmarks until present. */
export const logoPath = (id: string) => `${B}assets/logos/${id}.svg`
