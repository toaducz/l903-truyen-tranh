export async function request<T>(
  apiUrl: string,
  endpoint: string,
  method: 'GET' |  'DELETE' | 'POST' = 'GET',
  payload?: Record<string, unknown>
): Promise<T | null> {
  let params = ''
  if (method === 'GET' && payload) {
    params = '?' + new URLSearchParams(payload as Record<string, string>).toString()
  }

  const fullUrl = `${apiUrl}${endpoint}${params}`
  const isExternal = apiUrl.startsWith('http')

  const targetUrl = isExternal
    ? `/api/proxy?url=${encodeURIComponent(fullUrl)}`
    : fullUrl // gọi trực tiếp API

  const res = await fetch(targetUrl, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(method !== 'GET' && payload ? { body: JSON.stringify(payload) } : {}),
  })

  try {
    return (await res.json()) as T
  } catch (e) {
    console.error('Parse JSON error', e)
    return null
  }
}
