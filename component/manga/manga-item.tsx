import Link from 'next/link'
import { Manga } from '@/lib/api/common/type'
import Image from 'next/image'
import { caculatingLastTime } from '@/utils/caculating-last-time'
import { getImageManga } from '@/utils/format'
import placeholder from '@/assets/image/placeholder.jpg'
import GlassCard from '../ui/glass-card'

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
  const origin_name = manga.origin_name?.[0] ?? ''
  const updateDate = caculatingLastTime(manga.updatedAt ?? Date())
  const newChapterName = manga?.chaptersLatest?.[0]?.chapter_name ?? ''

  return (
    <Link href={`/detail-manga/${manga.slug}`} className='block group'>
      <GlassCard className='relative h-full overflow-hidden !p-0 border-white/5 group-hover:border-primary/50'>
        <div className='relative aspect-[3/4.5] w-full overflow-hidden'>
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            unoptimized
            placeholder='blur'
            blurDataURL={placeholder.src}
            loading='lazy'
            className='object-cover'
          />

          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60' />

          {showUpdateTime && (
            <div className='absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2'>
              {newChapterName && (
                <div className='bg-primary text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg'>
                  Ch. {newChapterName}
                </div>
              )}
              {updateDate && (
                <div className='bg-black/60 text-white/90 text-[10px] px-2 py-1 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap'>
                  {updateDate}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='p-3.5 space-y-1.5'>
          <h3 className='font-heading font-bold text-sm text-white/90 line-clamp-2 leading-snug group-hover:text-primary'>
            {title}
          </h3>
          {origin_name && <p className='text-[11px] text-white/40 line-clamp-1 font-medium'>{origin_name}</p>}
        </div>
      </GlassCard>
    </Link>

  )
}
