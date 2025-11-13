type Manga = {
  name: string
  image: string
  slug: string
}

const STORAGE_KEY = 'viewHistory'
const EXPIRE_DAYS = 30

export function saveView(manga: Manga) {
  if (typeof window === 'undefined') return

  const now = Date.now()
  const expireAt = now + EXPIRE_DAYS * 24 * 60 * 60 * 1000

  let history: { data: Manga; expireAt: number }[] = []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      history = JSON.parse(stored)

      // lọc bỏ item hết hạn hoặc có dữ liệu rỗng
      history = history.filter(
        item =>
          item.expireAt > now &&
          item.data &&
          item.data.name.trim() !== '' &&
          item.data.image.trim() !== '' &&
          item.data.slug.trim() !== ''
      )
    }
  } catch (e) {
    console.error('Parse history failed', e)
  }

  // xóa trùng
  history = history.filter(item => item.data.slug !== manga.slug)

  // thêm lại
  history.unshift({ data: manga, expireAt })

  // 50 cái
  if (history.length > 50) {
    history = history.slice(0, 50)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getView(): Manga[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const now = Date.now()
    let history: { data: Manga; expireAt: number }[] = JSON.parse(stored)

    // lọc bỏ item hết hạn hoặc có dữ liệu rỗng
    history = history.filter(
      item =>
        item.expireAt > now &&
        item.data &&
        item.data.name.trim() !== '' &&
        item.data.image.trim() !== '' &&
        item.data.slug.trim() !== ''
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))

    return history.map(item => item.data)
  } catch {
    return []
  }
}
