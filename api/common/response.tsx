export interface BaseData {
  seoOnPage: unknown // định nghĩa rõ hơn ở file khác
  breadCrumb: unknown
  params: unknown
  items: unknown
  APP_DOMAIN_CDN_IMAGE: string
  APP_DOMAIN_FRONTEND: string
  [key: string]: any // cho phép có thêm field khác ngoài các field bắt buộc
}

// generic
export type ResponseData<T extends BaseData = BaseData> = {
  status: string
  message: string
  data: T
}
