import { defineAbilityFor } from '@saas/auth'

const ability = defineAbilityFor({
  role: 'ADMIN',
})

console.log(ability.can('manage', 'all')) // true;
console.log(ability.can('manage', 'User')) // true;
console.log(ability.cannot('manage', 'User')) // true;
