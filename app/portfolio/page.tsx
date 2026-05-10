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
      <nav className="border-b border-[rgba(196,204,216,0.06)] px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(11,13,26,0.9)', backdropFilter: 'blur(16px)' }}>
        <a href="https://elequint-website.vercel.app" className="font-heading text-xs tracking-[0.2em] uppercase text-corona">Elequint</a>
        <div className="flex items-center gap-6">
          <a href="/commission" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Commission</a>
          <a href="/auth/login" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Client Login</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-14 text-center">
          <div className="label-mono mb-4">Recent Architecture</div>
          <h1 className="font-heading text-3xl tracking-widest text-white mb-4">Portfolio</h1>
          <p className="text-silver text-sm font-light max-w-lg mx-auto leading-relaxed">
            Web presence built for roleplay communities. Each project is purpose-built — no templates, no compromises.
          </p>
        </div>

        <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)] border border-[rgba(196,204,216,0.06)]">
          {CASES.map(c => (
            <div key={c.id} className="bg-abyss p-8 relative overflow-hidden group">
              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.color}60, transparent)` }} />

              <div className="grid grid-cols-3 gap-8 items-start">
                <div className="col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono-brand text-[0.48rem] tracking-[0.3em] uppercase px-2 py-0.5 border" style={{ color: c.color, borderColor: `${c.color}40` }}>{c.genre}</span>
                    <span className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver">{c.platform}</span>
                  </div>
                  <h2 className="font-heading text-xl tracking-widest text-white mb-3">{c.title}</h2>
                  <p className="text-silver text-sm font-light leading-relaxed mb-5">{c.desc}</p>
                  <div className="flex items-center gap-6">
                    {[c.stat1, c.stat2, c.stat3].map(s => (
                      <span key={s} className="font-mono-brand text-[0.48rem] tracking-[0.2em] uppercase text-silver">
                        <span style={{ color: c.color }}>—</span> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end justify-between h-full gap-4">
                  <div>
                    <div className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver mb-1">{c.tier}</div>
                    <div className="font-heading text-2xl" style={{ color: c.color }}>{TIER_PRICE[c.tier]}</div>
                  </div>
                  {c.link ? (
                    <a href={c.link} target="_blank" rel="noopener noreferrer"
                      className="font-heading text-[0.58rem] tracking-[0.2em] uppercase text-void bg-corona px-5 py-2.5 hover:bg-white transition-colors inline-block">
                      View Showcase →
                    </a>
                  ) : (
                    <span className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver border border-[rgba(196,204,216,0.1)] px-4 py-2">
                      Case Study Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="label-mono mb-6">Start your project</div>
          <a href="/commission"
            className="font-heading text-[0.68rem] tracking-[0.25em] uppercase text-void bg-corona px-8 py-4 hover:bg-white transition-colors inline-block">
            Commission Your Build
          </a>
        </div>
      </div>
    </div>
  )
}
