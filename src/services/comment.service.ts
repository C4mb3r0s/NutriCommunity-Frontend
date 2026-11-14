import { apiRequest } from './api'
import type { CommentResponse } from '../types/comment'

export function getComments(
  postId: string,
  page = 1,
  limit = 10
): Promise<CommentResponse> {
  return apiRequest<CommentResponse>(
    `/api/post/${postId}/comments?page=${page}&limit=${limit}`
  )
}
