export interface Post {
  id: string
  authorId: string
  contentTypeId: string
  title: string
  description: string | null
  status: 'draft' | 'published' | 'archived' | 'deleted'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostResponse {
  data: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
