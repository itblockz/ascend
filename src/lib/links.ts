// External destinations. '#' means "not supplied yet" — the UI shows these
// links but they go nowhere until a real URL is filled in.

export const LINKS = {
  website: 'https://www.ascendgroup.asia',
  // TODO: Gather.town virtual office URL
  virtualOffice: '#',
  // TODO: Google Form for the Ascend Co-Working Challenge
  coWorkingForm: '#',
  // TODO: careers / open roles page
  careers: '#',
  // TODO: contact email, e.g. 'mailto:hello@example.com'
  contactEmail: '#',
  platforms: {
    quantumSoul: 'https://quantumsoul.ai',
    edenVerden: 'https://edenverden.io',
    kruMuayThai: '#', // TODO
  },
  // TODO: Facebook page URLs
  social: [
    { name: 'Ascend Group Asia', href: '#' },
    { name: 'V360 Metaverse', href: '#' },
    { name: 'Eden Arts Studio', href: '#' },
    { name: 'LifeHack360', href: '#' },
    { name: 'Quantum Soul AI', href: '#' },
    { name: 'Mystery Jars', href: '#' },
  ],
} as const

/** Props for an external anchor; '#' links stay inert instead of jumping to top. */
export function extLink(href: string) {
  if (href === '#') return { href: '#', onClick: (e: { preventDefault: () => void }) => e.preventDefault(), 'aria-disabled': true }
  return { href, target: '_blank', rel: 'noopener noreferrer' }
}
