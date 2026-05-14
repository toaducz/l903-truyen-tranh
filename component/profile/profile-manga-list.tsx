'use client'

import Link from 'next/link'
import Image from 'next/image'
import { toggleBookmark } from '@/lib/bookmark'
import { Manga } from '@/lib/local-storage'

type Props = {
  list: Manga[]
  emptyText?: string
  isBookmark?: boolean
}

export default function ProfileMangaList({ list, emptyText, isBookmark = false }: Props) {
  if (!list || list.length === 0) {
    return <p className='text-gray-500'>{emptyText || 'Không có dữ liệu.'}</p>
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4'>
      {list.map(manga => {
        // check truyện đã có chapter đang đọc dở chưa
        const hasChapter = manga.chapter_name && manga.chapter_id

        return (
          <div key={manga.slug} className='relative w-full bg-[#181818] rounded-lg overflow-hidden group'>
            {/* hover */}
            <div className='relative w-full aspect-[2/3]'>
              <Image
                src={manga.image}
                alt={manga.name}
                fill
                unoptimized
                loading='lazy'
                className='object-cover object-center group-hover:opacity-40'
              />

              <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 z-10'>
                <Link
                  href={`/detail-manga/${manga.slug}`}
                  className='bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-md w-32 text-center'
                >
                  Xem thông tin
                </Link>

                {hasChapter ? (
                  <Link
                    href={`/reader/${manga.chapter_id}?slug=${manga.slug}&chapter_name=${manga.chapter_name}`}
                    className='bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 px-3 rounded-md w-32 text-center'
                    title={`Đọc tiếp ${manga.chapter_name}`}
                  >
                    Chapter {manga.chapter_name}
                  </Link>
                ) : (
                  <button
                    disabled
                    className='bg-gray-600 text-gray-400 text-sm py-1.5 px-3 rounded-md w-32 text-center cursor-not-allowed'
                  >
                    Đọc tiếp
                  </button>
                )}
              </div>
            </div>

            <div className='p-2'>
              <Link
                href={`/detail-manga/${manga.slug}`}
                className='block text-sm font-medium truncate hover:text-blue-400'
                title={manga.name}
              >
                {manga.name}
              </Link>
              {hasChapter && <div className='text-xs text-gray-400 truncate mt-0.5'>{manga.chapter_name}</div>}
            </div>

            {isBookmark && (
              <button
                onClick={async () => {
                  try {
                    await toggleBookmark(manga, true)
                    window.location.reload()
                  } catch (err) {
                    console.error('Lỗi xóa bookmark:', err)
                  }
                }}
                className='absolute top-2 right-2 w-6 h-6 flex items-center justify-center 
                 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 cursor-pointer z-20'
              >
                ✕
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
