import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { StatusBadge } from '@/components/shared/status-badge'
import { MessageThread } from '@/components/dashboard/message-thread'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type DeliverableRow = Database['public']['Tables']['deliverables']['Row']
type MessageRow = Database['public']['Tables']['messages']['Row'] & {
  profiles: { display_name: string | null; email: string; role: string } | null
}

const PROJECT_STEPS = [
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review', label: 'Client Review' },
  { status: 'revision', label: 'Revision' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'complete', label: 'Complete' },
]

const STEP_ORDER = PROJECT_STEPS.map(s => s.status)

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: rawProject }, { data: rawDeliverables }, { data: rawMessages }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).eq('client_id', user.id).single(),
    supabase.from('deliverables').select('*').eq('project_id', id).order('created_at'),
    supabase.from('messages').select('*, profiles(display_name, email, role)').eq('project_id', id).order('created_at'),
  ])

  if (!rawProject) notFound()
  const project = rawProject as unknown as ProjectRow
  const deliverables = (rawDeliverables ?? []) as DeliverableRow[]
  const messages = (rawMessages ?? []) as MessageRow[]

  const currentStep = STEP_ORDER.indexOf(project.status)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">

      {/* Back */}
      <a href="/dashboard" className="font-mono-brand text-[0.5rem] tracking-[0.3em] uppercase text-silver hover:text-corona transition-colors mb-6 md:mb-8 inline-block">
        ← Dashboard
      </a>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 md:mb-10">
        <div className="min-w-0">
          <h1 className="font-heading text-xl md:text-2xl tracking-widest text-white mb-3 break-words">{project.title}</h1>
          {project.due_date && (
            <p className="font-mono-brand text-[0.5rem] tracking-[0.25em] uppercase text-silver">
              Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Status timeline */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-4 md:p-6 mb-6 md:mb-8 overflow-x-auto">
        <div className="label-mono mb-5 md:mb-6">Progress</div>
        <div className="flex items-center min-w-[480px]">
          {PROJECT_STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={step.status} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-3 h-3 border-2 rounded-full transition-all ${
                    done ? 'bg-corona border-corona' :
                    active ? 'bg-transparent border-corona shadow-[0_0_10px_rgba(232,184,109,0.5)]' :
                    'bg-transparent border-[rgba(196,204,216,0.2)]'
                  }`} />
                  <span className={`font-mono-brand text-[0.45rem] tracking-[0.2em] uppercase text-center ${
                    active ? 'text-corona' : done ? 'text-silver' : 'text-[var(--muted-color)] opacity-50'
                  }`}>{step.label}</span>
                </div>
                {i < PROJECT_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 mb-5 transition-colors ${done ? 'bg-corona opacity-40' : 'bg-[rgba(196,204,216,0.08)]'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Left: deliverables */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-5 md:p-6">
            <div className="label-mono mb-5 md:mb-6">Deliverables</div>
            {!deliverables?.length ? (
              <p className="text-silver text-sm font-light">Nothing delivered yet. We&apos;ll add files and links here as work progresses.</p>
            ) : (
              <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.04)]">
                {deliverables.map(d => (
                  <div key={d.id} className="bg-abyss p-4 flex items-center justify-between">
                    <div>
                      <div className="font-heading text-xs tracking-wider text-white mb-1">{d.name}</div>
                      {d.description && <p className="text-silver text-xs font-light">{d.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-brand text-[0.46rem] tracking-[0.25em] uppercase text-silver border border-[rgba(196,204,216,0.1)] px-2 py-0.5">{d.type}</span>
                      {d.url && (
                        <a href={d.url} target="_blank" rel="noopener noreferrer"
                          className="font-mono-brand text-[0.5rem] tracking-[0.2em] uppercase text-corona hover:text-white transition-colors">
                          Open →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {project.notes && (
            <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-5 md:p-6">
              <div className="label-mono mb-4">Notes from Elequint</div>
              <p className="text-silver text-sm font-light leading-relaxed whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
        </div>

        {/* Right: messages */}
        <div className="lg:col-span-2">
          <MessageThread projectId={project.id} initialMessages={messages} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
