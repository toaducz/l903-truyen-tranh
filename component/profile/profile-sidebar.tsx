'use client'

import { useState } from 'react'

type SidebarProps = {
  active: 'bookmark' | 'history' | 'settings'
  onChange: (tab: 'bookmark' | 'history' | 'settings') => void
}

export default function ProfileSidebar({ active, onChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const items = [
    { key: 'bookmark', label: 'Bookmark' },
    { key: 'history', label: 'Truyện đã xem' },
    { key: 'settings', label: 'Cài đặt' }
  ] as const

  return (
    <>
      {/* Mobile */}
      <div className='md:hidden p-2'>
        <button onClick={() => setIsOpen(true)} className='p-2 bg-gray-800 text-white rounded'>
          {/* Hamburger icon */}
          <span className='text-xl font-bold'> ☰</span>
        </button>
      </div>

      <aside
        className={`
    fixed top-0 left-0 h-full w-56 bg-[#121212] border-r border-gray-800 p-4
    transform transition-transform duration-300 z-[1010]  /* nằm trên overlay */
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:block
  `}
      >
        {/* Close button for mobile */}
        <div className='flex justify-between items-center mb-6 md:hidden'>
          <h2 className='text-lg font-semibold'>Trang cá nhân</h2>
          <button onClick={() => setIsOpen(false)} className='p-1 rounded bg-gray-700 text-white'>
            {/* Close icon */}✕
          </button>
        </div>

        {/* Desktop header */}
        <h2 className='hidden md:block text-lg font-semibold mb-6'>Trang cá nhân</h2>

        <ul className='space-y-2'>
          {items.map(item => (
            <li key={item.key}>
              <button
                onClick={() => {
                  onChange(item.key)
                  setIsOpen(false) // auto close on mobile
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition cursor-pointer ${
                  active === item.key ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
