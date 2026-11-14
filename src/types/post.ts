export interface Post {
  id: string
  authorId: string
  authorName: string
  contentTypeId: string
  contentTypeName: string
  title: string
  content: string | null
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

export interface ContentType {
  id: string
  code: string
  name: string
}

export interface CreatePostInput {
  title: string
  description?: string
  contentTypeId: string
  status: 'draft' | 'published'
}
