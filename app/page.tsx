'use client'

import { useQuery } from '@tanstack/react-query'
import { getHome } from '@/api/get-home'
import { getCategory } from '@/api/get-category'
import { getDetailManga } from '@/api/get-detail-manga'
import HomepageSlider from '@/component/slider/homepage-slider'
import MangaItem from '@/component/manga/manga-item'
import Loading from '@/component/status/loading'
import Error from '@/component/status/error'

// page này là home mẫu thôi, xóa hết làm lại cũng dc, file này giải thích cách fetch api
// do có cái thanh navbar nên phải padding top xuống
// phải xài Link của nextjs để navigate trang, đừng xài router push, bất khả kháng mới xài

export default function MangaPage() {
  const { data: mangas, isLoading, error } = useQuery(getHome())
  // const dataTest1 = useQuery(getCategory())
  // const dataTest2 = useQuery(getDetailManga({ slug: 'dao-hai-tac' }))
  // chỗ này có thể viết sẵn 2 cái component loading với error để xài mấy chỗ khác
  if (isLoading) return <Loading />
  if (error || mangas?.status !== 'success') return <Error />

  const homePageData = mangas.data.items ?? []

  return (
    <div className='p-6 pt-24'>
      <div className='px-20'>
        <HomepageSlider mangas={homePageData} />
      </div>
      <h1 className='flex items-center justify-center pb-10 font-bold text-2xl'>TRUYỆN MỚI CẬP NHẬT</h1>
      <div className='flex justify-center items-center min-h-screen'>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
          {mangas?.data?.items.map(manga => (
            <MangaItem key={manga._id} manga={manga} showUpdateTime={true} />
          ))}
        </div>
      </div>
    </div>
  )
}
