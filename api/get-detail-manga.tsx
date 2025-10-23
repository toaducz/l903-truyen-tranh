import { ResponseData, BaseData } from './common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Manga } from './common/type'

type Params = {
  slug: string
  crawl_check_url: string
}

type SeoSchema = {
    // "@context": string,
    // "@type": string,
    name: string,
    url: string,
    image: string,
    director: string
}

type SeoOnPage = {
    og_type: string
    titleHead: string
    descriptionHead: string
    seoSchema: SeoSchema
}

type GetDetailMangaRequest = {
    slug: string
}

export interface ItemsResponseData extends BaseData {
    seoOnPage: SeoOnPage
    params: Params
    items: Manga[]
    breadCrumb: string[]
}
export const getDetailManga = ({ slug }: GetDetailMangaRequest) => {
    return queryOptions({
        queryKey: ['get-detail-manga', slug],
        queryFn: () => request<ResponseData<ItemsResponseData>>(otruyen, `v1/api/truyen-tranh/${slug}`, 'GET')
    })
}
