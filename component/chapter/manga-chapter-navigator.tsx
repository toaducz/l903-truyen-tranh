'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDetailManga } from '@/lib/api/get-detail-manga'
import { useRouter } from 'next/navigation'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import { Chapter } from '@/lib/api/common/type'

interface ChapterNavigatorProps {
  slug: string
  url: string // chapter_api_data
}

export default function ChapterNavigator({ slug, url }: ChapterNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { data: manga, isLoading, isError } = useQuery(getDetailManga({ slug }))

  const chapters = useMemo(() => manga?.data?.item?.chapters[0].server_data ?? [], [manga])
  const currentIndex = useMemo(() => chapters.findIndex((c: Chapter) => c.chapter_api_data === url), [chapters, url])

  const currentChapter = chapters[currentIndex]
  const currentLabel = currentChapter ? `Chapter ${currentChapter.chapter_name ?? 'Oneshot'}` : 'Danh sách Chapter'

  const navigateTo = (index: number) => {
    const chapter = chapters[index]
    const link = chapter.chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')
    if (!chapter) return
    router.replace(`/reader/${link}?slug=${slug}`)
  }

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
        className={`p-2 hover:opacity-80 cursor-pointer ${currentIndex >= chapters.length - 1 ? 'text-gray-500' : 'text-white'}`}
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
              <ul>
                {chapters.map((item: Chapter) => {
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
                      className={`py-2 px-3 border-b border-gray-700 text-white cursor-pointer hover:bg-slate-700 hover:opacity-80 cursor-pointer ${
                        isCurrent ? 'bg-green-700' : ''
                      }`}
                    >
                      <span className='block hover:opacity-80 cursor-pointer'>
                        Chapter {item.chapter_name ?? 'Oneshot'}
                      </span>
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
