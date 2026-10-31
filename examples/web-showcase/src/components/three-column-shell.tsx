"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BotIcon,
  HomeIcon,
  MenuIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@innate/ui"

import { SHOWCASE_LAYERS, type ShowcaseLayer } from "@/lib/showcase-catalog"
import {
  getActiveLayerFromPathname,
  getMainMenu,
  getSubMenu,
  type MainMenuItem,
  type SubMenuGroup,
} from "@/lib/showcase-nav"
import { ThemeSelectorWithEditor } from "@/components/theme-selector"

const HOME_SUBMENU: SubMenuGroup = {
  key: "home",
  label: "Overview",
  order: 0,
  items: [
    {
      slug: "home",
      name: "Home",
      description: "Design system overview and layer index.",
      href: "/",
      icon: HomeIcon,
      layer: "primitives",
    },
    {
      slug: "agent-quick-index",
      name: "Agent Quick Index",
      description: "Agent-facing quick reference for templates and skills.",
      href: "/agent-quick-index",
      icon: BotIcon,
      layer: "primitives",
    },
    {
      slug: "theme-editor",
      name: "Theme Editor",
      description: "Customize token values and save your own theme preset.",
      href: "/theme-editor",
      icon: SlidersHorizontalIcon,
      layer: "primitives",
    },
  ],
}

function LogoMark() {
  return (
    <Link
      href="/"
      aria-label="Innate UI — home"
      className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-[10px]"
    >
      IU
    </Link>
  )
}

function MainMenuButton({
  item,
  isActive,
}: {
  item: MainMenuItem
  isActive: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href ?? "/"}
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-auto w-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[10px] font-medium text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground",
        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
      )}
    >
      <Icon className="size-5" />
      <span className="truncate px-0.5">{item.label}</span>
    </Link>
  )
}

function MainMenu({ activeLayer }: { activeLayer: ShowcaseLayer | "home" }) {
  const mainMenu = useMemo(() => getMainMenu(), [])

  return (
    <nav className="flex h-full flex-col items-center gap-3 px-2 py-3">
      <LogoMark />

      <div className="flex w-full flex-1 flex-col gap-1">
        {mainMenu.map((item) => {
          const isActive =
            item.id === "home"
              ? activeLayer === "home"
              : activeLayer === item.id
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger render={<div className="w-full" />}>
                <MainMenuButton item={item} isActive={isActive} />
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="mt-auto">
        <ThemeSelectorWithEditor />
      </div>
    </nav>
  )
}

function SubMenuGroupSection({
  group,
  pathname,
}: {
  group: SubMenuGroup
  pathname: string
}) {
  return (
    <div key={group.key} className="px-3 py-4">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {group.label}
      </h3>
      <ul className="space-y-0.5">
        {group.items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <li key={`${group.key}-${item.slug}`}>
              <Link
                href={item.href}
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors",
                  "hover:bg-accent",
                  "data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
                )}
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SubMenu({
  activeLayer,
  pathname,
}: {
  activeLayer: ShowcaseLayer | "home"
  pathname: string
}) {
  const groups = useMemo(() => {
    if (activeLayer === "home") return [HOME_SUBMENU]
    return getSubMenu(activeLayer)
  }, [activeLayer])

  const activeLabel = useMemo(() => {
    if (activeLayer === "home") return "Overview"
    return (
      SHOWCASE_LAYERS.find((layer) => layer.id === activeLayer)?.label ??
      activeLayer
    )
  }, [activeLayer])

  return (
    <div className="flex h-full flex-col border-r bg-card/30">
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <span className="text-sm font-semibold tracking-tight">
          {activeLabel}
        </span>
      </div>
      <ScrollArea className="flex-1">
        {groups.map((group) => (
          <SubMenuGroupSection
            key={group.key}
            group={group}
            pathname={pathname}
          />
        ))}
      </ScrollArea>
    </div>
  )
}

function MobileNav({
  activeLayer,
  pathname,
}: {
  activeLayer: ShowcaseLayer | "home"
  pathname: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open navigation" />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-auto max-w-[90vw] p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-full w-16 border-r bg-background">
          <MainMenu activeLayer={activeLayer} />
        </div>
        <div className="h-full w-64">
          <SubMenu activeLayer={activeLayer} pathname={pathname} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ThreeColumnShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeLayer: ShowcaseLayer | "home" =
    getActiveLayerFromPathname(pathname)

  const activeLabel = useMemo(() => {
    if (activeLayer === "home") return "Overview"
    return (
      SHOWCASE_LAYERS.find((layer) => layer.id === activeLayer)?.label ??
      activeLayer
    )
  }, [activeLayer])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Column 1 — Main menu (desktop only) */}
      <aside className="hidden w-16 shrink-0 border-r bg-background md:flex md:flex-col">
        <MainMenu activeLayer={activeLayer} />
      </aside>

      {/* Column 2 — Sub menu (desktop only) */}
      <aside className="hidden w-64 shrink-0 md:block">
        <SubMenu activeLayer={activeLayer} pathname={pathname} />
      </aside>

      {/* Column 3 — Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <MobileNav activeLayer={activeLayer} pathname={pathname} />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {activeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelectorWithEditor />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
