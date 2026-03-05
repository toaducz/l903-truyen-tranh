import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { getUserId, getSession } from '@/lib/auth-helper'

export async function POST(req: NextRequest) {
  await getSession(req)

  const user_id = await getUserId(req)
  if (!user_id) {
    return NextResponse.json({ error: 'Không xác thực được' }, { status: 401 })
  }

  const { slug, name, image, chapter_name, chapter_id } = await req.json()
  if (!slug) {
    return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 })
  }

  // dùng upsert thay vì insert
  // onConflict: xác định cột nào được dùng để kiểm tra sự tồn tại
  const { data, error } = await supabase.from('bookmark').upsert(
    {
      user_id: user_id,
      slug: slug,
      name: name,
      image: image,
      chapter_name: chapter_name,
      chapter_id: chapter_id
    },
    {
      onConflict: 'user_id, slug', // báo cho Supabase biết đối chiếu bằng 2 cột này
      ignoreDuplicates: false // false để nó ghi đè/cập nhật dữ liệu mới
    }
  )

  if (error) {
    console.error('Lỗi Supabase:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, message: 'Lưu bookmark thành công!' })
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
