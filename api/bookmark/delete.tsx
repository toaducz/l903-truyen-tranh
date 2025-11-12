import { request } from '@/utils/request'

export interface DeleteBookmarkResponse {
  message?: string
  error?: string
  status: boolean
}

export async function deleteApi(slug: string) {
  
  return await request<DeleteBookmarkResponse>('', '/api/bookmark/delete', 'POST', { slug} )
}
