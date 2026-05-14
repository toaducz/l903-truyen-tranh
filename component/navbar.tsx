'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import menu from '@/assets/menu.png'
import { useQuery } from '@tanstack/react-query'
import { getCategory } from '@/lib/api/get-category'
import { Category } from '@/lib/api/common/type'
// import { useAuth } from '@/app/auth-provider'
import userIcon from '@/assets/image/bocchi_user.png'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [openMenu, setOpenMenu] = useState<'category' | null>(null)
  const MAX_SEARCH_LENGTH = 100
  const isPublicPage = pathname === '/login' || pathname === '/home'

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    ...getCategory(),
    enabled: !isPublicPage
  })

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

  if (pathname === '/login' || pathname === '/home') return null

  return (
    <nav
      className={`glass-morphism text-white shadow-xl w-full fixed top-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } border-x-0 border-t-0`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link
          href='/'
          className='text-2xl font-heading font-extrabold tracking-tight text-white hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95'
        >
          L903 <span className="text-primary">Manga</span>
        </Link>

        {/* Navigation - Desktop */}
        <div className='hidden lg:flex items-center gap-8 text-sm font-semibold relative'>
          {navLinks.map((link, i) => {
            if (link.dropdown) {
              return (
                <div key={i} className='relative group'>
                  <button
                    onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                    className='flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer'
                  >
                    {link.label}
                    <span className={`transition-transform duration-300 text-[10px] ${openMenu === 'category' ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {openMenu === 'category' && (
                    <div className='absolute left-1/2 -translate-x-1/2 top-full mt-4 w-64 max-h-[70vh] overflow-y-auto bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200'>
                      <div className="grid grid-cols-1 gap-1">
                        {getItems().map(item => {
                          const href = `/category?category=${item.slug}&page=1`
                          return (
                            <Link
                              key={item.slug}
                              href={item.slug === 'loading' ? '#' : href}
                              onClick={() => setOpenMenu(null)}
                              className={`block w-full px-4 py-2.5 text-sm rounded-xl transition-all duration-200 hover:bg-white/10 hover:text-primary ${
                                item.slug === 'loading' ? 'opacity-50 pointer-events-none' : ''
                              }`}
                            >
                              {item.name}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={i}
                href={link.href}
                className='relative text-white/80 hover:text-white transition-colors duration-200 group'
              >
                {link.label}
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
              </Link>
            )
          })}
        </div>

        {/* Search & Actions - Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <form onSubmit={handleSearch} className='relative group'>
            <input
              type='text'
              placeholder='Tìm kiếm truyện...'
              className='pl-4 pr-10 py-2 w-48 lg:w-64 rounded-full bg-surface/80 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:w-80 transition-all duration-300 placeholder:text-white/40 text-sm'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type='submit'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-primary transition-colors disabled:opacity-30'
              disabled={!search.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>

          <Link
            href='/profile'
            className='p-1 rounded-full border-2 border-white/10 hover:border-primary transition-all duration-300 active:scale-95 overflow-hidden shadow-lg hover:shadow-primary/20'
          >
            <Image src={userIcon} alt='user' width={32} height={32} className="rounded-full" />
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href='/profile'
            className='p-1 rounded-full border-2 border-white/10 overflow-hidden'
          >
            <Image src={userIcon} alt='user' width={28} height={28} className="rounded-full" />
          </Link>
          <button 
            className='bg-surface/80 backdrop-blur-xl p-2 rounded-xl border border-white/10 active:scale-90 transition-all' 
            onClick={toggleMenu} 
            aria-label='Toggle menu'
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='lg:hidden bg-surface/98 backdrop-blur-3xl border-t border-white/10 px-4 py-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300'>
          {/* Search - Mobile */}
          <form onSubmit={handleSearch} className='relative'>
            <input
              type='text'
              placeholder='Tìm kiếm truyện...'
              className='w-full pl-4 pr-12 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/40'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type='submit'
              className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary rounded-xl'
              disabled={!search.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>

          {/* Navigation Items - Mobile */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => {
              if (link.dropdown) {
                return (
                  <div key={i} className='flex flex-col'>
                    <button
                      onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                      className='flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white font-medium'
                    >
                      <span>{link.label}</span>
                      <span className={`transition-transform duration-300 ${openMenu === 'category' ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {openMenu === 'category' && (
                      <div className='grid grid-cols-2 gap-2 p-2 ml-4 mt-2 bg-white/5 border border-white/10 rounded-2xl max-h-[40vh] overflow-y-auto'>
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
                              className={`px-3 py-2 text-sm text-white/70 hover:text-primary transition-colors ${
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
                  className='px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-white font-medium'
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>

  )
}
