'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AppNavProps {
  role?: 'client' | 'admin'
  email?: string
}

export function AppNav({ role, email }: AppNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-[rgba(196,204,216,0.06)] px-6 py-4 flex items-center justify-between"
      style={{ background: 'rgba(11,13,26,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="flex items-center gap-8">
        <a href={role === 'admin' ? '/admin' : '/dashboard'}
          className="font-heading text-xs tracking-[0.2em] uppercase text-corona">
          Elequint
        </a>
        <div className="flex items-center gap-6">
          {role === 'admin' ? (
            <>
              <a href="/admin" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Commissions</a>
              <a href="/portfolio" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Portfolio</a>
            </>
          ) : (
            <>
              <a href="/dashboard" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Projects</a>
              <a href="/commission" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">New Commission</a>
              <a href="/portfolio" className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">Portfolio</a>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {email && (
          <span className="font-mono-brand text-[0.48rem] tracking-[0.2em] text-silver hidden sm:block">{email}</span>
        )}
        {role === 'admin' && (
          <span className="font-mono-brand text-[0.46rem] tracking-[0.3em] uppercase text-corona border border-[rgba(232,184,109,0.3)] px-2 py-0.5">Admin</span>
        )}
        <button onClick={handleSignOut}
          className="font-mono-brand text-[0.5rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">
          Sign out
        </button>
      </div>
    </nav>
  )
}
