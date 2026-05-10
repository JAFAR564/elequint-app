'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="text-center max-w-md animate-fade-up">
      <div className="label-mono mb-8">Commission received</div>
      <h1 className="font-display text-4xl text-white mb-6" style={{ fontFamily: 'var(--font-cinzel-decorative)' }}>
        We&apos;ve got it.
      </h1>
      <p className="text-silver text-sm font-light leading-relaxed mb-2">
        Your commission is in the queue. We typically review within{' '}
        <span className="text-corona">24–48 hours</span>.
      </p>

      <div className="mt-8 border border-[rgba(232,184,109,0.2)] p-6" style={{ background: 'rgba(232,184,109,0.04)' }}>
        <div className="label-mono mb-3">Check your inbox</div>
        <p className="text-silver text-sm font-light leading-relaxed">
          A magic link was sent to{' '}
          {email
            ? <span className="text-corona">{email}</span>
            : 'your email'
          }.
          <br />Click it to log in and track your commission status.
        </p>
        <p className="text-[rgba(196,204,216,0.4)] text-xs font-mono-brand tracking-wider mt-3">
          Check spam if it doesn&apos;t arrive within a few minutes.
        </p>
      </div>

      <div className="mt-6">
        <a
          href="https://elequint-website.vercel.app"
          className="font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver hover:text-white transition-colors"
        >
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default function CommissionSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,184,109,0.04) 0%, transparent 60%), var(--void)'
    }}>
      <Suspense>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
