type RefreshHandler = () => Promise<string>
type SessionExpiredHandler = () => void

let currentAccessToken: string | null = null
let refreshHandler: RefreshHandler | null = null
let sessionExpiredHandler: SessionExpiredHandler = () => {}
let refreshPromise: Promise<string> | null = null

export function getAccessToken(): string | null {
  return currentAccessToken
}

export function setAccessToken(accessToken: string | null): void {
  currentAccessToken = accessToken
}

export function configureAuthSession(
  nextRefreshHandler: RefreshHandler,
  nextSessionExpiredHandler: SessionExpiredHandler
): void {
  refreshHandler = nextRefreshHandler
  sessionExpiredHandler = nextSessionExpiredHandler
}

export function clearAuthSession(): void {
  currentAccessToken = null
  refreshPromise = null
}

export async function refreshSession(): Promise<string> {
  if (refreshPromise) return refreshPromise

  if (!refreshHandler) {
    throw new Error('Authentication session is not configured')
  }

  refreshPromise = refreshHandler()
    .then((accessToken) => {
      setAccessToken(accessToken)
      return accessToken
    })
    .catch((error: unknown) => {
      clearAuthSession()
      sessionExpiredHandler()
      throw error
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}
