export interface AuthUser {
  id: string
  firstName: string
  secondname: string | null
  lasName: string
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
}
