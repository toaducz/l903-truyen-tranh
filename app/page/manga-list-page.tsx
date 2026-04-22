'use client'

import React from 'react'
import MangaItem from '@/component/manga/manga-item'
import { Manga } from '@/lib/api/common/type'
import Image from 'next/image'
import bocchi from '@/assets/image/bocchi.jpg'
import Link from 'next/link'

type MangaListPageProps = {
  mangas: Manga[]
  title?: string
}

export default function MangaListPage({ mangas, title = '' }: MangaListPageProps) {
  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {title && (
          <div className='flex items-center gap-4 mb-10'>
            <div className='h-8 w-1 bg-blue-600 rounded-full'></div>
            <h1 className='text-3xl md:text-4xl text-white'>{title}</h1>
          </div>
        )}

        {mangas?.length > 0 ? (
          <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8'>
            {mangas.map(manga => (
              <MangaItem key={manga.slug} manga={manga} showUpdateTime={true} />
            ))}
          </div>
        ) : (
          <div className='min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 p-8'>
            <Image
              unoptimized
              src={bocchi}
              alt='Not Found'
              width={220}
              height={220}
              className='rounded-lg mb-6 object-contain'
            />

            <h2 className='text-2xl md:text-3xl font-bold mb-3 text-white'>Không tìm thấy kết quả</h2>
            <p className='text-slate-100 max-w-md mx-auto'>
              Rất tiếc, chúng tôi không tìm thấy truyện nào phù hợp với yêu cầu của bạn. Thử tìm kiếm với từ khóa khác nhé!
            </p>
            <Link
              href='/'
              className='mt-3 inline-block px-5 py-2 bg-gray-700 text-white font-medium rounded-lg hover:opacity-80 transition'
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
