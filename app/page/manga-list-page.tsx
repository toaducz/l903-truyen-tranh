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
  countText?: string
}

export default function MangaListPage({ mangas, title = '', countText = '' }: MangaListPageProps) {
  return (
    <div className='min-h-screen bg-background text-white selection:bg-primary/30'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-10 md:pt-10'>
        {title && (
          <div className='flex flex-col gap-2 mb-12 px-2'>
            <div className='flex items-center gap-4'>
              <div className='h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]'></div>
              <h1 className='font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-white'>{title}</h1>
            </div>
            {countText && <p className='text-sm text-white/40 font-medium ml-6'>{countText}</p>}
          </div>
        )}

        {mangas?.length > 0 ? (
          <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8'>
            {mangas.map(manga => (
              <MangaItem key={manga.slug} manga={manga} showUpdateTime={true} />
            ))}
          </div>
        ) : (
          <div className='min-h-[50vh] flex flex-col items-center justify-center text-center p-8 mt-8'>
            <div className='relative w-48 h-48 mb-8'>
              <Image
                unoptimized
                src={bocchi}
                alt='Not Found'
                fill
                className='rounded-3xl object-cover shadow-2xl grayscale'
              />
            </div>

            <h2 className='font-heading text-3xl font-extrabold mb-4 text-white'>Không tìm thấy kết quả</h2>
            <p className='text-white/50 max-w-md mx-auto mb-10 font-medium leading-relaxed'>
              Không tìm thấy truyện nào phù hợp với yêu cầu của bạn. Thử tìm kiếm với từ khóa khác nhé!
            </p>
            <Link
              href='/'
              className='px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-95'
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
