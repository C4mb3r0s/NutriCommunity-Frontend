import { apiRequest } from './api'
import type { AdminUserResponse } from '../types/user'

export function getUsers(accessToken: string, page = 1, limit = 20) {
  return apiRequest<AdminUserResponse>(
    `/api/admin/users?page=${page}&limit=${limit}`,
    { accessToken }
  )
}

export function updateUserStatus(
  accessToken: string,
  userId: string,
  status: 'active' | 'suspended' | 'deleted'
) {
  const csrfToken = document.cookie
    .split('; ')
    .find((value) => value.startsWith('csrf_token='))
    ?.split('=')[1] ?? ''

  return apiRequest(`api/admin/users/${userId}/status`, {
    method: 'PATCH',
    accessToken,
    headers: {
      'X-CSRF-Token': decodeURIComponent(csrfToken)
    },
    body: JSON.stringify({ status })
  })
}
