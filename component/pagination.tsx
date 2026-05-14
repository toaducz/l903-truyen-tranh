import React, { useState } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState('')

  const handleJump = () => {
    let page = parseInt(inputPage)
    if (isNaN(page) || page < 1) page = 1
    if (page > totalPages) page = totalPages
    onPageChange(page)
    setInputPage('')
  }

  const getPageNumbers = () => {
    const delta = 2
    const range: (number | string)[] = []
    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)

    range.push(1)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < totalPages - 1) range.push('...')
    if (totalPages > 1) range.push(totalPages)

    return range
  }

  if (totalPages <= 1) return null

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 mt-6 text-sm text-white pb-10'>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className='w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-20 cursor-pointer transition-all'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-20 cursor-pointer transition-all'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className='flex items-center gap-1.5'>
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={idx} className='w-10 text-center text-white/40'>
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all cursor-pointer ${
                page === currentPage
                  ? 'bg-white/20 border border-white/20 text-white'
                  : 'bg-white/5 border border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-20 cursor-pointer transition-all'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className='w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-20 cursor-pointer transition-all'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
      </button>

      <div className="flex items-center gap-2 ml-4">
        <input
          type='number'
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={e => setInputPage(e.target.value)}
          className='w-16 h-10 bg-white/5 border border-white/10 rounded-xl px-2 text-center text-white focus:outline-none focus:ring-1 focus:ring-white/30 no-spinner'
          placeholder='Trang'
        />
        <button 
          onClick={handleJump} 
          className='h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl cursor-pointer transition-all active:scale-95'
        >
          Đi
        </button>
      </div>
    </div>

  )
}

export default Pagination
