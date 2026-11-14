export type ReactionType = 'like' | 'love' | 'amaze'

export interface ReactionResponse {
  postId: string
  userId: string
  type: ReactionType | null
}
