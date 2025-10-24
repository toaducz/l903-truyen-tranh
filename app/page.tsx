'use client'

import { useQuery } from '@tanstack/react-query'
import { getHome } from '@/api/get-home'
import { getListByType } from '@/api/list/get-list-by-type'
import { getListByCategory } from '@/api/list/get-list-by-category'
import HomepageSlider from '@/component/slider/homepage-slider'
import MangaItem from '@/component/manga/manga-item'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'
import Link from 'next/link'
import { Manga } from '@/api/common/type'

type MangaSectionProps = {
  title: string
  items?: Manga[]
  isLoading?: boolean
  isError?: boolean
}

function MangaSection({ title, items, isLoading, isError }: MangaSectionProps) {
  if (isLoading) {
    return (
      <section className="mt-10 flex justify-center">
        <Loading />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="mt-10 flex justify-center">
        <Error />
      </section>
    )
  }

  if (!items?.length) return null

  return (
    <section className="pb-6">
      <Link href='/' className="flex items-center justify-center mb-10 font-bold text-2xl underline decoration-[3px] decoration-blue-400 cursor-pointer hover:opacity-90">
        {title}
      </Link>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {items.map((manga) => (
            <MangaItem key={manga._id} manga={manga} showUpdateTime={true} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MangaPage() {
  const { data: homePage, isLoading, error } = useQuery(getHome())
  const { data: mangas, isLoading: mangaLoading, error: mangaError } = useQuery(getListByCategory({ slug: 'manga', page: 1 }))
  const { data: manhua, isLoading: manhuaLoading, error: manhuaError } = useQuery(getListByCategory({ slug: 'manhua', page: 1 }))
  const { data: manhwa, isLoading: manhwaLoading, error: manhwaError } = useQuery(getListByCategory({ slug: 'manhwa', page: 1 }))
  const { data: webtoon, isLoading: webtoonLoading, error: webtoonError } = useQuery(getListByCategory({ slug: 'webtoon', page: 1 }))
  const { data: mangaUpdate, isLoading: mangaUpdateLoading, error: mangaUpdateError } = useQuery(getListByType({ type: 'sap-ra-mat', page: 1 }))

  if (isLoading) return <Loading />
  if (error || homePage?.status !== 'success') return <Error />

  const homePageData = [...(homePage?.data?.items ?? [])].sort(() => Math.random() - 0.5).slice(0, 14)
  const mangaData = mangas?.data?.items?.slice(0, 14) ?? []
  const manhuaData = manhua?.data?.items?.slice(0, 7) ?? []
  const manhwaData = manhwa?.data?.items?.slice(0, 7) ?? []
  const webtoonData = webtoon?.data?.items?.slice(0, 7) ?? []
  const mangaUpdateData = mangaUpdate?.data?.items?.slice(0, 7) ?? []

  return (
    <div className="p-6 pt-24 bg-black">
      <div className="px-20">
        <HomepageSlider mangas={homePage?.data?.items} />
      </div>

      <MangaSection title="TRUYỆN MỚI CẬP NHẬT" items={homePageData} />
      <MangaSection title="MANGA" items={mangaData} isLoading={mangaLoading} isError={!!mangaError} />
      <MangaSection title="MANHUA" items={manhuaData} isLoading={manhuaLoading} isError={!!manhuaError} />
      <MangaSection title="MANHWA" items={manhwaData} isLoading={manhwaLoading} isError={!!manhwaError} />
      <MangaSection title="WEBTOON" items={webtoonData} isLoading={webtoonLoading} isError={!!webtoonError} />
      <MangaSection title="SẮP RA MẮT" items={mangaUpdateData} isLoading={mangaUpdateLoading} isError={!!mangaUpdateError} />
    </div>
  )
}
