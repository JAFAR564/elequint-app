const LABELS: Record<string, string> = {
  pending: 'Pending',
  reviewing: 'Reviewing',
  approved: 'Approved',
  active: 'Active',
  delivered: 'Delivered',
  closed: 'Closed',
  rejected: 'Rejected',
  in_progress: 'In Progress',
  review: 'In Review',
  revision: 'Revision',
  complete: 'Complete',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`font-mono-brand text-[0.46rem] tracking-[0.3em] uppercase border px-2 py-1 status-${status}`}>
      {LABELS[status] ?? status}
    </span>
  )
}
