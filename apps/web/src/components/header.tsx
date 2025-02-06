import fireIcon from '@/assets/learning-icon.svg'
import { ability } from '@/auth/auth'
import { SlashIcon } from 'lucide-react'
import Image from 'next/image'
import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export async function Header() {
  const permission = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={fireIcon} alt="Learning icon" className="size-6" />

        <SlashIcon className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />

        {permission?.can('get', 'Project') && (
          <>
            <SlashIcon className="size-3 -rotate-[24deg] text-border" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <PendingInvites />
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
