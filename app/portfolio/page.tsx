const CASES = [
  {
    id: 'aetherborne-saga',
    title: 'Aetherborne Saga',
    genre: 'High Fantasy',
    platform: 'Discord',
    tier: 'Presence',
    stat1: '1,400 writers',
    stat2: '6 factions',
    stat3: '200+ lore entries',
    desc: 'High-fantasy political RP. Branched lore archive, faction showcase, and writer recruitment hub spanning six sovereign factions.',
    link: 'https://elequint-website.vercel.app/aetherborne-saga.html',
    color: '#c8813a',
  },
  {
    id: 'crimson-court',
    title: 'The Crimson Court',
    genre: 'Urban Fantasy',
    platform: 'Facebook',
    tier: 'Foundation',
    stat1: '3 years live',
    stat2: '600+ applicants filtered',
    stat3: 'Continuous lore expansion',
    desc: 'Vampire dynasty in modern London. Recruitment hub with embedded application form and integrated lore archive.',
    link: null,
    color: '#8a3a3a',
  },
  {
    id: 'voidshore-codex',
    title: 'Voidshore Codex',
    genre: 'Sci-Fi',
    platform: 'Discord · Reddit',
    tier: 'Architecture',
    stat1: '2,200 members',
    stat2: '14 ship classes',
    stat3: 'Full application system',
    desc: 'Interstellar exploration RP with character progression, ship registry, and multi-platform cross-posting infrastructure.',
    link: null,
    color: '#3a5a8a',
  },
]

const TIER_PRICE: Record<string, string> = { Foundation: '$5', Presence: '$10', Architecture: 'Custom' }

export default function PortfolioPage() {
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,184,109,0.03) 0%, transparent 60%), var(--void)'
    }}>
      <nav className="border-b border-[rgba(196,204,216,0.06)] px-4 md:px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(11,13,26,0.9)', backdropFilter: 'blur(16px)' }}>
        <a href="https://elequint-website.vercel.app" className="font-heading text-xs tracking-[0.2em] uppercase text-corona">Elequint</a>
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/commission" className="font-mono-brand text-[0.5rem] md:text-[0.52rem] tracking-[0.22em] md:tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Commission</a>
          <a href="/auth/login" className="font-mono-brand text-[0.5rem] md:text-[0.52rem] tracking-[0.22em] md:tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Login</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="mb-10 md:mb-14 text-center">
          <div className="label-mono mb-4">Recent Architecture</div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-widest text-white mb-4">Portfolio</h1>
          <p className="text-silver text-sm font-light max-w-lg mx-auto leading-relaxed">
            Web presence built for roleplay communities. Each project is purpose-built — no templates, no compromises.
          </p>
        </div>

        <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)] border border-[rgba(196,204,216,0.06)]">
          {CASES.map(c => (
            <div key={c.id} className="bg-abyss p-6 md:p-8 relative overflow-hidden group">
              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.color}60, transparent)` }} />

              {/* Mobile: stacked. Desktop: 2/3 + 1/3 grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:items-start">
                <div className="md:col-span-2">
                  {/* Genre/platform badges */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono-brand text-[0.46rem] md:text-[0.48rem] tracking-[0.25em] md:tracking-[0.3em] uppercase px-2 py-0.5 border" style={{ color: c.color, borderColor: `${c.color}40` }}>{c.genre}</span>
                    <span className="font-mono-brand text-[0.44rem] md:text-[0.46rem] tracking-[0.22em] md:tracking-[0.25em] uppercase text-silver">{c.platform}</span>
                  </div>

                  {/* Title + tier price (mobile shows price inline next to title for compactness) */}
                  <div className="flex items-baseline justify-between gap-4 mb-3 md:block">
                    <h2 className="font-heading text-lg md:text-xl tracking-widest text-white">{c.title}</h2>
                    <div className="md:hidden font-heading text-xl flex-shrink-0" style={{ color: c.color }}>{TIER_PRICE[c.tier]}</div>
                  </div>

                  <p className="text-silver text-sm font-light leading-relaxed mb-5">{c.desc}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6">
                    {[c.stat1, c.stat2, c.stat3].map(s => (
                      <span key={s} className="font-mono-brand text-[0.46rem] md:text-[0.48rem] tracking-[0.2em] uppercase text-silver">
                        <span style={{ color: c.color }}>—</span> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sidebar (tier + button). On mobile, button is full-width, tier is hidden (shown inline above). */}
                <div className="md:text-right flex flex-col md:items-end md:justify-between md:h-full gap-4">
                  {/* Tier label/price block — only on desktop */}
                  <div className="hidden md:block">
                    <div className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver mb-1">{c.tier}</div>
                    <div className="font-heading text-2xl" style={{ color: c.color }}>{TIER_PRICE[c.tier]}</div>
                  </div>

                  {/* Tier label on mobile (just the name) */}
                  <div className="md:hidden font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver">{c.tier} tier</div>

                  {c.link ? (
                    <a href={c.link} target="_blank" rel="noopener noreferrer"
                      className="font-heading text-[0.58rem] tracking-[0.2em] uppercase text-void bg-corona px-5 py-3 hover:bg-white transition-colors text-center md:inline-block w-full md:w-auto">
                      View Showcase →
                    </a>
                  ) : (
                    <span className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver border border-[rgba(196,204,216,0.1)] px-4 py-2.5 text-center md:inline-block w-full md:w-auto">
                      Case Study Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <div className="label-mono mb-6">Start your project</div>
          <a href="/commission"
            className="font-heading text-[0.62rem] md:text-[0.68rem] tracking-[0.22em] md:tracking-[0.25em] uppercase text-void bg-corona px-6 md:px-8 py-3 md:py-4 hover:bg-white transition-colors inline-block">
            Commission Your Build
          </a>
        </div>
      </div>
    </div>
  )
}
