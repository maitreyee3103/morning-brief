import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export async function getSnapshot() {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('user_id', userId)
    .eq('snapshot_date', today)
    .single()

  if (error || !data) return null
  return data
}
