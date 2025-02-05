import { api } from './api-client'

interface GetProjectsRequest {
  slug: string
}

interface GetProjectsResponse {
  projects: {
    id: string
    name: string
    description: string
    slug: string
    ownerId: string
    organizationId: string
    avatarUrl: string
    createdAt: string
    owner: {
      id: string
      name: string
      avatarUrl: string
    }
  }[]
}

export async function getProjects({ slug }: GetProjectsRequest) {
  const result = await api
    .get(`organizations/${slug}/projects`)
    .json<GetProjectsResponse>()

  return result
}
