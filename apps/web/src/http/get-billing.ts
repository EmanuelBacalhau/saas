import { api } from './api-client'

interface GetBillingRequest {
  org: string
}

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(data: GetBillingRequest) {
  const result = await api
    .get(`organizations/${data.org}/billing`)
    .json<GetBillingResponse>()

  return result
}
