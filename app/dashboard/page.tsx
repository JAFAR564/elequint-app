import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/shared/status-badge'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type CommissionRow = Database['public']['Tables']['commissions']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: rawProjects }, { data: rawCommissions }] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', user.id).order('updated_at', { ascending: false }),
    supabase.from('commissions').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
  ])

  const projects = (rawProjects ?? []) as ProjectRow[]
  const commissions = (rawCommissions ?? []) as CommissionRow[]
  const activeProjects = projects.filter(p => p.status !== 'complete')
  const pendingCommissions = commissions.filter(c => ['pending', 'reviewing'].includes(c.status))

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">

      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="label-mono mb-3">Client Portal</div>
        <h1 className="font-heading text-2xl md:text-3xl tracking-widest text-white">Your Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-[rgba(196,204,216,0.06)] border border-[rgba(196,204,216,0.06)] mb-8 md:mb-10">
        {[
          { n: activeProjects.length, l: 'Active Projects' },
          { n: pendingCommissions.length, l: 'Pending Review' },
          { n: projects.filter(p => p.status === 'complete').length, l: 'Completed' },
        ].map(({ n, l }) => (
          <div key={l} className="bg-abyss px-3 md:px-6 py-4 md:py-5 text-center">
            <span className="font-heading text-xl md:text-2xl text-corona block">{n}</span>
            <span className="font-mono-brand text-[0.42rem] md:text-[0.48rem] tracking-[0.25em] md:tracking-[0.3em] uppercase text-silver">{l}</span>
          </div>
        ))}
      </div>

      {/* Active projects */}
      <section className="mb-10 md:mb-12">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-white">Active Projects</h2>
          <a href="/commission" className="font-mono-brand text-[0.5rem] tracking-[0.25em] uppercase text-corona hover:text-white transition-colors">
            + New
          </a>
        </div>

        {activeProjects.length === 0 ? (
          <div className="border border-[rgba(196,204,216,0.06)] p-8 md:p-12 text-center">
            <p className="text-silver text-sm font-light mb-4">No active projects yet.</p>
            <a href="/commission" className="font-heading text-[0.62rem] tracking-[0.22em] uppercase text-void bg-corona px-6 py-3 hover:bg-white transition-colors inline-block">
              Start a Commission
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {activeProjects.map(project => (
              <a key={project.id} href={`/dashboard/project/${project.id}`}
                className="bg-abyss p-4 md:p-6 hover:bg-surface transition-colors group block">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-heading text-sm tracking-wider text-white mb-1 group-hover:text-corona transition-colors truncate">
                      {project.title}
                    </div>
                    {project.due_date && (
                      <div className="font-mono-brand text-[0.48rem] tracking-[0.2em] uppercase text-silver">
                        Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center md:justify-end gap-3 md:gap-4 flex-shrink-0">
                    <StatusBadge status={project.status} />
                    <span className="text-silver text-xs group-hover:text-corona transition-colors hidden md:inline">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Commission history */}
      {commissions.length > 0 && (
        <section>
          <h2 className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-white mb-5 md:mb-6">Commission History</h2>
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.06)]">
            {commissions.map(c => (
              <div key={c.id} className="bg-abyss p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-heading text-sm tracking-wider text-white mb-1 truncate">{c.community_name}</div>
                    <div className="font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase text-silver">
                      {c.tier} · {c.platform} · {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
