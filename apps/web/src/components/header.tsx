import fireIcon from '@/assets/learning-icon.svg'
import { SlashIcon } from 'lucide-react'
import Image from 'next/image'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={fireIcon} alt="Learning icon" className="size-6" />
        <SlashIcon className="size-3 -rotate-[24deg] text-border" />
        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
