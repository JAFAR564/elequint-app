import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/shared/status-badge'
import { AdminProjectActions } from '@/components/admin/project-actions'
import { MessageThread } from '@/components/dashboard/message-thread'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type DeliverableRow = Database['public']['Tables']['deliverables']['Row']
type MessageRow = Database['public']['Tables']['messages']['Row'] & {
  profiles: { display_name: string | null; email: string; role: string } | null
}

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: rawProject }, { data: rawDeliverables }, { data: rawMessages }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('deliverables').select('*').eq('project_id', id).order('created_at'),
    supabase.from('messages').select('*, profiles(display_name, email, role)').eq('project_id', id).order('created_at'),
  ])

  if (!rawProject) notFound()
  const project = rawProject as unknown as ProjectRow
  const deliverables = (rawDeliverables ?? []) as DeliverableRow[]
  const messages = (rawMessages ?? []) as MessageRow[]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <a href="/admin" className="font-mono-brand text-[0.5rem] tracking-[0.3em] uppercase text-silver hover:text-corona transition-colors mb-8 inline-block">
        ← Admin
      </a>

      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="label-mono mb-3">Project Management</div>
          <h1 className="font-heading text-2xl tracking-widest text-white">{project.title}</h1>
          {project.due_date && (
            <p className="font-mono-brand text-[0.5rem] tracking-[0.2em] uppercase text-silver mt-2">
              Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          {/* Admin actions */}
          <AdminProjectActions project={project} deliverables={deliverables} />
        </div>

        {/* Messages */}
        <div className="col-span-2">
          <MessageThread projectId={project.id} initialMessages={messages} userId={user!.id} />
        </div>
      </div>
    </div>
  )
}
