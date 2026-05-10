export default function CommissionSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,184,109,0.04) 0%, transparent 60%), var(--void)'
    }}>
      <div className="text-center max-w-md animate-fade-up">
        <div className="label-mono mb-8">Commission received</div>
        <h1 className="font-display text-4xl text-white mb-6" style={{ fontFamily: 'var(--font-cinzel-decorative)' }}>
          We&apos;ve got it.
        </h1>
        <p className="text-silver text-sm font-light leading-relaxed mb-8">
          Your commission is in the queue. Check your email — we sent a magic link so you can log in and track status at any time.
          <br /><br />
          We typically review within <span className="text-corona">24–48 hours</span>.
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/dashboard" className="font-heading text-[0.62rem] tracking-[0.22em] uppercase text-void bg-corona px-6 py-3 hover:bg-white transition-colors">
            View Dashboard
          </a>
          <a href="https://elequint-website.vercel.app" className="font-heading text-[0.62rem] tracking-[0.22em] uppercase text-crystal border border-[rgba(196,204,216,0.2)] px-6 py-3 hover:border-corona hover:text-corona transition-colors">
            Back to Site
          </a>
        </div>
      </div>
    </div>
  )
}
