'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AppNavProps {
  role?: 'client' | 'admin'
  email?: string
}

export function AppNav({ role, email }: AppNavProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const links = role === 'admin'
    ? [
        { href: '/admin', label: 'Dashboard' },
        { href: '/portfolio', label: 'Portfolio' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/commission', label: 'New Commission' },
        { href: '/portfolio', label: 'Portfolio' },
      ]

  return (
    <nav className="border-b border-[rgba(196,204,216,0.06)] relative"
      style={{ background: 'rgba(11,13,26,0.9)', backdropFilter: 'blur(16px)' }}>

      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo + desktop links */}
        <div className="flex items-center gap-6 md:gap-8">
          <a href={role === 'admin' ? '/admin' : '/dashboard'}
            className="font-heading text-xs tracking-[0.2em] uppercase text-corona">
            Elequint
          </a>
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4">
          {email && (
            <span className="font-mono-brand text-[0.48rem] tracking-[0.2em] text-silver hidden lg:block">{email}</span>
          )}
          {role === 'admin' && (
            <span className="font-mono-brand text-[0.46rem] tracking-[0.3em] uppercase text-corona border border-[rgba(232,184,109,0.3)] px-2 py-0.5 hidden sm:inline-block">Admin</span>
          )}
          <button onClick={handleSignOut}
            className="font-mono-brand text-[0.5rem] tracking-[0.25em] uppercase text-silver hover:text-white transition-colors hidden md:block">
            Sign out
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            className="md:hidden p-2 -mr-2 text-silver hover:text-corona transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(196,204,216,0.06)] animate-fade-up"
          style={{ background: 'rgba(7,8,15,0.96)', backdropFilter: 'blur(16px)' }}>
          <div className="px-4 py-5 flex flex-col gap-4">
            {links.map(l => (
              <a key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono-brand text-[0.6rem] tracking-[0.28em] uppercase text-silver hover:text-corona transition-colors">
                {l.label}
              </a>
            ))}
            <div className="h-px bg-[rgba(196,204,216,0.06)] my-1" />
            {email && (
              <span className="font-mono-brand text-[0.5rem] tracking-[0.18em] text-silver opacity-70 break-all">{email}</span>
            )}
            <button onClick={handleSignOut}
              className="font-mono-brand text-[0.6rem] tracking-[0.28em] uppercase text-silver hover:text-corona transition-colors text-left">
              Sign out →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
