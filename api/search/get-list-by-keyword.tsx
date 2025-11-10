import { ResponseData, BaseData } from '../common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Manga } from '../common/type'

export interface ChapterLatest {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}

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
  og_type: string
  titleHead: string
  descriptionHead: string
  og_image: string[]
  og_url: string
}

// map với tất cả đống ở trên
export interface ItemsResponseData extends BaseData {
  seoOnPage: SeoOnPage
  params: Params
  items: Manga[]
  breadCrumb: string[]
  titlePage: string
}

type GetListByKeywordRequest = {
  page: number
  keyword: string
  sort_field?: string
  sort_type?: string
  category?: string
}

export const getListByKeyword = ({
  page = 1,
  keyword,
  sort_field = '_id',
  sort_type = 'desc',
  category
}: GetListByKeywordRequest) => {
  return queryOptions({
    queryKey: ['get-list-by-keyword', page, keyword, sort_field, sort_type, category],
    queryFn: () =>
      request<ResponseData<ItemsResponseData>>(otruyen, `v1/api/tim-kiem`, 'GET', {
        page: page,
        keyword: keyword,
        sort_field: sort_field,
        sort_type: sort_type,
        category: category
      })
  })
}
