import { createSpecNavigation } from "@innate/scene-catalog"

import { BASE_PATH, withBasePath } from "./base-path"
import { sceneCatalog } from "./scene-catalog"

const navigation = createSpecNavigation({
  catalog: sceneCatalog,
  resolveRoute: withBasePath,
  homePath: BASE_PATH,
  docsDashboardPath: withBasePath("/docs/dashboard"),
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
