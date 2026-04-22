'use client'

import { useSearchParams, useParams } from 'next/navigation'
import ChapterReaderScreen from '@/app/page/manga-reader-page'
import ScrollToBottomButton from '@/component/chapter/scroll-to-bottom'
import ScrollToTopButton from '@/component/chapter/scroll-to-top'
import { Suspense } from 'react'

export default function MangaReaderPageWrapper() {
  return (
    <Suspense>
      <MangaReaderPage />
    </Suspense>
  )
}

function MangaReaderPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const url = 'https://sv1.otruyencdn.com/v1/api/chapter/' + id
  const slugManga = searchParams.get('slug') ?? ''
  // const chapterId = String(id)
  const backgroundColor = '#0f172a'

  return (
    <div className='min-h-screen w-full bg-[#0f172a]'>
      <ChapterReaderScreen url={url} slug={slugManga} />
      <div className='hidden md:block'>
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </div>
  )
}
