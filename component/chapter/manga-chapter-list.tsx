'use client'

import { useState, useEffect, useMemo } from 'react'
import { Chapter } from '@/lib/api/common/type'
import Link from 'next/link'

interface Chapters {
  server_name: string
  server_data: Chapter[]
}

interface MangaChaptersListProps {
  chapters: Chapters[]
  slug: string
}

export default function MangaChaptersList({ chapters, slug }: MangaChaptersListProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [visibleChapters, setVisibleChapters] = useState<Chapter[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 20

  const allChapters = useMemo(() => {
    const merged = chapters.flatMap(server => server.server_data)
    const sorted = [...merged].sort((a, b) =>
      sortOrder === 'asc'
        ? Number(a.chapter_name) - Number(b.chapter_name)
        : Number(b.chapter_name) - Number(a.chapter_name)
    )
    return sorted
  }, [chapters, sortOrder])

  useEffect(() => {
    setPage(1)
    setVisibleChapters(allChapters.slice(0, limit))
  }, [allChapters])

  const handleLoadMore = () => {
    if (visibleChapters.length >= allChapters.length || isLoadingMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      const nextPage = page + 1
      const newData = allChapters.slice(0, nextPage * limit)
      setVisibleChapters(newData)
      setPage(nextPage)
      setIsLoadingMore(false)
    }, 500)
  }

  if (chapters.length === 0) {
    return (
      <div className='flex justify-center mt-20'>
        <span className='text-slate-400 italic'>Các chương hiện đang được update, vui lòng quay lại sau</span>
      </div>
    )
  }

  return (
    <section className='bg-slate-900 text-white px-3 py-4 rounded-lg'>
      <div className='flex justify-between mb-4'>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
          className='bg-slate-800 text-white p-2 rounded-md border border-slate-700 cursor-pointer'
        >
          <option value='asc'>Cũ nhất</option>
          <option value='desc'>Mới nhất</option>
        </select>
      </div>

      <div className='space-y-2'>
        {visibleChapters.map(item => (
          <Link
            key={item.chapter_api_data}
            href={{
              pathname: `/reader/${item.chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')}`,
              query: {
                slug,
                chapter_name: item.chapter_name ?? 'Không rõ'
              }
            }}
            className='w-full block text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer'
          >
            <span className='font-bold italic text-white'>
              Chapter {item.chapter_name}
              {item.chapter_title && <span>: {item.chapter_title}</span>}
            </span>
          </Link>
        ))}

        <div className='flex justify-center py-4'>
          {isLoadingMore ? (
            <div className='flex flex-col items-center text-slate-300'>
              <div className='animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent mb-2'></div>
              <span>Đang tải thêm chapters...</span>
            </div>
          ) : visibleChapters.length < allChapters.length ? (
            <button
              onClick={handleLoadMore}
              className='px-4 py-2 bg-gray-700 hover:opacity-80 rounded-md text-white font-semibold cursor-pointer'
            >
              Tải thêm
            </button>
          ) : (
            <span className='text-slate-400 italic'>Đã tải hết các chương</span>
          )}
        </div>
      </div>
    </section>
  )
}
