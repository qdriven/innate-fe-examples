import { Link, useRouterState } from "@tanstack/react-router"
import { NavSpecificScenes } from "@innate/admin-composites/nav-specific-scenes"
import { specificNavSections } from "../lib/spec-navigation"

/** tanstack 路由适配：共享分区场景导航。 */
export function AppNavSpecificScenes() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <NavSpecificScenes
      sections={specificNavSections}
      pathname={pathname}
      renderLink={(item) => <Link to={item.to as never} />}
    />
  )
}

export { AppNavSpecificScenes as NavSpecificScenes }
