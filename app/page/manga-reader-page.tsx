'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
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
      <div className='flex items-center justify-center min-h-screen bg-black'>
        <Loading />
      </div>
    )
  }

  if (isError || !chapterData || chapterData.status !== 'success') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-black'>
        <Error />
      </div>
    )
  }

  const domain = chapterData.data?.domain_cdn
  const chapter_path = chapterData.data?.item?.chapter_path
  const chapter_image = chapterData.data?.item?.chapter_image ?? []

  return (
    <div className='text-white min-h-screen space-y-10 pt-20 pb-20'>
      <ChapterNavigator url={url} slug={slug} />
      <div className='flex justify-center py-2'>
        <button
          className='px-4 py-1 bg-slate-700 rounded-full hover:bg-slate-600 transition cursor-pointer'
          onClick={() => setIsHorizontal(p => !p)}
        >
          {isHorizontal ? 'Chuyển sang đọc dọc' : 'Chuyển sang đọc ngang (rất lỏ)'}
        </button>
      </div>

      {isHorizontal ? (
        <HorizontalReader domain={domain!} chapterPath={chapter_path!} images={chapter_image} />
      ) : (
        <VerticalReader domain={domain!} chapterPath={chapter_path!} images={chapter_image} />
      )}

      <ChapterNavigator url={url} slug={slug} />
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
    <div className='flex flex-col items-center gap-1'>
      {images.map((img, index) => {
        const imgUrl = `${domain}/${chapterPath}/${img.image_file}`
        return (
          <div key={index} className='relative w-fit max-w-[70%] flex justify-center bg-black'>
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

  const imgUrl = `${domain}/${chapterPath}/${images[current].image_file}`

  return (
    <div
      className='relative w-full flex flex-col items-center justify-center'
      style={{
        height: 'calc(100vh - 7rem)',
        paddingTop: '6rem',
        paddingBottom: '4rem'
      }}
    >
      <div className='relative w-fit max-w-[70%]'>
        <ChapterImage src={imgUrl} isHorizontal />
      </div>

      <div className='absolute inset-y-0 left-0 right-0 flex justify-between items-center px-2 pointer-events-none'>
        <button
          className='pointer-events-auto bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 disabled:opacity-40 cursor-pointer'
          onClick={prevPage}
          disabled={current === 0}
        >
          ⬅
        </button>
        <button
          className='pointer-events-auto bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 disabled:opacity-40 cursor-pointer'
          onClick={nextPage}
          disabled={current === images.length - 1}
        >
          ➡
        </button>
      </div>

      <div className='absolute bottom-3 text-sm text-gray-400'>
        {current + 1} / {images.length}
      </div>
    </div>
  )
}

function ChapterImage({ src, isHorizontal = false }: { src: string; isHorizontal?: boolean }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className={`relative flex justify-center items-center bg-black
        ${isHorizontal ? 'max-h-[calc(100vh-7rem)]' : 'h-auto'} w-full`}
    >
      {isLoading && (
        <div className='absolute inset-0 flex justify-center items-center bg-black/30'>
          <div className='animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent'></div>
        </div>
      )}

      <Image
        src={src}
        alt='Chapter Image'
        width={800}
        height={1200}
        placeholder='blur'
        blurDataURL={placeholder.src}
        unoptimized
        loading='lazy'
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${isHorizontal ? 'max-h-[calc(100vh-7rem)] w-auto object-contain' : 'w-full h-auto object-contain'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  )
}
