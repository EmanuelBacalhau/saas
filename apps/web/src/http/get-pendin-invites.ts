import type { Role } from '@saas/auth'
import { revalidatePath } from 'next/cache'
import { api } from './api-client'

interface GetPendingInvitesResponse {
  invites: {
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
  }[]
}

export async function getPendingInvites() {
  const result = await api
    .get('pending-invites')
    .json<GetPendingInvitesResponse>()

  return result
}
