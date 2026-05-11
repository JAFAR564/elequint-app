'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(
    searchParams.get('error') === 'auth_failed'
      ? 'Sign-in link expired or already used. Request a new one below.'
      : ''
  )

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

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
    <>
      {!sent ? (
        <div className="space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-surface border border-[rgba(196,204,216,0.12)] text-crystal px-4 py-3 text-sm font-light hover:border-[rgba(196,204,216,0.3)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(196,204,216,0.08)]" />
            <span className="font-mono-brand text-[0.45rem] tracking-[0.25em] uppercase text-silver opacity-50">or</span>
            <div className="flex-1 h-px bg-[rgba(196,204,216,0.08)]" />
          </div>

          {/* Magic link */}
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
                className="w-full bg-surface border border-[rgba(196,204,216,0.12)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors"
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
        </div>
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
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(232,184,109,0.04) 0%, transparent 60%), var(--void)' }}>

      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`
      }} />

      <div className="w-full max-w-sm animate-fade-up relative z-10">
        <div className="text-center mb-10">
          <div className="label-mono mb-4">Eclipse of Legacies</div>
          <h1 className="font-heading text-2xl tracking-widest text-white mb-2">Elequint</h1>
          <p className="text-sm text-silver font-light">Client portal access</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="mt-8 text-center">
          <a href="/commission" className="text-xs text-silver hover:text-corona transition-colors font-mono-brand tracking-wider uppercase">
            New commission →
          </a>
        </div>
      </div>
    </div>
  )
}
