import { z } from 'zod'

const billingSubject = z.tuple([
  z.enum(['manage', 'get', 'export']),
  z.literal('Billing'),
])

export type BillingSubject = z.infer<typeof billingSubject>
