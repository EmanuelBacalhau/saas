import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutDownOrganization } from '@/http/shutdown-organization'
import { XCircleIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export function ShutdownOrganizationButton() {
  async function shutdownOrganizationAction() {
    'use server'

    const currentOrg = await getCurrentOrg()

    await shutDownOrganization({ org: currentOrg as string })

    redirect('/')
  }

  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircleIcon className="size-4 mr-1" />
        Shutdown organization
      </Button>
    </form>
  )
}
