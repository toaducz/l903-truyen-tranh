'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-provider'
import { checkBookmark, toggleBookmark } from '@/lib/bookmark'

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
    if (!user?.id || !slug) return
    setLoading(true)
    checkBookmark(slug)
      .then(setIsFavorite)
      .finally(() => setLoading(false))
  }, [slug, user?.id])

  const handleToggle = async () => {
    if (!user?.id) return
    setLoading(true)
    const newStatus = await toggleBookmark({ slug, name, image }, isFavorite ?? false)
    setIsFavorite(newStatus)
    setLoading(false)
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
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 sm:px-5 py-2 border border-slate-600 rounded-lg text-sm sm:text-base transition cursor-pointer ${
        isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {loading ? 'Đợi chút...' : isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    </button>
  )
}
