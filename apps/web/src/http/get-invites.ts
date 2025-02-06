import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetInvitesRequest {
  slug: string
}

interface GetInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string
    }
  }[]
}

export async function getInvites({ slug }: GetInvitesRequest) {
  const result = await api
    .get(`organizations/${slug}/invites`)
    .json<GetInvitesResponse>()

  return result
}
