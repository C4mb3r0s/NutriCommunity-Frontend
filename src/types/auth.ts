export interface AuthUser {
  id: string
  firstName: string
  secondName: string | null
  lastName: string
  secondLastName: string | null
  email: string
  roles: string[]
  status?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}
