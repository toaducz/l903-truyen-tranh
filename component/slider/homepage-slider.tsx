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
    <div ref={sliderRef} className='keen-slider pb-8 relative overflow-hidden'>
      {mangas.map((manga, index) => {
        const coverImageUrl = getImageManga(appDomain, manga.thumb_url)
        const title = manga.name || 'Không có tiêu đề'
        const origin_name = manga.origin_name[0] ?? 'Không có mô tả'
        const categoryNames = manga.category.map(c => c.name).join(', ')
        const updateDay = formatDate(manga.updatedAt)
        const hasChaptersLatest = !!manga.chaptersLatest
        return (
          <div
            key={index}
            className='keen-slider__slide flex items-center justify-between px-8 md:px-16 lg:px-24 py-8 shadow-2xl rounded-2xl bg-zinc-900/60 border border-zinc-800/50 backdrop-blur-sm'
          >
            <div
              className={`w-full md:w-3/5 pr-8 transition-all duration-700 ease-out ${
                currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <p className='text-zinc-400 mb-4 text-sm font-medium'>Cập nhật: {updateDay}</p>
              <h2 className='text-3xl md:text-4xl lg:text-5xl  text-white mb-4 line-clamp-2 leading-tight'>{title}</h2>
              <p className='text-zinc-400 mb-6 line-clamp-2 italic text-sm md:text-base'>{origin_name}</p>
              <div className='flex flex-col gap-2 mb-8'>
                <p className='text-zinc-300 line-clamp-1 text-sm md:text-base'>
                  <span className='font-bold text-zinc-100'>Thể loại: </span> {categoryNames}
                </p>
                <p className='text-zinc-300 text-sm md:text-base'>
                  <span className='font-bold text-zinc-100'>Tình trạng: </span>{' '}
                  {MangaStatus[manga.status as keyof typeof MangaStatus] || 'Không rõ'}
                </p>
              </div>
              <div className='flex space-x-2'>
                <Link
                  href={`detail-manga/${manga.slug}`}
                  className='bg-white hover:opacity-80 text-black px-4 py-2 rounded-lg transition cursor-pointer inline-block'
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
                    className='bg-white hover:opacity-80 text-black px-4 py-2 rounded-lg transition cursor-pointer inline-block'
                  >
                    Đọc chương mới nhất
                  </Link>
                )}
              </div>
            </div>

            <div className='hidden md:flex w-2/5 justify-end'>
              <div className='relative w-64 lg:w-72 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-transform duration-700 ease-in-out hover:scale-105 hover:-translate-y-2 cursor-grab active:cursor-grabbing'>
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
    </div>
  )
}
