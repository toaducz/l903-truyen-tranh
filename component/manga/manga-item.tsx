import Link from 'next/link'
import { Manga } from '@/api/common/type'
import Image from 'next/image'
import { caculatingLastTime } from '@/utils/caculating-last-time'
import { getImageManga } from '@/utils/format'

type MangaItemProps = {
  manga: Manga
  appDomain?: string
  showUpdateTime?: boolean
}

export default function MangaItem({
  manga,
  appDomain = 'https://img.otruyenapi.com',
  showUpdateTime = false
}: MangaItemProps) {
  const coverImageUrl = getImageManga(appDomain, manga.thumb_url)
  const title = manga.name || 'Không có tiêu đề'
  const origin_name = manga.origin_name?.[0] ?? 'Không có mô tả'
  const updateDate = caculatingLastTime(manga.updatedAt ?? Date())
  const newChapterName = manga.chaptersLatest[0].chapter_name

  return (
    <Link
      href={`/detail-manga/${manga.slug}`}
      className='group block w-[160px] max-h-80 rounded-lg p-2 transition hover:shadow-lg'
    >
      <div className='relative w-full h-[210px] overflow-hidden rounded-md bg-gray-800 shadow-md'>
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          unoptimized
          placeholder='blur'
          blurDataURL='@/assets/image/placeholder.jpg'
          loading='lazy'
          className='object-cover object-center group-hover:opacity-80'
        />

        {showUpdateTime === true && (
          <div className='absolute inset-0 flex flex-col justify-between p-2 group-hover:opacity-80'>
            {updateDate && (
              <div className='bg-black/70 text-white text-[10px] px-2 py-1 rounded-md self-end shadow-md'>
                Cập nhật {updateDate}
              </div>
            )}
            {newChapterName && (
              <div className='bg-orange-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md self-start shadow-md'>
                Ch. {newChapterName}
              </div>
            )}
          </div>
        )}
      </div>

      <div className='mt-2 text-center space-y-1'>
        <div className='font-semibold text-base text-white line-clamp-2 group-hover:underline group-hover:decoration-[3px] group-hover:decoration-blue-400'>
          {title}
        </div>
        {origin_name ? (
          <div className='text-xs text-gray-400 line-clamp-2 italic'>{origin_name}</div>
        ) : (
          <div className='pt-10'></div>
        )}
      </div>
    </Link>
  )
}
