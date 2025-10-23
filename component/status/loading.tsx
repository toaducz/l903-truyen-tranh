'use client'

import Image from 'next/image'
import goldship from '@/assets/gif/gold-ship-loading.gif'

export default function Loading() {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-black'>
      <Image
        unoptimized
        src={goldship}
        alt='Loading'
        className='w-40 h-40 mb-6 animate-[pulse_1.5s_ease-in-out_infinite]'
      />
      <p className='text-xl font-semibold text-blue-600 dark:text-blue-400 mt-4 animate-[fade-in_0.8s_ease-out]'></p>
    </div>
  )
}
