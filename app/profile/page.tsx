'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../auth-provider'
import ProfileSidebar from '@/component/profile/profile-sidebar'
import ProfileMangaList from '@/component/profile/profile-manga-list'
import { getView } from '@/lib/local-storage'
import { fetchBookmark } from '@/lib/bookmark'

type Manga = {
  name: string
  image: string
  slug: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<'bookmark' | 'history' | 'settings'>('bookmark')
  const [bookmarks, setBookmarks] = useState<Manga[]>([])
  const [history, setHistory] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch bookmark (từ supabase)
  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchBookmark()
      .then(data => setBookmarks(data))
      .finally(() => setLoading(false))
  }, [user])

  // Fetch history (từ localStorage)
  useEffect(() => {
    const viewed = getView()
    setHistory(viewed)
  }, [])

  function clearHistory() {
    localStorage.removeItem('viewHistory')
    setHistory([])
  }

  return (
    <div className='flex min-h-screen bg-[#0b0b0b] text-white pt-25'>
      <ProfileSidebar active={tab} onChange={setTab} />

      <div className='flex-1 p-6'>
        {tab === 'bookmark' && (
          <section>
            <h2 className='text-xl font-semibold mb-4'>Truyện yêu thích</h2>
            {loading ? (
              <p className='text-gray-500'>Đang tải...</p>
            ) : (
              <ProfileMangaList list={bookmarks} emptyText='Bạn chưa có truyện yêu thích nào.' isBookmark={true} />
            )}
          </section>
        )}

        {tab === 'history' && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Truyện đã xem gần đây</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer'
                >
                  Xóa tất cả
                </button>
              )}
            </div>
            <ProfileMangaList list={history} emptyText='Bạn chưa xem truyện nào.' />
          </section>
        )}

        {tab === 'settings' && (
          <section>
            <h2 className='text-xl font-semibold mb-4'>Cài đặt</h2>
            {user ? (
              <>
                <p className='mb-4'>Đăng nhập bằng: {user.email}</p>
                <button
                  onClick={logout}
                  className='px-4 py-2 bg-red-600 text-white rounded hover:opacity-90 cursor-pointer'
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <p>Chưa đăng nhập.</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
