import { Manga } from './local-storage'

// check bookmark
export async function checkBookmark(slug: string): Promise<boolean> {
  try {
    const res = await fetch('/api/bookmark/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })
    const json = await res.json()
    return json.exists ?? false
  } catch (err) {
    console.error('Check favorite error:', err)
    return false
  }
}

// toggle
export async function toggleBookmark(manga: Manga, isFavorite: boolean): Promise<boolean> {
  try {
    const method = isFavorite ? 'DELETE' : 'POST'
    const body = isFavorite
      ? { slug: manga.slug }
      : {
          slug: manga.slug,
          name: manga.name,
          image: manga.image,
          chapter_name: manga.chapter_name,
          chapter_id: manga.chapter_id
        }

    const res = await fetch('/api/bookmark/change', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const result = await res.json()
    if (result.error) return isFavorite // nếu lỗi thì giữ trạng thái cũ
    return !isFavorite
  } catch (err) {
    console.error('Toggle favorite error:', err)
    return isFavorite
  }
}

export async function fetchBookmark(page = 1, limit = 20): Promise<Manga[]> {
  try {
    const res = await fetch(`/api/bookmark/list?page=${page}&limit=${limit}`)
    if (!res.ok) throw new Error('Lỗi fetch bookmark')
    const json = await res.json()
    if (!json.data) return []
    const mapped: Manga[] = json.data.map((item: Manga) => ({
      name: item.name,
      image: item.image,
      slug: item.slug,
      chapter_name: item.chapter_name,
      chapter_id: item.chapter_id
    }))
    return mapped
  } catch (err) {
    console.error(err)
    return []
  }
}
