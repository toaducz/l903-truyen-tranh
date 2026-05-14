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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
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
    }, 400)
  }

  const handleLoadAll = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleChapters(allChapters)
      setIsLoadingMore(false)
    }, 400)
  }

  if (chapters.length === 0) {
    return (
      <div className='flex justify-center mt-20'>
        <span className='text-white/40 italic'>Các chương hiện đang được update, vui lòng quay lại sau</span>
      </div>
    )
  }

  return (
    <section className='bg-white/5 border border-white/10 text-white p-4 rounded-3xl'>
      <div className='flex justify-end mb-6'>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
          className='bg-white/5 text-white text-sm font-bold px-4 py-2 rounded-xl border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50'
        >
          <option value='desc' className='bg-[#0A0A0A]'>Mới nhất</option>
          <option value='asc' className='bg-[#0A0A0A]'>Cũ nhất</option>
        </select>
      </div>

      <div className='flex flex-col gap-2.5'>
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
            className='flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all group'
          >
            <span className='font-bold text-white/90 group-hover:text-primary transition-colors'>
              Chapter {item.chapter_name}
            </span>
            {item.chapter_title && (
              <span className='text-xs text-white/40 truncate max-w-[300px] md:max-w-md font-medium'>
                {item.chapter_title}
              </span>
            )}
          </Link>
        ))}
      </div>


      <div className='flex flex-col items-center justify-center pt-8 pb-4 gap-4'>
        {isLoadingMore ? (
          <div className='flex items-center gap-3 text-primary font-bold animate-pulse'>
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
            <span>Đang xử lý...</span>
          </div>
        ) : visibleChapters.length < allChapters.length ? (
          <div className='flex gap-3'>
            <button
              onClick={handleLoadMore}
              className='px-8 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 cursor-pointer transition-all active:scale-95'
            >
              Tải thêm
            </button>
            <button
              onClick={handleLoadAll}
              className='px-8 py-2.5 bg-primary text-black font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.2)]'
            >
              Tải tất cả
            </button>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <div className='h-px w-24 bg-white/10' />
            <span className='text-white/30 text-xs font-bold uppercase tracking-widest'>Đã tải hết</span>
          </div>
        )}
      </div>
    </section>
  )
}

