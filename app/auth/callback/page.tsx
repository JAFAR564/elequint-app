'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { EmailOtpType } from '@supabase/supabase-js'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function handleAuth() {
      const params = new URLSearchParams(window.location.search)
      const token_hash = params.get('token_hash')
      const type = params.get('type') as EmailOtpType | null
      const code = params.get('code')
      const next = params.get('next') ?? '/dashboard'

      // OTP magic link flow
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (!error) { router.replace(next); return }
      }

      // PKCE flow
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) { router.replace(next); return }
      }

      // Hash-based implicit flow — session already set by supabase-js from the fragment
      const { data: { session } } = await supabase.auth.getSession()
      if (session) { router.replace(next); return }

      setError(true)
    }

    handleAuth()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--void)' }}>
        <p className="text-red-400 font-mono-brand text-xs tracking-widest uppercase">Sign-in failed</p>
        <a href="/auth/login" className="text-corona font-mono-brand text-xs tracking-widest uppercase hover:text-white transition-colors">
          Try again →
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--void)' }}>
      <p className="text-silver font-mono-brand text-xs tracking-[0.3em] uppercase animate-pulse">Signing you in…</p>
    </div>
  )
}
