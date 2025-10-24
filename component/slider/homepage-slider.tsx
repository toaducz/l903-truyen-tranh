'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import '@/component/slider/style.css'
import Image from 'next/image'
import Link from 'next/link'
import { Manga } from '@/api/common/type'
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

        return (
          <div
            key={index}
            className='keen-slider__slide flex items-center justify-between px-40 shadow rounded-2xl bg-zinc-900'
          >
            <div
              className={`w-2/3 pr-8 transition-all duration-700 ease-out ${
                currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <p className='text-gray-300 mb-6 line-clamp-2 italic'>Cập nhật: {updateDay}</p>
              <h2 className='text-3xl font-bold text-white mb-3 line-clamp-2'>{title}</h2>
              <p className='text-gray-300 mb-6 line-clamp-2 italic'>{origin_name}</p>
              <p className='text-gray-300 mb-2 line-clamp-2'>
                <span className='font-bold'>Thể loại: </span> {categoryNames}
              </p>
              <p className='text-gray-300 mb-6 line-clamp-2'>
                <span className='font-bold'>Tình trạng: </span>{' '}
                {MangaStatus[manga.status as keyof typeof MangaStatus] || 'Không rõ'}
              </p>
              <div className='flex space-x-2'>
                <Link
                  href={`detail-manga/${manga.slug}`}
                  className='bg-white hover:opacity-80 text-black px-4 py-2 rounded-lg transition cursor-pointer inline-block'
                >
                  Xem chi tiết
                </Link>
                <Link
                  href={{
                    pathname: `/reader/${manga?.chaptersLatest[0]?.chapter_api_data.replace('https://sv1.otruyencdn.com/v1/api/chapter/', '')}`,
                    query: {
                      slug: manga?.slug,
                      chapter_name: manga?.chaptersLatest[0]?.chapter_name ?? 'Không rõ'
                    }
                  }}
                  className='bg-white hover:opacity-80 text-black px-4 py-2 rounded-lg transition cursor-pointer inline-block'
                >
                  Đọc chương mới nhất
                </Link>
              </div>
            </div>

            <div className='w-1/2 flex justify-end'>
              <Image
                src={coverImageUrl}
                alt={title}
                className='object-cover rounded-xl shadow-lg transition-transform duration-700 ease-in-out hover:scale-105 cursor-grabbing'
                width={250}
                height={400}
                unoptimized
                loading='lazy'
                placeholder='blur'
                blurDataURL={placeholder.src}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
