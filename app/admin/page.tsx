import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/shared/status-badge'
import type { Database } from '@/lib/supabase/types'

type CommissionWithProfile = Database['public']['Tables']['commissions']['Row'] & {
  profiles: { email: string; display_name: string | null } | null
}
type ProjectRow = Database['public']['Tables']['projects']['Row']

const TIER_PRICE: Record<string, string> = { foundation: '$5', presence: '$10', architecture: 'Custom' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: rawCommissions }, { data: rawProjects }] = await Promise.all([
    supabase
      .from('commissions')
      .select('*, profiles(email, display_name)')
      .order('created_at', { ascending: false }),
    supabase.from('projects').select('*').neq('status', 'complete').order('updated_at', { ascending: false }),
  ])

  const commissions = (rawCommissions ?? []) as CommissionWithProfile[]
  const projects = (rawProjects ?? []) as ProjectRow[]
  const pending = commissions.filter(c => c.status === 'pending')
  const active = commissions.filter(c => ['reviewing', 'approved', 'active'].includes(c.status))
  const delivered = commissions.filter(c => c.status === 'delivered').length

  const stats = [
    { n: pending.length, l: 'Awaiting Review', highlight: pending.length > 0 },
    { n: active.length, l: 'In Progress' },
    { n: projects.length, l: 'Active Projects' },
    { n: delivered, l: 'Delivered' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="label-mono mb-3">Admin Panel</div>
        <h1 className="font-heading text-2xl md:text-3xl tracking-widest text-white">Commission Queue</h1>
      </div>

      {/* Stats — 2x2 on mobile, 4 across on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(196,204,216,0.06)] border border-[rgba(196,204,216,0.06)] mb-8 md:mb-10">
        {stats.map(({ n, l, highlight }) => (
          <div key={l} className="bg-abyss px-4 md:px-6 py-4 md:py-5 text-center relative overflow-hidden">
            {highlight && n > 0 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-corona opacity-60" />
            )}
            <span className="font-heading text-xl md:text-2xl block text-corona">{n}</span>
            <span className="font-mono-brand text-[0.42rem] md:text-[0.48rem] tracking-[0.25em] md:tracking-[0.3em] uppercase text-silver">{l}</span>
          </div>
        ))}
      </div>

      {/* New commissions */}
      <section className="mb-10 md:mb-12">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-white flex items-center gap-2">
            New Commissions
            {pending.length > 0 && (
              <span className="font-mono-brand text-[0.48rem] tracking-[0.18em] bg-corona text-void px-1.5 py-0.5">
                {pending.length}
              </span>
            )}
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="border border-[rgba(196,204,216,0.06)] p-8 text-center">
            <p className="text-silver text-sm font-light">No new commissions.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {pending.map(c => (
              <a key={c.id} href={`/admin/commission/${c.id}`}
                className="bg-abyss p-4 md:p-5 hover:bg-surface transition-colors group block">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors mb-1 truncate">
                      {c.community_name}
                    </div>
                    <div className="font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase text-silver mb-1">
                      {c.genre} · {c.platform} · {TIER_PRICE[c.tier]}
                    </div>
                    {(c.email || c.profiles?.email) && (
                      <div className="text-[0.7rem] text-silver font-light truncate opacity-70">
                        {c.profiles?.email ?? c.email}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 flex-shrink-0">
                    <span className="font-mono-brand text-[0.44rem] tracking-[0.2em] text-silver">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    <StatusBadge status={c.status} />
                    <span className="text-silver text-xs group-hover:text-corona transition-colors hidden md:inline">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Active commissions */}
      {active.length > 0 && (
        <section className="mb-10 md:mb-12">
          <h2 className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-white mb-5 md:mb-6">In Progress</h2>
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {active.map(c => (
              <a key={c.id} href={`/admin/commission/${c.id}`}
                className="bg-abyss p-4 md:p-5 hover:bg-surface transition-colors group block">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors mb-1 truncate">{c.community_name}</div>
                    <div className="font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase text-silver">
                      {c.genre} · {c.platform} · {TIER_PRICE[c.tier]}
                    </div>
                  </div>
                  <div className="flex items-center md:justify-end gap-3 md:gap-4 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <span className="text-silver text-xs group-hover:text-corona transition-colors hidden md:inline">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Active projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-white mb-5 md:mb-6">Active Projects</h2>
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {projects.map(p => (
              <a key={p.id} href={`/admin/project/${p.id}`}
                className="bg-abyss p-4 md:p-5 hover:bg-surface transition-colors group block">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors truncate min-w-0 flex-1">{p.title}</div>
                  <div className="flex items-center md:justify-end gap-3 md:gap-4 flex-shrink-0">
                    {p.due_date && (
                      <span className="font-mono-brand text-[0.44rem] tracking-[0.2em] uppercase text-silver">
                        Due {new Date(p.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <StatusBadge status={p.status} />
                    <span className="text-silver text-xs group-hover:text-corona transition-colors hidden md:inline">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
