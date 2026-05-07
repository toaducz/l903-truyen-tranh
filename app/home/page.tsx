import Image from 'next/image'
import bocchi from '@/assets/image/bocchi.jpg'

export default function HomePage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-black text-slate-100 px-6 py-12'>
      <div className='flex flex-col items-center text-center space-y-6'>
        <Image
          unoptimized
          src={bocchi}
          alt='Service Unavailable'
          width={220}
          height={220}
          className='rounded-lg mb-6 object-contain'
        />

        <h1 className='text-2xl md:text-3xl font-bold mb-3'>Dịch vụ hiện không khả dụng</h1>
        <p>Hệ thống hiện đang bảo trì hoặc chưa sẵn sàng. Vui lòng quay lại sau!</p>
      </div>
    </div>
  )
}
