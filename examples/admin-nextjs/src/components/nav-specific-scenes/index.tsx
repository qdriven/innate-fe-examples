"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { isNavItemActive } from "@/lib/spec-navigation"
import type {
  SidebarNavItem,
  SidebarNavSection,
  SidebarNavSectionEntry,
} from "@/lib/spec-navigation"
import {
  cn,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@innate/ui"

const navSectionStackClassName = "flex flex-col gap-[var(--spacing-block)]"
const navSectionSpacingClassName = "flex flex-col gap-5"
const primarySectionLabelClassName =
  "text-[12px] font-semibold tracking-[0.02em] text-sidebar-foreground/88"
const secondaryGroupLabelClassName =
  "text-[11px] font-medium text-sidebar-foreground/58"

function NavItemRow({
  item,
  pathname,
}: {
  item: SidebarNavItem
  pathname: string
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-9 rounded-lg px-2.5 text-[13px] font-medium text-sidebar-foreground/82 hover:bg-sidebar-accent/55 data-active:bg-sidebar-accent/78 data-active:text-sidebar-foreground"
        isActive={isNavItemActive(pathname, item)}
        render={
          <Link href={item.to}>
            <item.icon data-icon />
            <span>{item.title}</span>
          </Link>
        }
      />
      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function PrimarySectionHeader({
  title,
  expanded,
  onToggle,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-1 pt-1 text-left cursor-pointer"
    >
      <div className={primarySectionLabelClassName}>{title}</div>
      {expanded ? (
        <ChevronDownIcon className="size-3.5 text-sidebar-foreground/50" />
      ) : (
        <ChevronRightIcon className="size-3.5 text-sidebar-foreground/50" />
      )}
    </button>
  )
}

function SecondaryGroupHeader({ title }: { title: string }) {
  return (
    <div className="px-1 pt-0.5">
      <div className={secondaryGroupLabelClassName}>{title}</div>
    </div>
  )
}

function renderNavEntryBlocks(
  entries: SidebarNavSectionEntry[],
  pathname: string
) {
  const blocks: ReactNode[] = []
  let pendingItems: SidebarNavItem[] = []

  const flushPendingItems = () => {
    if (pendingItems.length === 0) {
      return
    }

    blocks.push(
      <div key={`items-${blocks.length}`} className={navSectionStackClassName}>
        <SidebarMenu>
          {pendingItems.map((item) => (
            <NavItemRow key={item.to} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>
      </div>
    )
    pendingItems = []
  }

  entries.forEach((entry) => {
    if (entry.type === "item") {
      pendingItems.push(entry.item)
      return
    }

    flushPendingItems()

    blocks.push(
      <div key={`group-${entry.title}`} className="flex flex-col gap-1.5">
        <SecondaryGroupHeader title={entry.title} />
        <div className="ml-0.5 pl-0.5">
          <SidebarMenu>
            {entry.items.map((item) => (
              <NavItemRow key={item.to} item={item} pathname={pathname} />
            ))}
          </SidebarMenu>
        </div>
      </div>
    )
  })

  flushPendingItems()

  return blocks
}

export function NavSpecificScenes({
  sections,
}: {
  sections: SidebarNavSection[]
}) {
  const pathname = usePathname()

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {}
    sections.forEach((section) => {
      initial[section.title] = true
    })
    return initial
  })

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent className={cn(navSectionSpacingClassName, "pb-4")}>
        {sections.map((section) => {
          const expanded = expandedSections[section.title] ?? true
          return (
            <div key={section.title} className="flex flex-col gap-2.5">
              <PrimarySectionHeader
                title={section.title}
                expanded={expanded}
                onToggle={() => toggleSection(section.title)}
              />
              {expanded && (
                <div className="flex flex-col gap-3 px-1">
                  {renderNavEntryBlocks(section.entries, pathname)}
                </div>
              )}
            </div>
          )
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
