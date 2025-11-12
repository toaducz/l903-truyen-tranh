import { request } from "@/utils/request"

export interface LoginResponse {
  message?: string
  error?: string
  status: boolean
}

export async function loginApi(email: string, password: string) {
  
  return await request<LoginResponse>('', '/api/auth/login', 'POST', { email, password })
}
