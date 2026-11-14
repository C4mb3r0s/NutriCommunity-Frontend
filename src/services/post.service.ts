import { apiRequest } from './api'
import type { PostResponse } from '../types/post'

export function getPosts(page: number, limit = 20) {
  return apiRequest<PostResponse>(
    `/api/post/?page=${page}&limit=${limit}`
  )
}

export function toggleReaction(
  postId: string,
  accessToken: string,
  type: 'like' | 'love' | 'amaze'
) {
  return apiRequest(`/api/post/${postId}/reaction`, {
    method: 'PUT',
    accessToken,
    body: JSON.stringify({ type }),
    headers: {
      'X-CSRF-Token': getCsrfToken()
    }
  })
}

function getCsrfToken(): string {
  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith('csrf-token='))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}
