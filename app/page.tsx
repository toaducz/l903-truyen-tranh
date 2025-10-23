'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { getHome } from '@/api/get-home'
import { getCategory } from '@/api/get-category'
import { getDetailManga } from '@/api/get-detail-manga'
import HomepageSlider from '@/component/slider/homepage-slider'

// page này là home mẫu thôi, xóa hết làm lại cũng dc, file này giải thích cách fetch api
// do có cái thanh navbar nên phải padding top xuống
// phải xài Link của nextjs để navigate trang, đừng xài router push, bất khả kháng mới xài

export default function MangaPage() {
  const { data: mangas, isLoading, error } = useQuery(getHome())
  const dataTest1 = useQuery(getCategory())
  const dataTest2 = useQuery(getDetailManga({ slug: "dao-hai-tac" }))
  // chỗ này có thể viết sẵn 2 cái component loading với error để xài mấy chỗ khác
  if (isLoading) return <div>Loading...</div>
  if (error || mangas?.status !== 'success') return <div>Error: {(error as Error).message}</div>

  const homePageData = mangas.data.items ?? []

  return (
    <div className='p-6 pt-24'>
      <div className='px-20'>
        <HomepageSlider mangas={homePageData} />
      </div>
      {/* cái này phải viết component để xài lại mà thôi đại đại trước đi */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {mangas?.data?.items.map(manga => {
          const src = mangas.data.APP_DOMAIN_CDN_IMAGE + '/uploads/comics/' + manga.thumb_url
          // console.log(src)

          return (
            <div key={manga._id} className='border rounded-lg p-2 shadow hover:shadow-md transition'>
              <Image
                unoptimized
                src={src}
                alt={manga.name}
                width={200}
                height={250}
                className='w-full h-[250px] object-cover rounded'
              />
              <h2 className='text-lg font-semibold mt-2 line-clamp-2'>{manga.name}</h2>
              <p className='text-sm text-gray-500 italic'>{manga.origin_name[0]}</p>
              <p className='text-xs mt-1'>
                {/* {chỗ này phải viết enums/hàm format lại} */}
                Tình trạng: <span className='font-medium'>{manga.status}</span>
                Cập nhật: <span className='font-medium'>{manga.updatedAt}</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
