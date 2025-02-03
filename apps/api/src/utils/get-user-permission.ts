import type { Role } from '@prisma/client'
import { defineAbilityFor, userSchema } from '@saas/auth'

export function getUserPermission(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
