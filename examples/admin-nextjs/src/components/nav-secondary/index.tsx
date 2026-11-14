"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavSecondary } from "@innate/admin-composites/nav-secondary"
import { secondaryNavItems } from "@/lib/spec-navigation"

/** nextjs 路由适配：共享 NavSecondary + next/link。 */
export function AppNavSecondary({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <NavSecondary
      className={className}
      items={secondaryNavItems}
      pathname={pathname}
      renderLink={(item) => <Link href={item.to} />}
    />
  )
}
