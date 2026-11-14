"use client"

import * as React from "react"
import Link from "next/link"

import { AppNavSpecificScenes } from "@/components/nav-specific-scenes"
import { AppNavSecondary } from "@/components/nav-secondary"
import { dashboardPath } from "@/lib/dashboard-path"
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
              render={
                <Link href={dashboardPath()}>
                  <span className="text-base font-semibold text-foreground">
                    Admin Demo
                  </span>
                </Link>
              }
            />
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
