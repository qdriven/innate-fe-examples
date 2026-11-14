import * as React from "react"
import { Link } from "@tanstack/react-router"

import { AppNavSpecificScenes } from "./nav-specific-scenes"
import { AppNavSecondary } from "./nav-secondary"
import { BASE_PATH } from "../lib/base-path"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innate/ui"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to={BASE_PATH as never} />}
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 text-foreground"
                aria-hidden="true"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
                <path
                  d="M16 4.5a11.5 11.5 0 0 1 10.05 5.55"
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="16" r="4.75" fill="currentColor" />
              </svg>
              <span className="text-base font-semibold text-foreground">
                innate-ui-admin
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AppNavSpecificScenes />
        <AppNavSecondary className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
