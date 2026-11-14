const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  issues?: unknown

  constructor(message: string, status: number, issues?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

interface ApiRequestOpcions extends RequestInit {
  accessToken?: string
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOpcions = {}
): Promise<T> {
  const { accessToken, headers, ...requestOptions } = options

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers
    }
  })

  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new ApiError(
      body?.message ?? 'The request could not be completed',
      response.status,
      body?.issues
    )
  }

  return body as T
}
