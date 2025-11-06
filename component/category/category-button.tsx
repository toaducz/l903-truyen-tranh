import Link from 'next/link'
import { Category } from '@/api/common/type'

export const CategoryButtons: React.FC<{ categories: Category[] }> = ({ categories }) => {
  if (!categories || categories.length === 0) return null

  return (
    <div className='flex flex-wrap gap-2 pt-2'>
      {categories.map((cat, index) => (
        <Link
          key={cat._id + index}
          href={`/category?category=${cat.slug}`}
          className='px-3 py-1 rounded-full text-sm font-medium bg-green-800 text-white hover:bg-slate-500 transition'
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
