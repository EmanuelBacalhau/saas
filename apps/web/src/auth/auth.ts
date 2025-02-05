import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated() {
  const cookiesStore = await cookies()

  return !!cookiesStore.get('token')?.value
}

export async function getCurrentOrg() {
  const cookiesStore = await cookies()
  const currentOrg = cookiesStore.get('org')?.value

  console.log(currentOrg)

  return currentOrg || null
}

export async function getCurrentMembership() {
  const org = await getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const permission = defineAbilityFor({
    role: membership.role,
    id: membership.userId,
  })

  return permission
}

export async function auth() {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return {
      user,
    }
  } catch (error) {}

  redirect('/api/auth/sign-out')
}
