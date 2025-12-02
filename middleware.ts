import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/login']
}

export function middleware(req: NextRequest) {
  // Lấy cookie
  const token = req.cookies.get('sb-access-token')

  if (token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}
