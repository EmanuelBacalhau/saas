import {
  AbilityBuilder,
  type CreateAbility,
  type MongoAbility,
  createMongoAbility,
} from '@casl/ability'
import type { User } from './models/user'
import { permissions } from './permissions'
import type { BillingSubject } from './subjects/billing'
import type { InviteSubject } from './subjects/invite'
import type { OrganizationSubject } from './subjects/organization'
import type { ProjectSubject } from './subjects/project'
import type { UserSubject } from './subjects/user'

export * from './models/user'
export * from './models/organization'
export * from './models/project'
export * from './roles'

type AppAbilities =
  | ProjectSubject
  | UserSubject
  | BillingSubject
  | InviteSubject
  | OrganizationSubject
  | ['manage', 'all']

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for role ${user.role} is not defined`)
  }

  permissions[user.role](user, builder)

  return builder.build({
    detectSubjectType: subject => {
      return subject.__typename
    },
  })
}
