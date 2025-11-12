import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { getUserId, getSession } from '@/lib/auth-helper'

export async function GET(req: NextRequest) {
  await getSession(req)

  const user_id = await getUserId(req)
  if (!user_id) {
    return NextResponse.json({ error: 'Không xác thực được' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('bookmark')
    .select('*', { count: 'exact' })
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Lỗi Supabase:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    count,
    page,
    totalPages: count ? Math.ceil(count / limit) : 1
  })
}
