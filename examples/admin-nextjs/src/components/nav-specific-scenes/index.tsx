"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavSpecificScenes } from "@innate/admin-composites/nav-specific-scenes"
import { specificNavSections } from "@/lib/spec-navigation"

/** nextjs 路由适配：共享分区场景导航（保留 section 折叠交互）。 */
export function AppNavSpecificScenes() {
  const pathname = usePathname()

  return (
    <NavSpecificScenes
      sections={specificNavSections}
      pathname={pathname}
      renderLink={(item) => <Link href={item.to} />}
      collapsibleSections
    />
  )
}

export { AppNavSpecificScenes as NavSpecificScenes }
