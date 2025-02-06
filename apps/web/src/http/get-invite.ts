import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetInviteRequest {
  inviteId: string
}

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string
      avatarUrl: string
    }
  }
}

export async function getInvite({ inviteId }: GetInviteRequest) {
  const result = await api.get(`invites/${inviteId}`).json<GetInviteResponse>()

  return result
}
