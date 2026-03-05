'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../auth-provider'
import ProfileSidebar from '@/component/profile/profile-sidebar'
import ProfileMangaList from '@/component/profile/profile-manga-list'
import { getView } from '@/lib/local-storage'
import { fetchBookmark } from '@/lib/bookmark'
import Link from 'next/link'
import { Manga } from '@/lib/local-storage'

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
          <section className='flex flex-col items-center justify-center min-h-[300px]'>
            <h2 className='text-xl font-semibold mb-4'>Truyện yêu thích</h2>

            {user ? (
              loading ? (
                <p className='text-gray-500'>Đang tải...</p>
              ) : (
                <ProfileMangaList list={bookmarks} emptyText='Bạn chưa có truyện yêu thích nào.' isBookmark={true} />
              )
            ) : (
              <div className='flex flex-col items-center gap-4 mt-8'>
                <p className='text-gray-400 text-center'>Vui lòng đăng nhập để sử dụng tính năng này.</p>
                <Link href='/login' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
                  Đăng nhập
                </Link>
              </div>
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
