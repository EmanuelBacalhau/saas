import { ability, getCurrentOrg } from '@/auth/auth'
import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()

  const permission = await ability()

  const canUpdateOrganization = permission?.can('update', 'Organization')
  const canGetBilling = permission?.can('get', 'Billing')
  const canGetMembers = permission?.can('get', 'User')
  const canGetProjects = permission?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
            asChild
          >
            <NavLink href={`/org/${currentOrg}`}>Projetos</NavLink>
          </Button>
        )}

        {canGetMembers && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
            asChild
          >
            <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
          </Button>
        )}

        {(canUpdateOrganization || canGetBilling) && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
            asChild
          >
            <NavLink href={`/org/${currentOrg}/settings`}>
              Settings & Billing
            </NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}
