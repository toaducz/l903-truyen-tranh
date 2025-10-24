import Image from 'next/image'
import Link from 'next/link'
import bocchi from '@/assets/image/bocchi.jpg'

export default function NotFoundPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-black text-slate-100 px-6 py-12'>
      <div className='flex flex-col items-center text-center  space-y-6'>
        <Image
          unoptimized
          src={bocchi}
          alt='Not Found'
          width={220}
          height={220}
          className='rounded-lg mb-6 object-contain'
        />

        <h1 className='text-2xl md:text-3xl font-bold mb-3'>Đang phát triển...</h1>
        <p>Cảm ơn bạn đã trải nghiệm L903 Truyện tranh! Hiện trang này đang được phát triển, bạn quay lại sau nhé!</p>
        <Link
          href='/'
          className='mt-3 inline-block px-5 py-2 bg-gray-700 text-white font-medium rounded-lg hover:opacity-80 transition'
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
