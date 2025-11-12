'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-provider'

type FavoriteButtonProps = {
  slug: string
  name: string
  image: string
}

export default function FavoriteButton({ slug, name, image }: FavoriteButtonProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  // Check trạng thái favorite khi user có và slug có
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user?.id || !slug) return
      setLoading(true)
      try {
        const res = await fetch('/api/bookmark/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        })
        const result = await res.json()
        setIsFavorite(result.exists)
      } catch (err) {
        console.error('Check favorite error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkFavorite()
  }, [slug, user?.id])

  const toggleFavorite = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      if (isFavorite) {
        const res = await fetch('/api/bookmark/change', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        })
        const result = await res.json()
        if (!result.error) setIsFavorite(false)
      } else {
        const res = await fetch('/api/bookmark/change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, name, image })
        })
        const result = await res.json()
        if (!result.error) setIsFavorite(true)
      }
    } catch (err) {
      console.error('Toggle favorite error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.id) {
    return (
      <button
        disabled
        className='px-4 sm:px-5 py-2 border border-slate-600 text-slate-400 rounded-lg text-sm sm:text-base cursor-not-allowed'
      >
        Đăng nhập để yêu thích
      </button>
    )
  }

  if (isFavorite === null) {
    return (
      <button
        disabled
        className='px-4 sm:px-5 py-2 border border-slate-600 text-slate-400 rounded-lg text-sm sm:text-base cursor-not-allowed'
      >
        Đang tải...
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-4 sm:px-5 py-2 border border-slate-600 rounded-lg text-sm sm:text-base transition cursor-pointer ${
        isFavorite
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {loading ? 'Đợi chút...' : isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    </button>
  )
}
