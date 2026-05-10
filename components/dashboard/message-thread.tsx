'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string | null
  profiles: { display_name: string | null; email: string; role: string } | null
}

interface Props {
  projectId: string
  initialMessages: Message[]
  userId: string
}

export function MessageThread({ projectId, initialMessages, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
        async payload => {
          const { data } = await supabase
            .from('messages')
            .select('*, profiles(display_name, email, role)')
            .eq('id', payload.new.id)
            .single()
          if (data) setMessages(m => [...m, data as Message])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [projectId])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    const supabase = createClient()
    await supabase.from('messages').insert({ project_id: projectId, sender_id: userId, content: content.trim() })
    setContent('')
    setSending(false)
  }

  return (
    <div className="border border-[rgba(196,204,216,0.06)] bg-abyss flex flex-col" style={{ height: '520px' }}>
      <div className="label-mono p-4 border-b border-[rgba(196,204,216,0.06)]">Updates</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-silver text-xs font-light text-center mt-8">No messages yet.</p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === userId
          const name = msg.profiles?.role === 'admin' ? 'Elequint' : (msg.profiles?.display_name || msg.profiles?.email?.split('@')[0] || 'You')
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`font-mono-brand text-[0.46rem] tracking-[0.2em] uppercase ${msg.profiles?.role === 'admin' ? 'text-corona' : 'text-silver'}`}>
                {name}
              </div>
              <div className={`max-w-[85%] px-4 py-3 text-sm font-light leading-relaxed ${
                isMe
                  ? 'bg-surface text-crystal'
                  : 'text-crystal'
              }`} style={!isMe ? { background: 'rgba(232,184,109,0.06)', borderLeft: '2px solid rgba(232,184,109,0.3)' } : {}}>
                {msg.content}
              </div>
              <div className="font-mono-brand text-[0.42rem] tracking-[0.15em] text-[var(--muted-color)]">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 border-t border-[rgba(196,204,216,0.06)] flex gap-2">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Send a message…"
          className="flex-1 bg-surface border border-[rgba(196,204,216,0.08)] text-crystal placeholder-[var(--muted-color)] px-3 py-2 text-xs font-light outline-none focus:border-corona transition-colors"
        />
        <button type="submit" disabled={sending || !content.trim()}
          className="font-heading text-[0.52rem] tracking-[0.2em] uppercase text-void bg-corona px-4 py-2 hover:bg-white transition-colors disabled:opacity-40">
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
