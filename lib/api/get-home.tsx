import { ResponseData, BaseData } from './common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Manga } from './common/type'

type Pagination = {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  pageRanges: number
}

type Params = {
  type_slug: string
  filterCategory: string[]
  sortField: string
  pagination: Pagination
  itemsUpdateInDay: number
}

type SeoOnPage = {
  titleHead: string
  descriptionHead: string
  og_type: string
  og_image: string[]
}

// map với tất cả đống ở trên
export interface ItemsResponseData extends BaseData {
  seoOnPage: SeoOnPage
  params: Params
  items: Manga[]
  breadCrumb: string[]
}

export const getHome = () => {
  return queryOptions({
    queryKey: ['get-home'],
    queryFn: () => request<ResponseData<ItemsResponseData>>(otruyen, `v1/api/home`)
  })
}
