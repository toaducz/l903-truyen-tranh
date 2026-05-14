'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDetailManga } from '@/lib/api/get-detail-manga'
import { useRouter } from 'next/navigation'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import { Chapter } from '@/lib/api/common/type'

interface ChapterNavigatorProps {
  slug: string
  url: string // chapter_api_data
  enableKeyboard?: boolean
}

export default function ChapterNavigator({ slug, url, enableKeyboard = false }: ChapterNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { data: manga, isLoading, isError } = useQuery(getDetailManga({ slug }))

  const chapters = useMemo(() => manga?.data?.item?.chapters[0].server_data ?? [], [manga])
  const currentIndex = useMemo(() => chapters.findIndex((c: Chapter) => c.chapter_api_data === url), [chapters, url])

  const currentChapter = chapters[currentIndex]
  const currentLabel = currentChapter ? `Chapter ${currentChapter.chapter_name ?? 'Oneshot'}` : 'Danh sách Chapter'

  const navigateTo = useCallback(
    (index: number) => {
      const chapter = chapters[index]
      if (!chapter) return
      const link = chapter.chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')
      router.replace(`/reader/${link}?slug=${slug}`)
    },
    [chapters, slug, router]
  )

  useEffect(() => {
    if (!enableKeyboard || chapters.length === 0 || currentIndex === -1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // bỏ qua nhập text input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) navigateTo(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < chapters.length - 1) navigateTo(currentIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboard, currentIndex, chapters, slug, navigateTo])

  return (
    <div className='flex justify-around items-center bg-slate-800 border-t border-slate-600 py-2'>
      <button
        className={`p-2 hover:opacity-80 cursor-pointer ${currentIndex <= 0 ? 'text-gray-500' : 'text-white'}`}
        disabled={currentIndex <= 0}
        onClick={() => navigateTo(currentIndex - 1)}
      >
        ←
      </button>

      <button className='text-white font-semibold hover:opacity-80 cursor-pointer' onClick={() => setIsOpen(true)}>
        {currentLabel}
      </button>

      <button
        className={`p-2 hover:opacity-80 cursor-pointer ${
          currentIndex >= chapters.length - 1 ? 'text-gray-500' : 'text-white'
        }`}
        disabled={currentIndex < 0 || currentIndex >= chapters.length - 1}
        onClick={() => navigateTo(currentIndex + 1)}
      >
        →
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 bg-black/80 flex justify-center pt-20' onClick={() => setIsOpen(false)}>
          <div
            className='bg-slate-900 w-full max-w-md mx-2 rounded-lg overflow-y-auto max-h-[80vh] border border-slate-700 '
            onClick={e => e.stopPropagation()}
          >
            {isLoading ? (
              <div className='flex justify-center py-10'>
                <Loading />
              </div>
            ) : isError || !chapters.length ? (
              <div className='text-center text-white py-10'>
                <Error />
                <p className='mt-2 text-gray-300'>Không có chapter nào</p>
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {[...chapters].reverse().map((item: Chapter) => {
                  const isCurrent = item.chapter_api_data === url
                  const link = item.chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')
                  const handleClick = () => {
                    setIsOpen(false)
                    router.push(`/reader/${link}?slug=${slug}`)
                  }

                  return (
                    <li
                      key={item.chapter_api_data}
                      onClick={handleClick}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent ? 'bg-primary text-black font-bold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>Chapter {item.chapter_name ?? 'Oneshot'}</span>
                      {isCurrent && (
                        <span className='text-[10px] font-black uppercase bg-black/20 px-1.5 py-0.5 rounded'>
                          Đang đọc
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>

            )}
          </div>
        </div>
      )}
    </div>
  )
}
