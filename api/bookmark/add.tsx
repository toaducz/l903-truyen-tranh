import { request } from '@/utils/request'

export interface AddBookmarkResponse {
  message?: string
  error?: string
  status: boolean
}

export async function addApi(slug: string, name: string, image: string) {
  
  return await request<AddBookmarkResponse>('', '/api/bookmark/add', 'POST', { slug, name, image })
}
