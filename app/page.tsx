'use client'

import { useQuery } from '@tanstack/react-query'
import { getHome } from '@/lib/api/get-home'
import { getListByType } from '@/lib/api/list/get-list-by-type'
import { getListByCategory } from '@/lib/api/list/get-list-by-category'
import HomepageSlider from '@/component/slider/homepage-slider'
import MangaItem from '@/component/manga/manga-item'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import Link from 'next/link'
import { Manga } from '@/lib/api/common/type'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

type MangaSectionProps = {
  title: string
  items?: Manga[]
  isLoading?: boolean
  isError?: boolean
  link?: string
  animation?: boolean
}

function MangaSection({ title, items, isLoading, isError, link = '/', animation = false }: MangaSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animation || !sectionRef.current) return

    sectionRef.current.querySelectorAll('.manga-item').forEach(el => {
      ;(el as HTMLElement).style.opacity = '0'
      ;(el as HTMLElement).style.transform = 'translateY(30px)'
    })

    animate(sectionRef.current.querySelectorAll('.manga-item'), {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: stagger(60),
      duration: 1000,
      easing: 'easeOutExpo'
    })
  }, [animation, items])

  if (isLoading) {
    return (
      <section className='py-12 flex justify-center'>
        <Loading />
      </section>
    )
  }

  if (isError) {
    return (
      <section className='py-12 flex justify-center'>
        <Error />
      </section>
    )
  }

  if (!items?.length) return null

  return (
    <section ref={sectionRef} className='py-12'>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <h2 className='font-heading font-extrabold text-2xl md:text-3xl tracking-tight text-white'>
            {title}
          </h2>
        </div>
        <Link
          href={link}
          className='text-sm font-bold text-white/40 hover:text-primary transition-colors flex items-center gap-1 group/link'
        >
          Xem tất cả
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>
      
      <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6'>
        {items.map(manga => (
          <div key={manga._id} className='manga-item'>
            <MangaItem manga={manga} showUpdateTime={true} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function MangaPage() {
  const { data: homePage, isLoading, error } = useQuery(getHome())
  const {
    data: mangas,
    isLoading: mangaLoading,
    error: mangaError
  } = useQuery(getListByCategory({ slug: 'manga', page: 1 }))
  const {
    data: manhua,
    isLoading: manhuaLoading,
    error: manhuaError
  } = useQuery(getListByCategory({ slug: 'manhua', page: 1 }))
  const {
    data: manhwa,
    isLoading: manhwaLoading,
    error: manhwaError
  } = useQuery(getListByCategory({ slug: 'manhwa', page: 1 }))
  const {
    data: webtoon,
    isLoading: webtoonLoading,
    error: webtoonError
  } = useQuery(getListByCategory({ slug: 'webtoon', page: 1 }))
  const {
    data: mangaUpdate,
    isLoading: mangaUpdateLoading,
    error: mangaUpdateError
  } = useQuery(getListByType({ type: 'sap-ra-mat', page: 1 }))

  if (isLoading) return <Loading />
  if (error || homePage?.status !== 'success') return <Error />

  const homePageData = [...(homePage?.data?.items ?? [])].sort(() => Math.random() - 0.5).slice(0, 14)
  const mangaData = mangas?.data?.items?.slice(0, 14) ?? []
  const manhuaData = manhua?.data?.items?.slice(0, 7) ?? []
  const manhwaData = manhwa?.data?.items?.slice(0, 7) ?? []
  const webtoonData = webtoon?.data?.items?.slice(0, 7) ?? []
  const mangaUpdateData = mangaUpdate?.data?.items?.slice(0, 7) ?? []

  return (
    <div className='max-w-[1600px] mx-auto p-6 pt-24 md:pt-32'>
      <div className='mb-12'>
        <HomepageSlider mangas={homePage?.data?.items} />
      </div>
      
      <div className='space-y-4'>
        <MangaSection title='Truyện mới cập nhật' items={homePageData} link={'/list?type=truyen-moi'} animation={true} />
        <MangaSection
          title='Manga'
          items={mangaData}
          isLoading={mangaLoading}
          isError={!!mangaError}
          link={'/category?category=manga'}
          animation={true}
        />
        <MangaSection
          title='Manhua'
          items={manhuaData}
          isLoading={manhuaLoading}
          isError={!!manhuaError}
          link={'/category?category=manhua'}
          animation={true}
        />
        <MangaSection
          title='Manhwa'
          items={manhwaData}
          isLoading={manhwaLoading}
          isError={!!manhwaError}
          link={'/category?category=manhwa'}
          animation={true}
        />
        <MangaSection
          title='Webtoon'
          items={webtoonData}
          isLoading={webtoonLoading}
          isError={!!webtoonError}
          link={'/category?category=webtoon'}
          animation={true}
        />
        <MangaSection
          title='Sắp ra mắt'
          items={mangaUpdateData}
          isLoading={mangaUpdateLoading}
          isError={!!mangaUpdateError}
          link={'/list?type=sap-ra-mat'}
          animation={true}
        />
      </div>
    </div>
  )
}

