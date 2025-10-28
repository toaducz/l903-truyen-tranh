'use client'

import { Suspense } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import MangaListPage from '../page/manga-list-page'
import { getListByKeyword } from '@/api/search/get-list-by-keyword'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'

// Bọc phần tử cần sử dụng useSearchParams() bằng Suspense
export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q')?.trim() ?? ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const { data: results, isLoading, isError } = useQuery(getListByKeyword({ keyword: query, page: pageParam }))
  const text = 'Kết quả cho từ khóa: ' + query

  if (!query) {
    notFound()
  }

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return <MangaListPage mangas={results?.data?.items ?? []} title={text} />
}
