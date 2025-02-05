'use client'

import { getProjects } from '@/http/get-projects'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDownIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function ProjectSwitcher() {
  const { slug: orgSlug, projectSlug } = useParams<{
    slug: string
    projectSlug: string
  }>()

  const { data, isLoading } = useQuery({
    queryKey: ['projects', orgSlug],
    queryFn: () =>
      getProjects({
        slug: orgSlug,
      }),
    enabled: !!orgSlug,
  })

  const currentProject = data?.projects?.find(
    project => project.slug === projectSlug
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {isLoading ? (
          <>
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-5 flex-1" />
          </>
        ) : (
          <>
            {currentProject ? (
              <>
                <Avatar className="size-5 mr-1">
                  <AvatarImage src={currentProject.avatarUrl} />
                  <AvatarFallback />
                </Avatar>
                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            ) : (
              <span className=" text-muted-foreground">Select project</span>
            )}
          </>
        )}
        {isLoading ? (
          <Loader2Icon className="size-4 ml-auto text-muted-foreground shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDownIcon className="size-4 ml-auto text-muted-foreground shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data?.projects?.map(projects => (
            <DropdownMenuItem key={projects.id} asChild>
              <Link href={`/org/${orgSlug}/project/${projects.slug}`}>
                <Avatar className="size-5 mr-1">
                  <AvatarImage src={projects.avatarUrl} />
                  <AvatarFallback />
                </Avatar>
                <span className="truncate">{projects.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircleIcon className="size-5 mr-1 text-primary" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
