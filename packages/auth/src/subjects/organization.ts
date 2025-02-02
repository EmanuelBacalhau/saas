import { z } from 'zod'
import { organizationSchema } from '../models/organization'

const organizationSubject = z.tuple([
  z.enum(['manage', 'update', 'delete', 'transfer_ownership']),
  z.union([z.literal('Organization'), organizationSchema]),
])

export type OrganizationSubject = z.infer<typeof organizationSubject>
