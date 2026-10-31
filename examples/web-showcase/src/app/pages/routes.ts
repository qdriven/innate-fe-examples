import { KeyRoundIcon, UserPlusIcon } from "lucide-react"

import type { ShowcaseRoute } from "@/lib/showcase-catalog"

export const pageRoutes: ShowcaseRoute[] = [
  {
    slug: "sign-in",
    name: "Sign In",
    description:
      "Email/password form with remember-me — demo UI only, no auth backend.",
    layer: "pages",
    icon: KeyRoundIcon,
  },
  {
    slug: "sign-up",
    name: "Sign Up",
    description:
      "Google OAuth button plus email registration form in a card layout.",
    layer: "pages",
    icon: UserPlusIcon,
  },
]

export function getPageRouteBySlug(slug: string) {
  return pageRoutes.find((route) => route.slug === slug)
}

export type PageRoute = ShowcaseRoute & { layer: "pages" }
