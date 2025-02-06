import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetMembersRequest {
  slug: string
}

interface GetMembersResponse {
  members: {
    id: string
    userId: string
    email: string
    name: string
    avatarUrl: string
    role: Role
  }[]
}

export async function getMembers({ slug }: GetMembersRequest) {
  const result = await api
    .get(`organizations/${slug}/members`)
    .json<GetMembersResponse>()

  return result
}
