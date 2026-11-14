import { getAccessToken, refreshSession } from './auth-session'

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
  skipAuthRefresh?: boolean
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOpcions = {}
): Promise<T> {
  const {
    accessToken,
    headers,
    skipAuthRefresh = false,
    ...requestOptions
  } = options

  const requestAccessToken = getAccessToken() ?? accessToken
  const response = await sendRequest(path, requestOptions, headers, requestAccessToken)

  if (response.status === 401 && requestAccessToken && !skipAuthRefresh) {
    const refreshedAccessToken = await refreshSession()
    const retryResponse = await sendRequest(
      path,
      requestOptions,
      headers,
      refreshedAccessToken
    )

    return parseResponse<T>(retryResponse)
  }

  return parseResponse<T>(response)
}

async function sendRequest(
  path: string,
  requestOptions: RequestInit,
  headers: HeadersInit | undefined,
  accessToken: string | null | undefined
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers
    }
  })
}

async function parseResponse<T>(response: Response): Promise<T> {
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
