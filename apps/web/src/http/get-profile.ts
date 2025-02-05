import { api } from './api-client'

interface GetProfileResponse {
  user: {
    id: number
    name: string | null
    email: string
    avatar: string | null
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()

  return result
}
