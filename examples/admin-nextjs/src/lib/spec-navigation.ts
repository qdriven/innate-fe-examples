import { createSpecNavigation } from "@innate/scene-catalog"

import { sceneCatalog } from "./scene-catalog"

const navigation = createSpecNavigation({
  catalog: sceneCatalog,
  resolveRoute: (path: string) => path,
  resolveDocHref: (href: string) => href,
  homePath: "/dashboard",
  docsDashboardPath: "/docs/dashboard",
})

export const {
  patternNavItems,
  secondaryNavItems,
  specificNavSections,
  isNavItemActive,
  getPageMeta,
} = navigation

export type {
  PageMeta,
  SidebarNavItem,
  SidebarNavSection,
  SidebarNavSectionEntry,
} from "@innate/scene-catalog"
