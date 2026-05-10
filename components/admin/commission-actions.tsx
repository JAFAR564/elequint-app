'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CommissionStatus } from '@/lib/supabase/types'

interface Commission {
  id: string
  status: CommissionStatus
  client_id: string | null
  community_name: string
  tier: string
  admin_notes: string | null
}

const STATUS_ACTIONS: { status: CommissionStatus; label: string; style: string }[] = [
  { status: 'reviewing', label: 'Mark: Reviewing', style: 'border-arc text-arc hover:bg-[rgba(90,143,200,0.1)]' },
  { status: 'approved', label: 'Approve', style: 'border-[rgba(122,184,122,0.5)] text-[#7ab87a] hover:bg-[rgba(122,184,122,0.1)]' },
  { status: 'active', label: 'Start Work', style: 'bg-corona text-void hover:bg-white border-corona' },
  { status: 'delivered', label: 'Mark Delivered', style: 'border-[rgba(155,127,212,0.5)] text-[#9b7fd4] hover:bg-[rgba(155,127,212,0.1)]' },
  { status: 'closed', label: 'Close', style: 'border-[rgba(196,204,216,0.2)] text-silver hover:border-[rgba(196,204,216,0.4)]' },
  { status: 'rejected', label: 'Reject', style: 'border-[rgba(200,112,112,0.3)] text-[#c87070] hover:bg-[rgba(200,112,112,0.1)]' },
]

export function AdminCommissionActions({ commission }: { commission: Commission }) {
  const [notes, setNotes] = useState(commission.admin_notes ?? '')
  const [projectTitle, setProjectTitle] = useState(`${commission.community_name} — ${commission.tier}`)
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const updateStatus = async (status: CommissionStatus) => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('commissions').update({ status, admin_notes: notes || null }).eq('id', commission.id)
    setMessage(`Status updated to ${status}`)
    setTimeout(() => setMessage(''), 3000)
    setSaving(false)
    router.refresh()
  }

  const createProject = async () => {
    if (!projectTitle.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('projects').insert({
      commission_id: commission.id,
      client_id: commission.client_id,
      title: projectTitle,
      status: 'in_progress',
      due_date: dueDate || null,
    })
    if (!error) {
      await supabase.from('commissions').update({ status: 'active' }).eq('id', commission.id)
      setMessage('Project created and commission marked active.')
      router.refresh()
    }
    setSaving(false)
  }

  const saveNotes = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('commissions').update({ admin_notes: notes || null }).eq('id', commission.id)
    setMessage('Notes saved.')
    setTimeout(() => setMessage(''), 3000)
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Status actions */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-5">Update Status</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter(a => a.status !== commission.status).map(action => (
            <button key={action.status} onClick={() => updateStatus(action.status)} disabled={saving}
              className={`font-heading text-[0.55rem] tracking-[0.2em] uppercase px-4 py-2 border transition-all disabled:opacity-50 ${action.style}`}>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create project */}
      <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-5">Create Project</div>
        <div className="space-y-3">
          <div>
            <label className="font-mono-brand text-[0.48rem] tracking-[0.25em] uppercase text-silver mb-1 block">Project title</label>
            <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
              className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors" />
          </div>
          <div>
            <label className="font-mono-brand text-[0.48rem] tracking-[0.25em] uppercase text-silver mb-1 block">Due date (optional)</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal px-3 py-2 text-sm font-light outline-none focus:border-corona transition-colors" />
          </div>
          <button onClick={createProject} disabled={saving || !projectTitle.trim()}
            className="w-full font-heading text-[0.58rem] tracking-[0.2em] uppercase text-void bg-corona py-2.5 hover:bg-white transition-colors disabled:opacity-50">
            Create Project
          </button>
        </div>
      </div>

      {/* Admin notes */}
      <div className="col-span-2 border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
        <div className="label-mono mb-4">Internal Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
          placeholder="Notes visible only to admin…"
          className="w-full bg-surface border border-[rgba(196,204,216,0.1)] text-crystal placeholder-[var(--muted-color)] px-4 py-3 text-sm font-light outline-none focus:border-corona transition-colors resize-none mb-3" />
        <button onClick={saveNotes} disabled={saving}
          className="font-heading text-[0.58rem] tracking-[0.2em] uppercase text-void bg-corona px-5 py-2 hover:bg-white transition-colors disabled:opacity-50">
          Save Notes
        </button>
      </div>

      {message && (
        <div className="col-span-2 font-mono-brand text-[0.52rem] tracking-[0.25em] uppercase text-corona text-center py-2">
          {message}
        </div>
      )}
    </div>
  )
}
