'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCategory } from '@/api/get-category'
import { Category } from '@/api/common/type'

interface SortControlProps {
  sortField: string
  sortType: string
  selectedCategories?: string[]
  onChange: (field: string, type: string, categories?: string) => void
  isCategory?: boolean
}

export default function SortControl({
  sortField,
  sortType,
  selectedCategories: initialCategories,
  onChange,
  isCategory = true
}: SortControlProps) {
  const [field, setField] = useState(sortField)
  const [type, setType] = useState(sortType)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories || [])
  const [tempCategories, setTempCategories] = useState<string[]>(initialCategories || [])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: categoryData, isLoading: categoryLoading } = useQuery(getCategory())

  const categories: Category[] = categoryLoading
    ? [{ _id: 'loading', slug: 'loading', name: 'Đang tải...' }]
    : (categoryData?.data?.items ?? [])

  // Click ngoài dropdown để đóng
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
        setTempCategories(selectedCategories) // revert temp nếu chưa confirm
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedCategories])

  const toggleTempCategory = (slug: string) => {
    if (tempCategories.includes(slug)) {
      setTempCategories(tempCategories.filter(c => c !== slug))
    } else {
      setTempCategories([...tempCategories, slug])
    }
  }

  const handleConfirm = () => {
    setSelectedCategories(tempCategories)
    onChange(field, type, tempCategories.join(','))
    setDropdownOpen(false)
  }

  const handleChangeField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value
    setField(newField)
    onChange(newField, type, selectedCategories.join(','))
  }

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value
    setType(newType)
    onChange(field, newType, selectedCategories.join(','))
  }

  return (
    <div className='flex flex-wrap gap-3 items-center justify-start mb-6 text-white text-sm px-8'>
      {/* Sort Field */}
      <div className='flex items-center gap-2'>
        <label className='opacity-70'>Sắp xếp theo:</label>
        <select
          value={field}
          onChange={handleChangeField}
          className='bg-slate-800 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
        >
          <option value='_id'>Mặc định</option>
          <option value='modified.time'>Thời gian cập nhật</option>
          <option value='year'>Năm phát hành</option>
        </select>
      </div>

      {/* Sort Type */}
      <div className='flex items-center gap-2'>
        <label className='opacity-70'>Thứ tự:</label>
        <select
          value={type}
          onChange={handleChangeType}
          className='bg-slate-800 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
        >
          <option value='desc'>Giảm dần</option>
          <option value='asc'>Tăng dần</option>
        </select>
      </div>

      {/* Category */}
      {isCategory !== true && <label className='opacity-70'>Thể loại: </label>}
      {isCategory !== true && (
        <div className='relative' ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='bg-slate-800 border border-slate-700 rounded px-2 py-1 cursor-pointer flex flex-wrap gap-1 min-w-[350px]'
          >
            {selectedCategories.length === 0 ? (
              <span className='opacity-50 flex justify-center items-center w-full'>Chọn thể loại</span>
            ) : (
              selectedCategories.map(slug => {
                const cat = categories.find(c => c.slug === slug)
                return (
                  <span key={slug} className='bg-blue-600 rounded px-2 py-0.5 text-xs flex items-center gap-1'>
                    {cat?.name || slug}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        toggleTempCategory(slug)
                      }}
                      className='ml-1'
                    ></button>
                  </span>
                )
              })
            )}
          </div>

          {dropdownOpen && (
            <div className='absolute z-10 mt-1 bg-slate-800 border border-slate-700 rounded max-h-60 overflow-auto w-full p-2'>
              {/* Categories: 2 cột */}
              <div className='grid grid-cols-2 gap-2'>
                {categories.map(cat => (
                  <label key={cat._id} className='flex items-center gap-2 py-1 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={tempCategories.includes(cat.slug)}
                      onChange={() => toggleTempCategory(cat.slug)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>

              {/* Buttons: 1 hàng */}
              <div className='flex gap-2 mt-2'>
                <button
                  onClick={handleConfirm}
                  className='flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 cursor-pointer'
                >
                  Xác nhận
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setTempCategories([])
                    setSelectedCategories([])
                    onChange(field, type, '')
                    setDropdownOpen(false)
                  }}
                  className='flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 cursor-pointer'
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
