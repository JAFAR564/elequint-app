'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { ProjectStatus, DeliverableType } from '@/lib/supabase/types'

interface Project {
  id: string
  status: ProjectStatus
  notes: string | null
  due_date: string | null
}

interface Deliverable {
  id: string
  name: string
  url: string | null
  type: DeliverableType
  description: string | null
}

const PROJECT_STATUSES: { status: ProjectStatus; label: string }[] = [
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review', label: 'In Review' },
  { status: 'revision', label: 'Revision' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'complete', label: 'Complete' },
]

const DELIVERABLE_TYPES: DeliverableType[] = ['link', 'preview', 'file', 'code']

export function AdminProjectActions({ project, deliverables: initialDeliverables }: { project: Project; deliverables: Deliverable[] }) {
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [notes, setNotes] = useState(project.notes ?? '')
  const [dName, setDName] = useState('')
  const [dUrl, setDUrl] = useState('')
  const [dType, setDType] = useState<DeliverableType>('link')
  const [dDesc, setDDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const updateStatus = async (status: ProjectStatus) => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('projects').update({ status }).eq('id', project.id)
    flash(`Status → ${status}`)
    router.refresh()
    setSaving(false)
  }

  const saveNotes = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('projects').update({ notes: notes || null }).eq('id', project.id)
    flash('Notes saved.')
    setSaving(false)
  }

  const addDeliverable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase.from('deliverables').insert({
      project_id: project.id,
      name: dName.trim(),
      url: dUrl.trim() || null,
      type: dType,
      description: dDesc.trim() || null,
    }).select().single()
    if (data) setDeliverables(d => [...d, data])
    setDName(''); setDUrl(''); setDDesc('')
    flash('Deliverable added.')
    setSaving(false)
  }

  const removeDeliverable = async (id: string) => {
    const supabase = createClient()
    await supabase.from('deliverables').delete().eq('id', id)
    setDeliverables(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-5">Project Status</div>
        <div className="flex flex-wrap gap-2">
          {PROJECT_STATUSES.map(({ status, label }) => (
            <button key={status} onClick={() => updateStatus(status)} disabled={saving || status === project.status}
              className={`font-heading text-[0.55rem] tracking-[0.2em] uppercase px-4 py-2 border transition-all disabled:cursor-not-allowed ${
                status === project.status
                  ? 'border-corona bg-[rgba(232,184,109,0.1)] text-corona opacity-70'
                  : 'border-[rgba(196,204,216,0.15)] text-silver hover:border-corona hover:text-corona'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-5">Deliverables</div>

        {deliverables.length > 0 && (
          <div className="flex flex-col gap-px bg-[rgba(196,204,216,0.04)] mb-5">
            {deliverables.map(d => (
              <div key={d.id} className="bg-abyss p-3 flex items-center justify-between">
                <div>
                  <span className="font-heading text-xs tracking-wider text-white mr-3">{d.name}</span>
                  <span className="font-mono-brand text-[0.44rem] tracking-[0.2em] uppercase text-silver border border-[rgba(196,204,216,0.1)] px-1.5 py-0.5">{d.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-mono-brand text-[0.48rem] tracking-[0.2em] uppercase text-arc hover:text-white transition-colors">Open</a>}
                  <button onClick={() => removeDeliverable(d.id)} className="font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase text-[#c87070] hover:text-white transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addDeliverable} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={dName} onChange={e => setDName(e.target.value)} placeholder="Name"
              className="bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors" />
            <select value={dType} onChange={e => setDType(e.target.value as DeliverableType)}
              className="bg-surface border border-[rgba(196,204,216,0.1)] text-crystal px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors appearance-none">
              {DELIVERABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <input value={dUrl} onChange={e => setDUrl(e.target.value)} placeholder="URL (optional)"
            className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors" />
          <input value={dDesc} onChange={e => setDDesc(e.target.value)} placeholder="Description (optional)"
            className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors" />
          <button type="submit" disabled={saving || !dName.trim()}
            className="font-heading text-[0.55rem] tracking-[0.2em] uppercase text-void bg-corona px-5 py-2 hover:bg-white transition-colors disabled:opacity-50">
            Add Deliverable
          </button>
        </form>
      </div>

      {/* Notes */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-4">Client-Visible Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
          placeholder="Updates, instructions, or context for the client…"
          className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors resize-none mb-3" />
        <button onClick={saveNotes} disabled={saving}
          className="font-heading text-[0.58rem] tracking-[0.2em] uppercase text-void bg-corona px-5 py-2 hover:bg-white transition-colors disabled:opacity-50">
          Save Notes
        </button>
      </div>

      {message && (
        <div className="font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-corona py-2 text-center">
          {message}
        </div>
      )}
    </div>
  )
}
