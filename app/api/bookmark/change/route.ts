import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { getUserId, getSession } from '@/lib/auth-helper'

export async function POST(req: NextRequest) {
  await getSession(req)

  const user_id = await getUserId(req)
  if (!user_id) {
    return NextResponse.json({ error: 'Không xác thực được' }, { status: 401 })
  }

  const { slug, name, image } = await req.json()
  if (!slug) {
    return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookmark')
    .insert([{ user_id: user_id, slug: slug, name: name, image: image }])

  if (error) {
    console.error('Lỗi Supabase:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  await getSession(req)

  const user_id = await getUserId(req)
  if (!user_id) {
    return NextResponse.json({ error: 'Không xác thực được' }, { status: 401 })
  }

  const { slug } = await req.json()
  if (!slug) {
    return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 })
  }

  const { data, error } = await supabase.from('bookmark').delete().eq('user_id', user_id).eq('slug', slug)

  if (error) {
    console.error('Lỗi Supabase:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
