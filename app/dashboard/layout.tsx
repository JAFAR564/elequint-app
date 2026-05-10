import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppNav } from '@/components/shared/app-nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  const profile = rawProfile as { role: 'client' | 'admin'; email: string } | null

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <AppNav role={profile?.role} email={profile?.email} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
