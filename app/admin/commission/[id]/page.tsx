import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/shared/status-badge'
import { AdminCommissionActions } from '@/components/admin/commission-actions'
import type { Database } from '@/lib/supabase/types'

type CommissionRow = Database['public']['Tables']['commissions']['Row'] & {
  profiles: { email: string; display_name: string | null } | null
}

const TIER_PRICE: Record<string, string> = { foundation: '$5', presence: '$10', architecture: 'Custom' }

export default async function AdminCommissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rawCommission } = await supabase
    .from('commissions')
    .select('*, profiles(email, display_name)')
    .eq('id', id)
    .single()

  if (!rawCommission) notFound()
  const commission = rawCommission as unknown as CommissionRow

  const fields = [
    { l: 'Community', v: commission.community_name },
    { l: 'Client', v: (commission as { profiles?: { email?: string } }).profiles?.email ?? '—' },
    { l: 'Genre', v: commission.genre },
    { l: 'Platform', v: commission.platform },
    { l: 'Tier', v: `${commission.tier} (${TIER_PRICE[commission.tier]})` },
    { l: 'Member Count', v: commission.member_count ?? '—' },
    { l: 'Timeline', v: commission.timeline ?? '—' },
    { l: 'Submitted', v: new Date(commission.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <a href="/admin" className="font-mono-brand text-[0.5rem] tracking-[0.3em] uppercase text-silver hover:text-corona transition-colors mb-8 inline-block">
        ← Queue
      </a>

      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="label-mono mb-3">Commission Review</div>
          <h1 className="font-heading text-2xl tracking-widest text-white">{commission.community_name}</h1>
        </div>
        <StatusBadge status={commission.status} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Details */}
        <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6">
          <div className="label-mono mb-5">Details</div>
          <div className="space-y-3">
            {fields.map(({ l, v }) => (
              <div key={l} className="flex justify-between gap-4">
                <span className="font-mono-brand text-[0.5rem] tracking-[0.25em] uppercase text-silver flex-shrink-0">{l}</span>
                <span className="text-crystal text-sm font-light text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brief */}
        <div className="border border-[rgba(196,204,216,0.06)] bg-abyss p-6 space-y-5">
          <div className="label-mono mb-1">Brief</div>
          {[
            { l: 'Goals', v: commission.goals },
            { l: 'Inspiration', v: commission.inspiration },
            { l: 'Existing Assets', v: commission.existing_assets },
          ].map(({ l, v }) => v && (
            <div key={l}>
              <div className="font-mono-brand text-[0.48rem] tracking-[0.25em] uppercase text-silver mb-1">{l}</div>
              <p className="text-crystal text-sm font-light leading-relaxed">{v}</p>
            </div>
          ))}
          {!commission.goals && !commission.inspiration && !commission.existing_assets && (
            <p className="text-silver text-sm font-light">No brief provided.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <AdminCommissionActions commission={{ id: commission.id, status: commission.status, client_id: commission.client_id, community_name: commission.community_name, tier: commission.tier, admin_notes: commission.admin_notes }} />
    </div>
  )
}
