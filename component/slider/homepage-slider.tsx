'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import '@/component/slider/style.css'
import Image from 'next/image'
import Link from 'next/link'
import { Manga } from '@/lib/api/common/type'
import { MangaStatus } from '@/utils/enums'
import { formatDate } from '@/utils/format'
import { useState } from 'react'
import { getImageManga } from '@/utils/format'
import placeholder from '@/assets/image/placeholder.jpg'

type HomepageSliderProps = {
  mangas: Manga[]
  appDomain?: string
}

export default function HomepageSlider({ mangas, appDomain = 'https://img.otruyenapi.com' }: HomepageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 3000)
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <div ref={sliderRef} className='keen-slider pb-12 relative overflow-hidden group min-h-[80vh]'>
      {mangas.map((manga, index) => {
        const coverImageUrl = getImageManga(appDomain, manga.thumb_url)
        const title = manga.name || 'Không có tiêu đề'
        const origin_name = manga.origin_name[0] ?? ''
        const categoryNames = manga.category.map(c => c.name).join(', ')
        const updateDay = formatDate(manga.updatedAt)
        const hasChaptersLatest = !!manga.chaptersLatest
        return (
          <div
            key={index}
            className='keen-slider__slide flex items-center justify-between px-6 md:px-16 lg:px-24 py-12 min-h-[500px] md:min-h-[600px] rounded-[2.5rem] relative overflow-hidden border border-white/5'
          >
            {/* Background Blur Image */}
            <div className='absolute inset-0 z-0 opacity-20 blur-3xl scale-110 pointer-events-none'>
              <Image src={coverImageUrl} alt='' fill className='object-cover' unoptimized />
            </div>

            <div className='relative z-10 w-full md:w-3/5'>
              <div className='flex items-center gap-3 mb-6'>
                <span className='px-3 py-1 bg-primary text-black rounded-full text-[10px] font-bold tracking-wider uppercase'>
                  Cập nhật: {updateDay}
                </span>
                <span className='px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10'>
                  {MangaStatus[manga.status as keyof typeof MangaStatus] || 'Không rõ'}
                </span>
              </div>

              <h2 className='font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 line-clamp-2 leading-[1.1] tracking-tight'>
                {title}
              </h2>

              <p className='text-white/60 mb-8 line-clamp-2 font-medium text-lg max-w-xl'>{origin_name}</p>

              <div className='flex flex-wrap gap-2 mb-10'>
                {manga.category.slice(0, 4).map(cat => (
                  <span
                    key={cat.slug}
                    className='px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-white/80 hover:bg-white/10'
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <div className='flex flex-wrap gap-4'>
                <Link
                  href={`detail-manga/${manga.slug}`}
                  className='bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-2xl font-bold text-sm transition-transform active:scale-95 shadow-lg'
                >
                  Xem chi tiết
                </Link>
                {hasChaptersLatest && (
                  <Link
                    href={{
                      pathname: `/reader/${manga?.chaptersLatest[0]?.chapter_api_data.replace(
                        'https://sv1.otruyencdn.com/v1/api/chapter/',
                        ''
                      )}`,
                      query: {
                        slug: manga?.slug,
                        chapter_name: manga?.chaptersLatest[0]?.chapter_name ?? 'Không rõ'
                      }
                    }}
                    className='bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-transform active:scale-95'
                  >
                    Đọc chương mới nhất
                  </Link>
                )}
              </div>
            </div>

            <div className='hidden md:flex w-2/5 justify-end'>
              <div className='relative w-64 lg:w-80 aspect-[3/4.5] rounded-3xl overflow-hidden shadow-2xl border border-white/10'>
                <Image
                  src={coverImageUrl}
                  alt={title}
                  fill
                  className='object-cover'
                  unoptimized
                  loading='lazy'
                  placeholder='blur'
                  blurDataURL={placeholder.src}
                />
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Dots */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
        {mangas.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === i ? 'w-8 bg-primary shadow-lg' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
