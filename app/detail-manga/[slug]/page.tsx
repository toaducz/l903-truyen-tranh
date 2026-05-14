'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import MangaChaptersList from '@/component/chapter/manga-chapter-list'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import { MangaStatus } from '@/utils/enums'
import { getDetailManga } from '@/lib/api/get-detail-manga'
import { getImageManga, stripHtml } from '@/utils/format'
import { CategoryButtons } from '@/component/category/category-button'
import Link from 'next/link'
import FavoriteButton from '@/component/bookmark/bookmark-button'
import { saveView, getViewBySlug } from '@/lib/local-storage'

const MangaDetailPage: React.FC = () => {
  const { slug } = useParams()
  const { data: manga, isLoading, isError } = useQuery(getDetailManga({ slug: String(slug) }))

  useEffect(() => {
    if (!manga?.data?.item) return
    const item = manga?.data?.item
    const isView = getViewBySlug(String(slug))
    if (isView) return
    saveView({
      name: item?.name || 'Không có tiêu đề',
      image: getImageManga(manga?.data?.APP_DOMAIN_CDN_IMAGE ?? '', item?.thumb_url ?? '') ?? '',
      slug: String(slug) ?? ''
    })
  }, [manga, slug])

  const [isExpanded, setIsExpanded] = React.useState(false)

  if (isLoading) return <Loading />
  if (isError) return <Error />

  const item = manga?.data?.item
  const coverImageUrl = getImageManga(manga?.data?.APP_DOMAIN_CDN_IMAGE ?? '', item?.thumb_url ?? '')
  const title = item?.name || 'Không có tiêu đề'
  const origin_name = item?.origin_name
  const content = stripHtml(item?.content ?? '') ?? 'Không có mô tả'
  const categories = item?.category || []
  const chapters = manga?.data?.item?.chapters || []

  return (
    <div className='min-h-screen bg-black text-white pt-10'>
      <div className='max-w-6xl mx-auto p-6 md:px-12 pt-12 space-y-6'>
        <div className='flex flex-col md:flex-row items-start gap-8 border border-slate-700 bg-slate-800 p-4 rounded-lg shadow-md'>
          <div className='h-72 w-56 mx-auto md:mx-0 flex justify-center'>
            <Image
              unoptimized
              loading='lazy'
              src={coverImageUrl}
              placeholder='blur'
              blurDataURL='@/assets/image/placeholder.jpg'
              alt='Manga Cover'
              width={220}
              height={350}
              className='object-cover object-center rounded-lg'
            />
          </div>

          <div className='flex-1 space-y-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{title}</h1>
              {origin_name && <p className='text-gray-300 italic'>{origin_name}</p>}
            </div>
            <div>
              <div className='font-bold pb-2'>Nội dung:</div>
              <div
                className={`text-gray-100 text-base leading-relaxed ${isExpanded ? '' : 'line-clamp-5'}`}
              >
                {content}
              </div>
              {content.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='text-primary text-sm font-bold mt-2 hover:underline cursor-pointer'
                >
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>

            <div>
              <h3 className='text-gray-200 font-semibold mb-1'>Thể loại:</h3>
              <CategoryButtons categories={categories} />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200 mt-4'>
              <div>
                <span className='font-bold'>Tình trạng: </span>
                {MangaStatus[item?.status as keyof typeof MangaStatus] || 'Không rõ'}
              </div>
              <div>
                <span className='font-bold'>Tác giả: </span>
                <span className='cursor-pointer underline'>{item?.author !== '' ? item?.author : 'Đang cập nhật'}</span>
              </div>
            </div>

            <div className='pt-4 flex flex-wrap gap-3 sm:gap-4 sm:justify-start justify-center'>
              {chapters.length > 0 && chapters[0].server_data.length > 0 && (
                <Link
                  href={{
                    pathname: `/reader/${chapters[0].server_data[
                      chapters[0].server_data.length - 1
                    ].chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')}`,
                    query: {
                      slug: item?.slug,
                      chapter_name: chapters[0].server_data[chapters[0].server_data.length - 1].chapter_name ?? 'Không rõ'
                    }
                  }}
                  className='px-4 sm:px-5 py-2 bg-primary text-black font-bold rounded-lg hover:opacity-90 transition cursor-pointer text-sm sm:text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                >
                  Đọc mới nhất
                </Link>
              )}
              {chapters.length > 0 && chapters[0].server_data.length > 0 && (
                <Link
                  href={{
                    pathname: `/reader/${chapters[0].server_data[0].chapter_api_data.replace(
                      'https://sv1.otruyencdn.com/v1/api/chapter/',
                      ''
                    )}`,
                    query: {
                      slug: item?.slug,
                      chapter_name: chapters[0].server_data[0].chapter_name ?? 'Không rõ'
                    }
                  }}
                  className='px-4 sm:px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition cursor-pointer text-sm sm:text-base border border-white/10'
                >
                  Đọc từ đầu
                </Link>
              )}
              <div>
                <FavoriteButton slug={String(slug) ?? ''} image={coverImageUrl} name={title} />
              </div>
            </div>

          </div>
        </div>
        <MangaChaptersList chapters={chapters} slug={manga?.data?.item?.slug ?? ''} />
      </div>
    </div>
  )
}

export default MangaDetailPage
