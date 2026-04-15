'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth-provider'
import { useRouter } from 'next/navigation'
import { loginApi } from '@/lib/api/services/login'
import { useMutation } from '@tanstack/react-query'
import Loading from '@/component/status/loading'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from 'rive-react'

const STATE_MACHINE_NAME = 'Login Machine'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checkingUser, setCheckingUser] = useState<boolean | null>(null)
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useAuth()

  /* ── Rive ── */
  const { rive: riveInstance, RiveComponent } = useRive({
    src: '/riv/bear.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center })
  })

  const isCheckingInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isChecking')
  const numLookInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'numLook')
  const trigSuccessInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigSuccess')
  const trigFailInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigFail')
  const isHandsUpInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isHandsUp')

  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(inputRef.current.offsetWidth / 100)
    }
  }, [inputLookMultiplier])

  /* ── Auth redirect ── */
  useEffect(() => {
    if (user) {
      router.replace('/')
    } else {
      setCheckingUser(false)
    }
  }, [user, router])

  /* ── Login mutation ── */
  const loginMutation = useMutation({
    mutationFn: () => loginApi(email, password),
    onSuccess: data => {
      if (data?.status) {
        trigSuccessInput?.fire()
        setTimeout(() => {
          window.location.href = '/'
        }, 1200)
      } else {
        trigFailInput?.fire()
        setError(data?.error || 'Đăng nhập thất bại')
      }
    },
    onError: () => {
      trigFailInput?.fire()
      setError('Lỗi kết nối server')
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate()
  }

  /* ── Email field handlers ── */
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)
    if (isCheckingInput && !isCheckingInput.value) isCheckingInput.value = true
    if (numLookInput) numLookInput.value = val.length * inputLookMultiplier
  }

  const onEmailFocus = () => {
    if (isCheckingInput) isCheckingInput.value = true
    if (numLookInput) numLookInput.value = email.length * inputLookMultiplier
  }

  const onEmailBlur = () => {
    if (isCheckingInput) isCheckingInput.value = false
  }

  /* ── Password field handlers ── */
  const onPasswordFocus = () => {
    if (isHandsUpInput) isHandsUpInput.value = true
  }

  const onPasswordBlur = () => {
    if (isHandsUpInput) isHandsUpInput.value = false
  }

  if (checkingUser) return <Loading />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: radial-gradient(ellipse at 20% 50%, #0f172a 0%, #020617 60%);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* animated background blobs */
        .login-root::before,
        .login-root::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: blobFloat 12s ease-in-out infinite alternate;
        }
        .login-root::before {
          width: 500px; height: 500px;
          background: #6366f1;
          top: -150px; left: -150px;
        }
        .login-root::after {
          width: 400px; height: 400px;
          background: #a855f7;
          bottom: -100px; right: -100px;
          animation-delay: -6s;
        }

        @keyframes blobFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }

        /* card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 24px;
          padding: 2rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 25px 60px rgba(0,0,0,0.6),
            0 0 80px rgba(99,102,241,0.08);
          animation: cardEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes cardEntry {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* rive wrapper */
        .rive-wrapper {
          width: 200px;
          height: 200px;
          margin: 0 auto 0.5rem;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.12);
        }

        /* title */
        .login-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }
        .login-subtitle {
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 1.75rem;
        }

        /* field */
        .login-field {
          margin-bottom: 1rem;
        }
        .login-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 0.375rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .login-input {
          width: 100%;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          padding: 0.7rem 1rem;
          color: #f1f5f9;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #475569; }
        .login-input:focus {
          border-color: rgba(99, 102, 241, 0.7);
          background: rgba(30, 41, 59, 1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        /* error */
        .login-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 0.6rem 0.875rem;
          color: #f87171;
          font-size: 0.8rem;
          text-align: center;
          margin-bottom: 1rem;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100%{ transform: translateX(0); }
          20%    { transform: translateX(-6px); }
          60%    { transform: translateX(6px); }
        }

        /* button */
        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
          position: relative;
          overflow: hidden;
        }
        .login-btn:not(:disabled):hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.5);
        }
        .login-btn:not(:disabled):active {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          border-radius: inherit;
        }

        /* loading spinner inside button */
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* register link */
        .login-register {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.82rem;
          color: #475569;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-register:hover { color: #818cf8; }
        .login-register span {
          color: #818cf8;
          font-weight: 500;
        }
        .login-register:hover span { text-decoration: underline; }
      `}</style>

      <div className='login-root'>
        {!user?.id && (
          <div className='login-card'>
            {/* Bear animation */}
            <div className='rive-wrapper'>
              <RiveComponent />
            </div>

            <h1 className='login-title'>Chào mừng trở lại</h1>
            <p className='login-subtitle'>Đăng nhập để tiếp tục đọc truyện</p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className='login-field'>
                <label className='login-label'>Email</label>
                <input
                  ref={inputRef}
                  type='email'
                  className='login-input'
                  placeholder='example@email.com'
                  value={email}
                  onChange={onEmailChange}
                  onFocus={onEmailFocus}
                  onBlur={onEmailBlur}
                  required
                />
              </div>

              {/* Password */}
              <div className='login-field'>
                <label className='login-label'>Mật khẩu</label>
                <input
                  type='password'
                  className='login-input'
                  placeholder='••••••••'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={onPasswordFocus}
                  onBlur={onPasswordBlur}
                  required
                />
              </div>

              {/* Error */}
              {error && <div className='login-error'>{error}</div>}

              {/* Submit */}
              <button type='submit' className='login-btn' disabled={loginMutation.isPending}>
                {loginMutation.isPending && <span className='btn-spinner' />}
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className='login-register' onClick={() => alert('Không cho đăng kí đấy, làm sao?')}>
              Chưa có tài khoản? <span>Đăng ký</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
