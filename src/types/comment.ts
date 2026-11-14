export interface Comment {
  id: string
  postId: string
  userId: string
  authorName: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface CommentResponse {
  data: Comment[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}
