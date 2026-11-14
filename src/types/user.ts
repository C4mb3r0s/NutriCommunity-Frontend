export interface AdminUser {
  id: string
  firstName: string
  secondName: string | null
  lastName: string
  secondLastName: string | null
  email: string
  status: 'active' | 'suspended' | 'deleted'
  createdAt: string
}

export interface AdminUserResponse {
  data: AdminUser[]
  pagination: {
    page: number
    limit: number
  }
}
