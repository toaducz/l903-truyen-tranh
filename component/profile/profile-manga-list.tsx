'use client'

import Link from 'next/link'
import Image from 'next/image'
import { toggleBookmark } from '@/lib/bookmark'

type Manga = {
  name: string
  image: string
  slug: string
}

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
      {list.map(manga => (
        <div key={manga.slug} className='relative w-full'>
          <Link
            href={`/detail-manga/${manga.slug}`}
            className='block bg-[#181818] rounded-lg overflow-hidden group hover:opacity-80 '
          >
            <div className='relative w-full aspect-[2/3]'>
              <Image
                src={manga.image}
                alt={manga.name}
                fill
                unoptimized
                loading='lazy'
                className='object-cover object-center'
              />
            </div>
            <div className='p-2 text-sm font-medium truncate'>{manga.name}</div>
          </Link>

          {isBookmark && (
            <button
              onClick={() => {
                toggleBookmark(manga, true)
                window.location.href = '/profile'
              }}
              className='absolute top-2 right-2 w-6 h-6 flex items-center justify-center 
                         bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition cursor-pointer'
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
