'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../auth-provider'
import { useRouter } from 'next/navigation'
import { loginApi } from '@/api/services/login'
import { useMutation } from '@tanstack/react-query'
import Loading from '@/component/status/loading'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checkingUser, setCheckingUser] = useState<boolean | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  
  const loginMutation = useMutation({
    mutationFn: () => loginApi(email, password), 
    onSuccess: data => {
      if (data?.status) {
        window.location.href = '/login'
        router.replace('/')
      } else {
        setError(data?.error || 'Đăng nhập thất bại')
      }
    },
    onError: () => {
      setError('Lỗi kết nối server')
    },
  })

  useEffect(() => {
    if (user) {
      router.replace('/')
    } else {
      setCheckingUser(false)
    }
  }, [user, router])

  if (checkingUser) {
    return <Loading />
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate()
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-4'>
      {!user?.id && (
        <form
          onSubmit={handleLogin}
          className='w-full max-w-sm bg-slate-900/70 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl shadow-lg'
        >
          <h2 className='text-2xl font-semibold text-center text-white mb-6 tracking-wide'>Đăng nhập</h2>
          <div className='mb-4'>
            <label className='block text-slate-300 text-sm mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='example@email.com'
              required
              className='w-full bg-slate-800 text-white rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-slate-300 text-sm mb-1'>Mật khẩu</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••'
              required
              className='w-full bg-slate-800 text-white rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Error */}
          {error && <p className='text-red-500 text-sm text-center mb-3'>{error}</p>}

          <button
            type='submit'
            disabled={loginMutation.isPending}
            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'
          >
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* Register link */}
          <div
            onClick={() => alert('Không cho đăng kí đấy, làm sao?')}
            className='text-center text-slate-400 text-sm mt-6 cursor-pointer hover:text-blue-400 underline'
          >
            Chưa có tài khoản? Đăng ký
          </div>
        </form>
      )}
    </div>
  )
}
