import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase-client'

// Lấy user_id từ cookie token
export async function getUserId(req: NextRequest) {
  const access_token = req.cookies.get('sb-access-token')?.value
  if (!access_token) return null

  const { data, error } = await supabase.auth.getUser(access_token)
  if (error || !data.user) return null
  return data.user.id
}

export async function getSession(req: NextRequest) {
  const access_token = req.cookies.get('sb-access-token')?.value
  const refresh_token = req.cookies.get('sb-refresh-token')?.value
  if (!access_token) {
    return NextResponse.json({ error: 'Không xác thực được' }, { status: 401 })
  }

  // Thiết lập phiên xác thực cho client
  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token || ''
  })
  if (sessionError) {
    console.error('Lỗi thiết lập phiên:', sessionError.message, sessionError)
    return NextResponse.json({ error: 'Không thể thiết lập phiên', details: sessionError.message }, { status: 401 })
  }
}

