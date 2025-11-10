'use client'

import { Suspense, useState, useEffect } from 'react'
import { notFound, useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getListByType } from '@/api/list/get-list-by-type'
import MangaListPage from '@/app/page/manga-list-page'
import Pagination from '@/component/pagination'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import SortControl from '@/component/sort/sort-control'

export default function ListTypePage({ queryKey }: { queryKey: string }) {

  return (
    <Suspense>
      <ListTypePageContent key={queryKey} />
    </Suspense>
  )
}

function ListTypePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type')?.trim() ?? ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const sortFieldParams = String(searchParams.get('sort_field') ?? '_id')
  const sortTypeParams = String(searchParams.get('sort_type') ?? 'desc')
  const categoriesParam = searchParams?.get('category') ?? ''

  const [sortField, setSortField] = useState(sortFieldParams)
  const [sortType, setSortType] = useState(sortTypeParams)
  const [page, setPage] = useState(pageParam)
  const [categories, setCategories] = useState<string[]>(
    categoriesParam ? categoriesParam.split(',').filter(Boolean) : []
  )

  const {
    data: results,
    isFetching,
    isError
  } = useQuery(
    getListByType({
      type: typeParam,
      page,
      sort_field: sortField,
      sort_type: sortType,
      category: categories.join(',')
    })
  )

  const text = results?.data?.titlePage ?? ''
  const totalItems = results?.data?.params?.pagination?.totalItems ?? 0
  const perPage = results?.data?.params?.pagination?.totalItemsPerPage ?? 1
  const totalPages = Math.ceil(totalItems / perPage)

  useEffect(() => {
    setPage(pageParam ?? 1)
  }, [pageParam])

  if (!typeParam) notFound()
  if (isFetching) return <Loading />
  if (isError) return <Error />

  const handleSortChange = (field: string, type: string, categoriesStr?: string) => {
    const cats = categoriesStr?.split(',').filter(Boolean) || []
    setSortField(field)
    setSortType(type)
    setCategories(cats)
    setPage(1)
    router.push(
      `/list?type=${encodeURIComponent(typeParam)}&page=1&sort_field=${field}&sort_type=${type}${cats.length ? `&category=${cats.join(',')}` : ''}`
    )
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    router.push(
      `/list?type=${encodeURIComponent(typeParam)}&page=${newPage}&sort_field=${sortField}&sort_type=${sortType}${categories.length ? `&category=${categories.join(',')}` : ''}`
    )
  }

  return (
    <div>
      {totalItems !== 0 && (
        <div className='px-4 pt-25'>
          <SortControl
            sortField={sortField}
            sortType={sortType}
            selectedCategories={categories}
            onChange={handleSortChange}
            isCategory={false}
          />
        </div>
      )}

      <MangaListPage mangas={results?.data?.items ?? []} title={String(text)} />

      <Pagination currentPage={pageParam} totalPages={totalPages} onPageChange={handlePageChange} />

      <div className='text-sm italic text-white text-center pb-10'>Có {totalItems} kết quả</div>
    </div>
  )
}
