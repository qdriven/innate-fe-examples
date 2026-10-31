"use client"

import * as React from "react"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innate/ui"
import type { LucideIcon } from "lucide-react"

export interface SidebarNavItem {
  title: string
  to: string
  icon: LucideIcon
  isActive?: boolean
}

export function NavSecondary({
  items,
  ...props
}: {
  items: SidebarNavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  if (items.length === 0) {
    return null
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={item.isActive}
                render={
                  <Link href={item.to}>
                    <item.icon data-icon />
                    <span>{item.title}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
