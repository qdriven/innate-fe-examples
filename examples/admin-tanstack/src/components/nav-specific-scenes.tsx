import { Link, useRouterState } from "@tanstack/react-router"
import type { ReactNode } from "react"
import type {
  SidebarNavItem,
  SidebarNavSection,
  SidebarNavSectionEntry,
} from "../lib/spec-navigation"
import { isNavItemActive } from "../lib/spec-navigation"
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
        render={<Link to={item.to as never} />}
      >
        <item.icon data-icon />
        <span title={item.title}>{item.title}</span>
      </SidebarMenuButton>
      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function PrimarySectionHeader({ title }: { title: string }) {
  return (
    <div className="px-1 pt-1">
      <div className={primarySectionLabelClassName}>{title}</div>
    </div>
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
  entries: Array<SidebarNavSectionEntry>,
  pathname: string
) {
  const blocks: Array<ReactNode> = []
  let pendingItems: Array<SidebarNavItem> = []

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

function SectionBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <PrimarySectionHeader title={title} />
      <div className="flex flex-col gap-3 px-1">{children}</div>
    </section>
  )
}

export function NavSpecificScenes({
  sections,
}: {
  sections: Array<SidebarNavSection>
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent className={cn(navSectionSpacingClassName, "pb-4")}>
        {sections.map((section) => (
          <SectionBlock key={section.title} title={section.title}>
            <div className={navSectionSpacingClassName}>
              {renderNavEntryBlocks(section.entries, pathname)}
            </div>
          </SectionBlock>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
