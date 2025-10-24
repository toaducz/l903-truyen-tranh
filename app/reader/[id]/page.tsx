'use client'

import { useSearchParams, useParams } from 'next/navigation'
import ChapterReaderScreen from '@/app/page/manga-reader-screen'
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
    <div className='min-h-screen w-full flex justify-center bg-slate-900' style={{ backgroundColor }}>
      <div className='w-full max-w-[900px] px-4 py-6'>
        <ChapterReaderScreen url={url} slug={slugManga} />
      </div>
    </div>
  )
}
