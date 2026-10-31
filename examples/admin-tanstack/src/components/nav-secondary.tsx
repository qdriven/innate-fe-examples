import * as React from "react"

import { Link, useRouterState } from "@tanstack/react-router"
import type { SidebarNavItem } from "../lib/spec-navigation"
import { isNavItemActive } from "../lib/spec-navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innate/ui"
export function NavSecondary({
  items,
  ...props
}: {
  items: Array<SidebarNavItem>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  if (items.length === 0) {
    return null
  }

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup {...props}>
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
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
