import { api } from './api-client'

interface GetOrganizationRequest {
  org: string
}

interface GetOrganizationResponse {
  organization: {
    id: string
    name: string
    slug: string
    domain: string
    shouldAttachUsersByDomain: boolean
    avatarUrl: string
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization(data: GetOrganizationRequest) {
  const result = await api
    .get(`organizations/${data.org}`)
    .json<GetOrganizationResponse>()

  return result
}
