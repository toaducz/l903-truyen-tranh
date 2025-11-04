'use client'

import { Suspense, useState, useEffect } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import MangaListPage from '@/app/page/manga-list-page'
import { getListByType } from '@/api/list/get-list-by-type'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import Pagination from '@/component/pagination'
import { useRouter } from 'next/navigation'

// Bọc phần tử cần sử dụng useSearchParams() bằng Suspense
export default function SearchPage() {
  return (
    <Suspense>
      <ListTypePageContent />
    </Suspense>
  )
}

function ListTypePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('type')?.trim() ?? ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const [page, setPage] = useState(pageParam)
  const { data: results, isLoading, isError } = useQuery(getListByType({ type: query, page: page }))
  const text = results?.data?.titlePage ?? ""
  const countText = `Có ${results?.data?.params?.pagination?.totalItems} kết quả`
  const totalPages = Math.ceil((results?.data?.params?.pagination?.totalItems ?? 1) / (results?.data?.params?.pagination?.totalItemsPerPage ?? 1))
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(`/list?type=${query}&page=${newPage}`)
  }

  useEffect(() => {
    setPage(pageParam ?? 1)
  }, [pageParam])

  if (!query) {
    notFound()
  }

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div>
      <MangaListPage mangas={results?.data?.items ?? []} title={String(text)} />
      <Pagination currentPage={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
      <div className='text-sm italic text-white text-center pb-10'>{countText}</div>
    </div>
  )
}
