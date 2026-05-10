import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppNav } from '@/components/shared/app-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  const profile = rawProfile as { role: string; email: string } | null
  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <AppNav role="admin" email={profile.email} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
