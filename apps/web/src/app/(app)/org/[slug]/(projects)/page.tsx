import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectList } from './project-list'

export default async function Organization() {
  const permission = await ability()
  const orgSlug = await getCurrentOrg()

  const canCreateProject = permission?.can('create', 'Project')
  const canGetProjects = permission?.can('get', 'Project')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {canCreateProject && (
          <Button asChild>
            <Link href={`/org/${orgSlug}/create-project`}>
              <PlusIcon className="size-2 mr-1" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {canGetProjects ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed too see organization projects.
        </p>
      )}
    </div>
  )
}
