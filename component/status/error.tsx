'use client'

import Image from 'next/image'
import goldship from '@/assets/gif/gold-ship-loading.gif'

export default function Error() {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 bg-[length:200%_200%] animate-[gradient_6s_ease-in-out_infinite] backdrop-blur-sm z-50'>
      <Image
        unoptimized
        src={goldship}
        alt='Loading'
        className='w-40 h-40 mb-6 animate-[pulse_1.5s_ease-in-out_infinite]'
      />
      <div className='w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-pink-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]'></div>
      </div>
      <p className='text-xl font-semibold text-blue-600 dark:text-blue-400 mt-4 animate-[fade-in_0.8s_ease-out]'></p>
      <p>Lỗi rồi</p>
    </div>
  )
}
