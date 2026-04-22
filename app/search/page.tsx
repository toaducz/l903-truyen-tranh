'use client'

import { Suspense, useState, useEffect } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import MangaListPage from '../page/manga-list-page'
import { getListByKeyword } from '@/lib/api/search/get-list-by-keyword'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import Pagination from '@/component/pagination'
import { useRouter } from 'next/navigation'
import SortControl from '@/component/sort/sort-control'

// Bọc phần tử cần sử dụng useSearchParams() bằng Suspense
export default function SearchPage({ queryKey }: { queryKey: string }) {
  return (
    <Suspense>
      <SearchPageContent key={queryKey} />
    </Suspense>
  )
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q')?.trim() ?? ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const sortFieldParams = String(searchParams.get('sort_field') ?? '_id')
  const sortTypeParams = String(searchParams.get('sort_type') ?? 'desc')
  const categoriesParam = searchParams?.get('category') ?? ''

  const [page, setPage] = useState(pageParam)
  const [sortField, setSortField] = useState(sortFieldParams)
  const [sortType, setSortType] = useState(sortTypeParams)
  const [categories, setCategories] = useState<string[]>(
    categoriesParam ? categoriesParam.split(',').filter(Boolean) : []
  )

  const {
    data: results,
    isFetching,
    isError
  } = useQuery(
    getListByKeyword({
      keyword: query,
      page: page,
      sort_field: sortField,
      sort_type: sortType,
      category: categories.join(',')
    })
  )

  const text = 'Kết quả cho từ khóa: ' + query
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

  const handleSortChange = (field: string, type: string, categoriesStr?: string) => {
    const cats = categoriesStr?.split(',').filter(Boolean) || []
    setSortField(field)
    setSortType(type)
    setCategories(cats)
    setPage(1)
    router.push(
      `/search?q=${encodeURIComponent(query)}&page=1&sort_field=${field}&sort_type=${type}${
        cats.length ? `&category=${cats.join(',')}` : ''
      }`
    )
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(
      `/search?q=${encodeURIComponent(query)}&page=${newPage}&sort_field=${sortField}&sort_type=${sortType}${
        categories.length ? `&category=${categories.join(',')}` : ''
      }`
    )
  }

  return (
    <div className='pt-24 min-h-screen bg-[#0a0a0a]'>
      {totalItems !== 0 && (
        <div className='px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto'>
          <SortControl
            sortField={sortField}
            sortType={sortType}
            onChange={handleSortChange}
            selectedCategories={categories}
            isCategory={false}
          />
        </div>
      )}

      <MangaListPage mangas={results?.data?.items ?? []} title={text} />

      <Pagination currentPage={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />
      <div className='text-sm italic text-zinc-400 text-center pb-10'>{countText}</div>
    </div>
  )
}
