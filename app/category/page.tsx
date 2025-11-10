'use client'

import { Suspense, useState, useEffect } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import MangaListPage from '@/app/page/manga-list-page'
import { getListByCategory } from '@/api/list/get-list-by-category'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import Pagination from '@/component/pagination'
import { useRouter } from 'next/navigation'
import SortControl from '@/component/sort/sort-control'

// Bọc phần tử cần sử dụng useSearchParams() bằng Suspense
export default function CategoryPage({ queryKey }: { queryKey: string }) {

  return (
    <Suspense>
      <CategoryListPageContent key={queryKey} />
    </Suspense>
  )
}

function CategoryListPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('category')?.trim() ?? ''

  const pageParam = Number(searchParams.get('page') ?? '1')
  const sortFieldParams = String(searchParams.get('sort_field') ?? '_id')
  const sortTypeParams = String(searchParams.get('sort_type') ?? 'desc')

  const [page, setPage] = useState(pageParam)
  const [sortField, setSortField] = useState(sortFieldParams)
  const [sortType, setSortType] = useState(sortTypeParams)

  const {
    data: results,
    isFetching,
    isError
  } = useQuery(getListByCategory({ slug: query, page: page, sort_field: sortField, sort_type: sortType }))

  const text = 'Thể loại: ' + results?.data?.seoOnPage?.titleHead
  const totalItems = results?.data?.params?.pagination?.totalItems ?? 0
  const countText = `Có ${totalItems} kết quả`
  const totalPages = Math.ceil(
    (results?.data?.params?.pagination?.totalItems ?? 1) / (results?.data?.params?.pagination?.totalItemsPerPage ?? 1)
  )

  useEffect(() => {
    setPage(pageParam ?? 1)
  }, [pageParam])

  if (!query) notFound()

  if (isFetching) return <Loading />
  if (isError) return <Error />

  const handleSortChange = (field: string, type: string) => {
    setSortField(field)
    setSortType(type)
    setPage(1)
    router.push(`/category?category=${query}&page=1&sort_field=${field}&sort_type=${type}`)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(`/category?category=${query}&page=${newPage}&sort_field=${sortField}&sort_type=${sortType}`)
  }

  return (
    <div>
      {totalItems !== 0 && (
        <div className='px-4 pt-25'>
          <SortControl sortField={sortField} sortType={sortType} onChange={handleSortChange} />
        </div>
      )}
      <MangaListPage mangas={results?.data?.items ?? []} title={text} />
      <Pagination currentPage={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
      <div className='text-sm italic text-white text-center pb-10'>{countText}</div>
    </div>
  )
}
