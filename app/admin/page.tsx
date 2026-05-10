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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="label-mono mb-3">Admin Panel</div>
        <h1 className="font-heading text-3xl tracking-widest text-white">Commission Queue</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-px bg-[rgba(196,204,216,0.06)] border border-[rgba(196,204,216,0.06)] mb-10">
        {[
          { n: pending.length, l: 'Awaiting Review', highlight: pending.length > 0 },
          { n: active.length, l: 'In Progress' },
          { n: projects.length, l: 'Active Projects' },
          { n: commissions?.filter(c => c.status === 'delivered').length ?? 0, l: 'Delivered' },
        ].map(({ n, l, highlight }) => (
          <div key={l} className="bg-abyss px-6 py-5 text-center">
            <span className={`font-heading text-2xl block ${highlight && n > 0 ? 'text-corona' : 'text-corona'}`}>{n}</span>
            <span className="font-mono-brand text-[0.48rem] tracking-[0.3em] uppercase text-silver">{l}</span>
          </div>
        ))}
      </div>

      {/* New commissions */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white">
            New Commissions
            {pending.length > 0 && <span className="ml-2 font-mono-brand text-[0.5rem] tracking-[0.2em] bg-corona text-void px-1.5 py-0.5">{pending.length}</span>}
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
                className="bg-abyss p-5 flex items-center justify-between hover:bg-surface transition-colors group">
                <div className="flex items-start gap-6">
                  <div>
                    <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors mb-1">
                      {c.community_name}
                    </div>
                    <div className="font-mono-brand text-[0.48rem] tracking-[0.2em] uppercase text-silver">
                      {c.genre} · {c.platform} · {TIER_PRICE[c.tier]}
                    </div>
                  </div>
                  <div className="text-xs text-silver font-light">
                    {c.profiles?.email}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono-brand text-[0.46rem] tracking-[0.2em] text-silver">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <StatusBadge status={c.status} />
                  <span className="text-silver text-xs group-hover:text-corona transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Active commissions */}
      {active.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white mb-6">In Progress</h2>
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {active.map(c => (
              <a key={c.id} href={`/admin/commission/${c.id}`}
                className="bg-abyss p-5 flex items-center justify-between hover:bg-surface transition-colors group">
                <div>
                  <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors mb-1">{c.community_name}</div>
                  <div className="font-mono-brand text-[0.48rem] tracking-[0.2em] uppercase text-silver">
                    {c.genre} · {c.platform} · {TIER_PRICE[c.tier]}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={c.status} />
                  <span className="text-silver text-xs group-hover:text-corona transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Active projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white mb-6">Active Projects</h2>
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {projects.map(p => (
              <a key={p.id} href={`/admin/project/${p.id}`}
                className="bg-abyss p-5 flex items-center justify-between hover:bg-surface transition-colors group">
                <div className="font-heading text-sm tracking-wider text-white group-hover:text-corona transition-colors">{p.title}</div>
                <div className="flex items-center gap-4">
                  {p.due_date && (
                    <span className="font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase text-silver">
                      Due {new Date(p.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <StatusBadge status={p.status} />
                  <span className="text-silver text-xs group-hover:text-corona transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
