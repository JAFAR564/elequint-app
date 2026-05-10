'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CommissionTier } from '@/lib/supabase/types'

const PLATFORMS = ['Discord', 'Reddit', 'Amino', 'Tumblr', 'Forum (ProBoards/Jcink)', 'Custom Website', 'Multiple']
const GENRES = ['High Fantasy', 'Dark Fantasy', 'Sci-Fi', 'Modern / Urban Fantasy', 'Horror', 'Historical', 'Slice of Life', 'Post-Apocalyptic', 'Other']
const MEMBER_COUNTS = ['Under 50', '50–200', '200–500', '500–1,000', '1,000–5,000', '5,000+']
const TIMELINES = ['No rush (1–2 months)', 'Standard (2–4 weeks)', 'Priority (1–2 weeks)', 'Urgent (under 1 week)']

const TIERS: { id: CommissionTier; name: string; price: string; features: string[] }[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: '$5',
    features: ['Custom landing page', 'Brand color palette', 'Logo integration', 'Mobile responsive'],
  },
  {
    id: 'presence',
    name: 'Presence',
    price: '$10',
    features: ['Everything in Foundation', 'Lore archive page', 'Faction/faction showcase', 'Recruitment hub', 'SEO & meta setup'],
  },
  {
    id: 'architecture',
    name: 'Architecture',
    price: 'Custom',
    features: ['Everything in Presence', 'Full multi-page site', 'Character app system', 'Custom domain setup', 'Ongoing maintenance'],
  },
]

type Step = 1 | 2 | 3 | 4

interface FormData {
  email: string
  community_name: string
  genre: string
  platform: string
  member_count: string
  tier: CommissionTier | ''
  goals: string
  inspiration: string
  existing_assets: string
  timeline: string
}

const empty: FormData = {
  email: '', community_name: '', genre: '', platform: '',
  member_count: '', tier: '', goals: '', inspiration: '',
  existing_assets: '', timeline: '',
}

