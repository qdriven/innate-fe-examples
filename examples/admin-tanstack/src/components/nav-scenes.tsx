import { Link, useRouterState } from "@tanstack/react-router"
import type { SidebarNavItem } from "../lib/spec-navigation"
import { isNavItemActive } from "../lib/spec-navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innate/ui"
const navSectionLabelClassName =
  "h-auto px-2 py-0 text-[11px] font-semibold tracking-[0.08em] uppercase text-sidebar-foreground/50"
const navSectionStackClassName = "flex flex-col gap-[var(--spacing-block)]"

export function NavScenes({
  title,
  items,
}: {
  title: string
  items: Array<SidebarNavItem>
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className={navSectionStackClassName}>
        <SidebarGroupLabel className={navSectionLabelClassName}>
          {title}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isNavItemActive(pathname, item)}
                  render={<Link to={item.to as never} />}
                >
                  <item.icon data-icon />
                  <span title={item.title}>{item.title}</span>
                </SidebarMenuButton>
                {item.badge ? (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  )
}
