import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateOrganizationResponse = undefined

export async function createOrganization(
  data: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> {
  await api.post('organizations', {
    json: {
      name: data.name,
      domain: data.domain,
      shouldAttachUsersByDomain: data.shouldAttachUsersByDomain,
    },
  })
}
