import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question, answer } = await req.json()
  if (!answer?.trim()) return NextResponse.json({ error: 'No answer' }, { status: 400 })

  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('journal_entries')
    .upsert({
      user_id: userId,
      entry_date: today,
      question,
      answer,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,entry_date' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
