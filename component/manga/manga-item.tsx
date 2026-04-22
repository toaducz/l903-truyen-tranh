import Link from 'next/link'
import { Manga } from '@/lib/api/common/type'
import Image from 'next/image'
import { caculatingLastTime } from '@/utils/caculating-last-time'
import { getImageManga } from '@/utils/format'
import placeholder from '@/assets/image/placeholder.jpg'

type MangaItemProps = {
  manga: Manga
  appDomain?: string
  showUpdateTime?: boolean
}

export default function MangaItem({
  manga,
  appDomain = 'https://img.otruyenapi.com',
  showUpdateTime = true
}: MangaItemProps) {
  const coverImageUrl = getImageManga(appDomain, manga.thumb_url)
  const title = manga.name || 'Không có tiêu đề'
  const origin_name = manga.origin_name?.[0] ?? 'Không có mô tả'
  const updateDate = caculatingLastTime(manga.updatedAt ?? Date())
  const newChapterName = manga?.chaptersLatest?.[0]?.chapter_name ?? ''

  return (
    <Link
      href={`/detail-manga/${manga.slug}`}
      className='group block relative w-full overflow-hidden rounded-xl bg-zinc-900/50 transition-all duration-300'
    >
      <div className='relative aspect-[2/3] w-full overflow-hidden rounded-t-xl'>
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          unoptimized
          placeholder='blur'
          blurDataURL={placeholder.src}
          loading='lazy'
          className='object-cover transition-all duration-300 group-hover:opacity-60 group-hover:scale-105'
        />

        {showUpdateTime && (
          <div className='absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2'>
            {newChapterName && (
              <div className='bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg'>
                Ch. {newChapterName}
              </div>
            )}
            {updateDate && (
              <div className='bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap'>
                {updateDate}
              </div>
            )}
          </div>
        )}
      </div>

      <div className='p-3 space-y-1'>
        <h3 className='font-semibold text-sm text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors'>
          {title}
        </h3>
        {origin_name && (
          <p className='text-[10px] text-zinc-500 line-clamp-1 italic font-medium'>
            {origin_name}
          </p>
        )}
      </div>
    </Link>
  )
}
