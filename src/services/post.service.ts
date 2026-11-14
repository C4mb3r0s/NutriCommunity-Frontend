import { apiRequest } from './api'
import type {
  ContentType,
  CreatePostInput,
  PostResponse
} from '../types/post'

export function getPosts(page: number, limit = 20) {
  return apiRequest<PostResponse>(
    `/api/posts?page=${page}&limit=${limit}`
  )
}

export function getContentTypes(): Promise<ContentType[]> {
  return apiRequest<ContentType[]>('/api/content-types')
}

export function createPost(
  input: CreatePostInput,
  accessToken: string
) {
  return apiRequest('/api/posts', {
    method: 'POST',
    accessToken,
    headers: { 'X-CSRF-Token': getCsrfToken() },
    body: JSON.stringify(input)
  })
}

export function deletePost(postId: string, accessToken: string) {
  return apiRequest<void>(`/api/posts/${postId}`, {
    method: 'DELETE',
    accessToken,
    headers: { 'X-CSRF-Token': getCsrfToken() }
  })
}

export function toggleReaction(
  postId: string,
  accessToken: string,
  type: 'like' | 'love' | 'amaze'
) {
  return apiRequest(`/api/posts/${postId}/reaction`, {
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
    .find((value) => value.startsWith('csrf_token='))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}
