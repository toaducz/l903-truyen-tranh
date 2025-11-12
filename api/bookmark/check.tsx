import { request } from '@/utils/request'

export interface CheckBookmarkResponse {
  status?: boolean
  error?: string
  exists: boolean
}

export async function checkApi(slug: string) {
  
  return await request<CheckBookmarkResponse>('', '/api/bookmark/check', 'POST', { slug} )
}