export default function CommissionPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const canAdvance = () => {
    if (step === 1) return form.email.includes('@')
    if (step === 2) return form.community_name && form.genre && form.platform
    if (step === 3) return !!form.tier
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from('commissions').insert({
        email: form.email,
        community_name: form.community_name,
        genre: form.genre,
        platform: form.platform,
        member_count: form.member_count || null,
        tier: form.tier as CommissionTier,
        goals: form.goals || null,
        inspiration: form.inspiration || null,
        existing_assets: form.existing_assets || null,
        timeline: form.timeline || null,
      })

      if (insertError) throw insertError

      // Send magic link after successful insert so they can track their commission
      await supabase.auth.signInWithOtp({
        email: form.email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })

      router.push(`/commission/success?email=${encodeURIComponent(form.email)}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{
      background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,184,109,0.03) 0%, transparent 60%), var(--void)'
    }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <a href="https://elequint-website.vercel.app" className="label-mono hover:text-white transition-colors mb-4 inline-block">
          ← Elequint
        </a>
        <h1 className="font-heading text-3xl tracking-widest text-white mt-4 mb-2">Commission</h1>
        <p className="text-silver text-sm font-light">Tell us about your community and what you need.</p>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center gap-0">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-7 h-7 flex items-center justify-center text-[0.52rem] font-mono-brand tracking-wider border transition-all ${
                step === s ? 'border-corona text-corona bg-[rgba(232,184,109,0.1)]' :
                step > s ? 'border-corona text-corona' :
                'border-[rgba(196,204,216,0.15)] text-silver'
              }`}>
                {step > s ? '✓' : String(s).padStart(2, '0')}
              </div>
              {i < 3 && <div className={`flex-1 h-px transition-colors ${step > s ? 'bg-corona opacity-40' : 'bg-[rgba(196,204,216,0.1)]'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Your Email', 'Community', 'Tier', 'Brief'].map((l, i) => (
            <span key={l} className={`font-mono-brand text-[0.45rem] tracking-[0.25em] uppercase ${step === i + 1 ? 'text-corona' : 'text-silver opacity-50'}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto border border-[rgba(196,204,216,0.08)] p-8" style={{ background: 'var(--abyss)' }}>

        {/* Step 1 — Email */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <div className="label-mono mb-6">Your contact email</div>
              <p className="text-silver text-sm font-light leading-relaxed mb-6">
                We&apos;ll send your commission confirmation here — and a magic link so you can log in and track progress at any time.
              </p>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step 2 — Community */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-up">
            <div className="label-mono mb-6">About your community</div>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Community / Server name</label>
              <input
                value={form.community_name}
                onChange={e => set('community_name', e.target.value)}
                placeholder="e.g. Aetherborne Saga"
                className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Genre</label>
                <select value={form.genre} onChange={e => set('genre', e.target.value)}
                  className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors appearance-none">
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Platform</label>
                <select value={form.platform} onChange={e => set('platform', e.target.value)}
                  className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors appearance-none">
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Current member count</label>
              <div className="flex flex-wrap gap-2">
                {MEMBER_COUNTS.map(m => (
                  <button key={m} type="button" onClick={() => set('member_count', m)}
                    className={`font-mono-brand text-[0.5rem] tracking-[0.2em] uppercase px-3 py-2 border transition-all ${
                      form.member_count === m ? 'border-corona text-corona bg-[rgba(232,184,109,0.08)]' : 'border-[rgba(196,204,216,0.1)] text-silver hover:border-[rgba(196,204,216,0.3)]'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Tier */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-up">
            <div className="label-mono mb-6">Choose your tier</div>
            <div className="grid grid-cols-3 gap-3">
              {TIERS.map(tier => (
                <button key={tier.id} type="button" onClick={() => set('tier', tier.id)}
                  className={`text-left p-5 border transition-all relative ${
                    form.tier === tier.id
                      ? 'border-corona bg-[rgba(232,184,109,0.06)]'
                      : 'border-[rgba(196,204,216,0.08)] hover:border-[rgba(196,204,216,0.2)]'
                  }`}>
                  {form.tier === tier.id && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-corona opacity-60" />
                  )}
                  <div className="font-heading text-xs tracking-widest text-white mb-1">{tier.name}</div>
                  <div className="text-corona font-heading text-xl mb-4">{tier.price}</div>
                  <ul className="space-y-1.5">
                    {tier.features.map(f => (
                      <li key={f} className="font-mono-brand text-[0.46rem] tracking-[0.15em] uppercase text-silver flex items-start gap-1.5">
                        <span className="text-corona mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Brief */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-up">
            <div className="label-mono mb-6">The brief</div>
            <p className="text-silver text-sm font-light -mt-2 mb-4">All fields optional — share what helps. We&apos;ll follow up for anything we need.</p>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Goals — what should this achieve?</label>
              <textarea value={form.goals} onChange={e => set('goals', e.target.value)} rows={3}
                placeholder="Recruit new writers, showcase our lore, establish brand identity…"
                className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors resize-none" />
            </div>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Inspiration — sites or aesthetics you love</label>
              <textarea value={form.inspiration} onChange={e => set('inspiration', e.target.value)} rows={2}
                placeholder="Links, descriptions, vibes…"
                className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors resize-none" />
            </div>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Existing assets — logos, banners, colour palette?</label>
              <textarea value={form.existing_assets} onChange={e => set('existing_assets', e.target.value)} rows={2}
                placeholder="Describe what you have, or say 'none'"
                className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors resize-none" />
            </div>
            <div>
              <label className="block font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver mb-2">Timeline preference</label>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(t => (
                  <button key={t} type="button" onClick={() => set('timeline', t)}
                    className={`font-mono-brand text-[0.5rem] tracking-[0.15em] uppercase px-3 py-2 border transition-all ${
                      form.timeline === t ? 'border-corona text-corona bg-[rgba(232,184,109,0.08)]' : 'border-[rgba(196,204,216,0.1)] text-silver hover:border-[rgba(196,204,216,0.3)]'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-400 text-xs font-mono-brand tracking-wider">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[rgba(196,204,216,0.06)]">
          {step > 1 ? (
            <button onClick={() => setStep(s => (s - 1) as Step)}
              className="font-mono-brand text-[0.52rem] tracking-[0.3em] uppercase text-silver hover:text-white transition-colors">
              ← Back
            </button>
          ) : <span />}

          {step < 4 ? (
            <button onClick={() => setStep(s => (s + 1) as Step)} disabled={!canAdvance()}
              className="font-heading text-[0.62rem] tracking-[0.22em] uppercase text-void bg-corona px-6 py-3 transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || !canAdvance()}
              className="font-heading text-[0.62rem] tracking-[0.22em] uppercase text-void bg-corona px-8 py-3 transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? 'Submitting…' : 'Submit Commission'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
