'use client'

import React from 'react'
import MangaItem from '@/component/manga/manga-item'
import { Manga } from '@/api/common/type'
import Image from 'next/image'
import bocchi from '@/assets/image/bocchi.jpg'
import Link from 'next/link'

type MangaListPageProps = {
  mangas: Manga[]
  title?: string
}

export default function MangaListPage({ mangas, title = '' }: MangaListPageProps) {
  return (
    <div className='min-h-screen bg-[#0f0f0f] text-white p-4 pt-24'>
      {mangas?.length > 0 && (
        <h1 className='text-2xl font-bold mb-4 text-center pb-4'>{title}</h1>
      )}

      {mangas?.length > 0 ? (
        <div
          className='grid gap-4 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 
          justify-items-center 
          px-2 sm:px-6 md:px-12 lg:px-24 xl:px-32 
          py-6 sm:py-8 md:py-10 
          bg-zinc-900 rounded-xl min-h-screen'
        >
          {mangas.map(manga => (
            <div key={manga.slug} className='w-full flex justify-center'>
              <MangaItem manga={manga} showUpdateTime={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className='min-h-screen flex flex-col items-center justify-center text-slate-100 px-6 py-12'>
          <Image
            unoptimized
            src={bocchi}
            alt='Not Found'
            width={220}
            height={220}
            className='rounded-lg mb-6 object-contain'
          />

          <h1 className='text-2xl md:text-3xl font-bold mb-3'>Không tìm thấy kết quả</h1>
          <Link
            href='/'
            className='mt-3 inline-block px-5 py-2 bg-gray-700 text-white font-medium rounded-lg hover:opacity-80 transition'
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  )
}
