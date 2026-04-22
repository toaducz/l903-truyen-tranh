'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import placeholder from '@/assets/image/placeholder.jpg'
import { getChapterDetailQueryOptions } from '@/lib/api/chapter/get-detail-chapter'
import ChapterNavigator from '@/component/chapter/manga-chapter-navigator'
import { getViewBySlug, updateChapterView } from '@/lib/local-storage'
import { toggleBookmark, checkBookmark } from '@/lib/bookmark'

interface ChapterReaderScreenProps {
  url: string
  slug: string
}

export default function ChapterReaderScreen({ url, slug }: ChapterReaderScreenProps) {
  const [isHorizontal, setIsHorizontal] = useState(false)

  const { data: chapterData, isLoading, isError } = useQuery(getChapterDetailQueryOptions(url))

  useEffect(() => {
    if (isHorizontal) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isHorizontal])

  useEffect(() => {
    const item = getViewBySlug(slug)

    if (item) {
      const chapter_name = chapterData?.data?.item?.chapter_name
      const chapter_id = chapterData?.data?.item?._id

      if (chapter_name && chapter_id) {
        updateChapterView(item.slug, chapter_name, chapter_id, url)

        const updatedItem = {
          ...item,
          chapter_name: chapter_name,
          chapter_id: chapter_id,
          chapter_url: url
        }

        checkBookmark(slug)
          .then(isFavorite => {
            if (isFavorite) {
              toggleBookmark(updatedItem, false)
            }
          })
          .catch(err => {
            console.error('Lỗi khi check bookmark:', err)
          })
      }
    }
  }, [chapterData, slug, url])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#0f172a]'>
        <Loading />
      </div>
    )
  }

  if (isError || !chapterData || chapterData.status !== 'success') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#0f172a]'>
        <Error />
      </div>
    )
  }

  const domain = chapterData.data?.domain_cdn
  const chapter_path = chapterData.data?.item?.chapter_path
  const chapter_image = chapterData.data?.item?.chapter_image ?? []
  const chapterName = chapterData.data?.item?.chapter_name

  return (
    <div className='text-white min-h-screen flex flex-col'>
      {/* Sticky top bar */}
      <div className='sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-sm border-b border-slate-700/50 px-4 py-5 shrink-0'>
        <div className='max-w-[900px] mx-auto flex items-center justify-between gap-4'>
          {/* Back button */}
          <Link
            href={`/detail-manga/${slug}`}
            className='flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group shrink-0'
          >
            <svg
              className='w-4 h-4 transition-transform group-hover:-translate-x-0.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='hidden sm:inline'>Trang chi tiết</span>
          </Link>

          {/* Chapter name */}
          {chapterName && <span className='text-sm font-semibold text-slate-200 truncate'>Chapter {chapterName}</span>}

          {/* Mode toggle */}
          <button
            className='flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0'
            onClick={() => setIsHorizontal(p => !p)}
          >
            {isHorizontal ? (
              <>
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
                Đọc dọc
              </>
            ) : (
              <>
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
                Đọc ngang
              </>
            )}
          </button>
        </div>
      </div>

      {!isHorizontal && (
        <div className='max-w-[900px] w-full mx-auto pt-4 px-4 shrink-0'>
          <ChapterNavigator url={url} slug={slug} enableKeyboard={true} />
        </div>
      )}

      {/* Reader content */}
      <div className={`flex-1 flex flex-col ${isHorizontal ? '' : 'py-2'}`}>
        {isHorizontal ? (
          <HorizontalReader domain={domain!} chapterPath={chapter_path!} images={chapter_image} />
        ) : (
          <VerticalReader domain={domain!} chapterPath={chapter_path!} images={chapter_image} />
        )}
      </div>

      {!isHorizontal && (
        <div className='max-w-[900px] w-full mx-auto pb-10 px-4 shrink-0'>
          <ChapterNavigator url={url} slug={slug} />
        </div>
      )}
    </div>
  )
}

function VerticalReader({
  domain,
  chapterPath,
  images
}: {
  domain: string
  chapterPath: string
  images: { image_file: string }[]
}) {
  return (
    <div className='flex flex-col items-center'>
      {images.map((img, index) => {
        const imgUrl = `${domain}/${chapterPath}/${img.image_file}`
        return (
          <div key={index} className='w-full max-w-[900px] mx-auto'>
            <ChapterImage src={imgUrl} />
          </div>
        )
      })}
    </div>
  )
}

function HorizontalReader({
  domain,
  chapterPath,
  images
}: {
  domain: string
  chapterPath: string
  images: { image_file: string }[]
}) {
  const [current, setCurrent] = useState(0)

  const nextPage = () => setCurrent(p => Math.min(p + 1, images.length - 1))
  const prevPage = () => setCurrent(p => Math.max(p - 1, 0))

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
      if (e.key === 'ArrowLeft') prevPage()
      if (e.key === 'ArrowRight') nextPage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const imgUrl = `${domain}/${chapterPath}/${images[current].image_file}`

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-[calc(100vh-60px)]'>
      {/* Page counter */}
      <div className='absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none'>
        {current + 1} / {images.length}
      </div>

      {/* Image */}
      <div className='relative h-full w-full flex items-center justify-center p-2'>
        <ChapterImage src={imgUrl} isHorizontal />
      </div>

      {/* Left button */}
      <button
        className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-4 rounded-full disabled:opacity-20 transition cursor-pointer z-10'
        onClick={prevPage}
        disabled={current === 0}
      >
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Right button */}
      <button
        className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-4 rounded-full disabled:opacity-20 transition cursor-pointer z-10'
        onClick={nextPage}
        disabled={current === images.length - 1}
      >
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M9 5l7 7-7 7' />
        </svg>
      </button>
    </div>
  )
}

function ChapterImage({ src, isHorizontal = false }: { src: string; isHorizontal?: boolean }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className={`relative flex justify-center items-center bg-[#0f172a]
        ${isHorizontal ? 'h-full w-full' : 'w-full'}`}
    >
      {isLoading && (
        <div className='absolute inset-0 flex justify-center items-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent'></div>
        </div>
      )}

      <Image
        src={src}
        alt='Chapter Image'
        width={1200}
        height={1800}
        placeholder='blur'
        blurDataURL={placeholder.src}
        unoptimized
        loading='lazy'
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${isHorizontal ? 'max-h-full max-w-full h-auto w-auto object-contain' : 'w-full h-auto object-contain'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}
