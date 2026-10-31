"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BotIcon,
  ChevronDownIcon,
  MoonIcon,
  PanelLeftIcon,
  SunIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@innate/ui"

import { getSidebarEntryCount, getSidebarNavGroups } from "@/lib/showcase-nav"
import { showcaseHref, type ShowcaseRoute } from "@/lib/showcase-catalog"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon data-icon /> : <MoonIcon data-icon />}
    </Button>
  )
}

function SidebarHeaderInner() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Link
        href="/"
        aria-label="Innate UI — home"
        className="flex items-center gap-2 overflow-hidden rounded-md px-1 text-sm font-semibold tracking-tight"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-[10px]">
          IU
        </span>
        <span className={collapsed ? "hidden" : "truncate transition-opacity"}>
          Innate UI
        </span>
      </Link>
      <div className={collapsed ? "hidden" : ""}>
        <ThemeToggle />
      </div>
    </div>
  )
}

function NavLink({ route }: { route: ShowcaseRoute }) {
  const pathname = usePathname()
  const href = showcaseHref(route)
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)
  const Icon = route.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={route.name}
        render={
          <Link href={href}>
            <Icon data-icon />
            <span>{route.name}</span>
          </Link>
        }
      />
    </SidebarMenuItem>
  )
}

function NavGroup({
  label,
  routes,
  defaultOpen = true,
}: {
  label: string
  routes: ShowcaseRoute[]
  defaultOpen?: boolean
}) {
  const { state, isMobile } = useSidebar()
  const sidebarCollapsed = state === "collapsed" && !isMobile

  if (routes.length === 0) return null

  if (sidebarCollapsed) {
    return (
      <SidebarGroup className="py-0">
        <SidebarMenu>
          {routes.map((route) => (
            <NavLink key={`${route.layer}-${route.slug}`} route={route} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel
          render={
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-sidebar-foreground/70 outline-hidden transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring" />
          }
        >
          {label}
          <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <NavLink key={`${route.layer}-${route.slug}`} route={route} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export function ComponentSidebar({ children }: { children: React.ReactNode }) {
  const navGroups = getSidebarNavGroups()
  const totalCount = getSidebarEntryCount()

  return (
    <SidebarProvider
      defaultOpen
      data-app-shell
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "3.75rem",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarHeaderInner />
        </SidebarHeader>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
          {navGroups.map((group) => (
            <NavGroup
              key={group.key}
              label={group.label}
              routes={group.items}
              defaultOpen={group.defaultOpen}
            />
          ))}
        </SidebarContent>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Overview"
                render={
                  <Link href="/">
                    <PanelLeftIcon data-icon />
                    <span>Overview</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Agent Quick Index"
                render={
                  <Link href="/agent-quick-index">
                    <BotIcon data-icon />
                    <span>Agent Quick Index</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="bg-background sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="text-muted-foreground text-xs">
            {totalCount} entries · 4 layers
          </span>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
