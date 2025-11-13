'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import menu from '@/assets/menu.png'
import { useQuery } from '@tanstack/react-query'
import { getCategory } from '@/lib/api/get-category'
import { Category } from '@/lib/api/common/type'
// import { useAuth } from '@/app/auth-provider'
import userIcon from '@/assets/image/bocchi_user.png'

export default function Navbar() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [openMenu, setOpenMenu] = useState<'category' | null>(null)
  const MAX_SEARCH_LENGTH = 100
  const { data: categoryData, isLoading: categoryLoading } = useQuery(getCategory())

  // const { user } = useAuth()

  const getItems = (): Category[] => {
    if (openMenu === 'category') {
      if (categoryLoading) return [{ _id: 'loading', slug: 'loading', name: 'Đang tải...' }]
      return categoryData?.data?.items ?? []
    }
    return []
  }

  // Ẩn navbar khi cuộn xuống
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setOpenMenu(null)
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.length > MAX_SEARCH_LENGTH) {
      alert(`Từ khóa quá dài (tối đa ${MAX_SEARCH_LENGTH} ký tự), phá hả mạy?!`)
      return
    }
    if (search.trim()) {
      const encoded = encodeURIComponent(search.trim())
      router.push(`/search?q=${encoded}&page=1`)
      setSearch('')
      setIsMenuOpen(false)
    }
  }

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  const navLinks = [
    { href: { pathname: '/list', query: { type: 'truyen-moi', page: 1 } }, label: 'Truyện mới' },
    { href: { pathname: '/list', query: { type: 'sap-ra-mat', page: 1 } }, label: 'Sắp ra mắt' },
    { href: { pathname: '/list', query: { type: 'dang-phat-hanh', page: 1 } }, label: 'Đang phát hành' },
    { href: { pathname: '/list', query: { type: 'hoan-thanh', page: 1 } }, label: 'Hoàn thành' },
    { href: '#', label: 'Thể loại', dropdown: true }
  ]

  return (
    <nav
      className={`bg-slate-900 text-white shadow-md w-screen fixed top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link
          href='/'
          className='text-2xl font-bold text-white hover:text-slate-300 transition-colors duration-200 hover:scale-105'
        >
          L903 Truyện Tranh
        </Link>

        {/* Navigation - Desktop */}
        <div className='hidden lg:flex items-center gap-8 text-base font-medium relative'>
          {navLinks.map((link, i) => {
            if (link.dropdown) {
              return (
                <div key={i} className='relative group'>
                  <button
                    onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                    className='flex items-center gap-1 text-white hover:text-slate-300 transition-colors duration-200 cursor-pointer'
                  >
                    {link.label}
                    <span className='transition-transform duration-200 text-[10px] leading-none'>▼</span>
                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-300 group-hover:w-full'></span>
                  </button>

                  {openMenu === 'category' && (
                    <div className='absolute left-0 top-full mt-2 w-48 max-h-72 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50'>
                      {getItems().map(item => {
                        const href = `/category?category=${item.slug}&page=1`
                        return (
                          <Link
                            key={item.slug}
                            href={item.slug === 'loading' ? '#' : href}
                            onClick={() => setOpenMenu(null)}
                            className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 ${
                              item.slug === 'loading' ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={i}
                href={link.href}
                className='relative text-white hover:text-slate-300 transition-colors duration-200 group'
              >
                {link.label}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-300 group-hover:w-full'></span>
              </Link>
            )
          })}
        </div>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className='hidden sm:flex items-center space-x-2'>
          <input
            type='text'
            placeholder='Tìm theo tên truyện'
            className='px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 placeholder-slate-400 text-sm'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type='submit'
            className='px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:ring-2 focus:ring-slate-600'
            disabled={!search.trim()}
          >
            Tìm
          </button>

          <Link
            key={'user-icon'}
            href={'/profile'}
            className='bg-gray-700 rounded-full p-2 hover:bg-white transition duration-300'
          >
            <Image src={userIcon} alt='user' width={35} height={35}></Image>
          </Link>
        </form>

        {/* Hamburger Menu - Mobile */}
        <button className='lg:hidden focus:outline-none' onClick={toggleMenu} aria-label='Toggle menu'>
          {isMenuOpen ? (
            <span className='block w-6 h-6 relative'>
              <span className='absolute left-0 top-1/2 w-6 h-0.5 bg-white rotate-45'></span>
              <span className='absolute left-0 top-1/2 w-6 h-0.5 bg-white -rotate-45'></span>
            </span>
          ) : (
            <Image src={menu} alt='Menu' width={24} height={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='lg:hidden bg-slate-900 px-4 py-4 flex flex-col gap-3 text-base font-medium border-t border-slate-800'>
          {/* Search - Mobile */}
          <form onSubmit={handleSearch} className='flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Tìm theo tên truyện'
              className='flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 placeholder-slate-400 text-sm'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type='submit'
              className='px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:ring-2 focus:ring-slate-600'
              disabled={!search.trim()}
            >
              Tìm
            </button>
          </form>

          {/* Navigation Items - Mobile */}
          {navLinks.map((link, i) => {
            if (link.dropdown) {
              return (
                <div key={i} className='flex flex-col'>
                  <button
                    onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                    className='flex items-center justify-between px-1 py-2 text-white hover:text-slate-300 transition-colors duration-200'
                  >
                    <span>{link.label}</span>
                    <span className='text-[10px]'>▼</span>
                  </button>

                  {openMenu === 'category' && (
                    <div className='ml-4 mt-1 border-l border-slate-700 pl-3 flex flex-col max-h-60 overflow-y-auto'>
                      {getItems().map(item => {
                        const href = `/category?category=${item.slug}&page=1`
                        return (
                          <Link
                            key={item.slug}
                            href={item.slug === 'loading' ? '#' : href}
                            onClick={() => {
                              setOpenMenu(null)
                              setIsMenuOpen(false)
                            }}
                            className={`py-1 text-sm text-slate-300 hover:text-white ${
                              item.slug === 'loading' ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={i}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className='px-1 py-2 text-white hover:text-slate-300 transition-colors duration-200'
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
