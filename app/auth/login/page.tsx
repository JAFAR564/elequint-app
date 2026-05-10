'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(232,184,109,0.04) 0%, transparent 60%), var(--void)' }}>

      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`
      }} />

      <div className="w-full max-w-sm animate-fade-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="label-mono mb-4">Eclipse of Legacies</div>
          <h1 className="font-heading text-2xl tracking-widest text-white mb-2">Elequint</h1>
          <p className="text-sm text-silver font-light">Client portal access</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-surface border border-[var(--border)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors"
                style={{ borderColor: 'rgba(196,204,216,0.12)' }}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono-brand tracking-wider">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-heading text-[0.62rem] tracking-[0.22em] uppercase text-void bg-corona py-3 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>

            <p className="text-center text-xs text-silver font-light pt-2">
              No password. We&apos;ll email you a secure link.
            </p>
          </form>
        ) : (
          <div className="text-center border border-[rgba(232,184,109,0.2)] p-8"
            style={{ background: 'rgba(232,184,109,0.04)' }}>
            <div className="label-mono mb-4">Check your inbox</div>
            <p className="text-crystal text-sm font-light leading-relaxed mb-4">
              A magic link was sent to<br />
              <span className="text-corona">{email}</span>
            </p>
            <p className="text-silver text-xs font-light">
              The link expires in 1 hour. Check your spam folder if it doesn&apos;t arrive.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-xs text-silver hover:text-corona transition-colors font-mono-brand tracking-wider uppercase"
            >
              Use different email
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/commission" className="text-xs text-silver hover:text-corona transition-colors font-mono-brand tracking-wider uppercase">
            New commission →
          </a>
        </div>
      </div>
    </div>
  )
}
