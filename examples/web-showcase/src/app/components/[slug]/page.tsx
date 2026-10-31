import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"

import { AccordionDemo } from "@/components/blocks/accordion-demo"
import { AlertDialogDemo } from "@/components/blocks/alert-dialog-demo"
import { AlertDemo } from "@/components/blocks/alert-demo"
import { AspectRatioDemo } from "@/components/blocks/aspect-ratio-demo"
import { AvatarDemo } from "@/components/blocks/avatar-demo"
import { BadgeDemo } from "@/components/blocks/badge-demo"
import { BreadcrumbDemo } from "@/components/blocks/breadcrumb-demo"
import { ButtonDemo } from "@/components/blocks/button-demo"
import { ButtonGroupDemo } from "@/components/blocks/button-group-demo"
import { CalendarDemo } from "@/components/blocks/calendar-demo"
import { CardDemo } from "@/components/blocks/card-demo"
import { CarouselDemo } from "@/components/blocks/carousel-demo"
import { ChartDemo } from "@/components/blocks/chart-demo"
import { CheckboxDemo } from "@/components/blocks/checkbox-demo"
import { CollapsibleDemo } from "@/components/blocks/collapsible-demo"
import { CommandDemo } from "@/components/blocks/command-demo"
import { ContextMenuDemo } from "@/components/blocks/context-menu-demo"
import { DialogDemo } from "@/components/blocks/dialog-demo"
import { DirectionDemo } from "@/components/blocks/direction-demo"
import { DrawerDemo } from "@/components/blocks/drawer-demo"
import { DropdownMenuDemo } from "@/components/blocks/dropdown-menu-demo"
import { EmptyDemo } from "@/components/blocks/empty-demo"
import { FieldDemo } from "@/components/blocks/field-demo"
import { FormDemo } from "@/components/blocks/form-demo"
import { HoverCardDemo } from "@/components/blocks/hover-card-demo"
import { InputDemo } from "@/components/blocks/input-demo"
import { InputGroupDemo } from "@/components/blocks/input-group-demo"
import { InputOTPDemo } from "@/components/blocks/input-otp-demo"
import { ItemDemo } from "@/components/blocks/item-demo"
import { KbdDemo } from "@/components/blocks/kbd-demo"
import { LabelDemo } from "@/components/blocks/label-demo"
import { MenubarDemo } from "@/components/blocks/menubar-demo"
import { NavigationMenuDemo } from "@/components/blocks/navigation-menu-demo"
import { PaginationDemo } from "@/components/blocks/pagination-demo"
import { PopoverDemo } from "@/components/blocks/popover-demo"
import { ProgressDemo } from "@/components/blocks/progress-demo"
import { RadioGroupDemo } from "@/components/blocks/radio-group-demo"
import { ResizableDemo } from "@/components/blocks/resizable-demo"
import { ScrollAreaDemo } from "@/components/blocks/scroll-area-demo"
import { SelectDemo } from "@/components/blocks/select-demo"
import { SeparatorDemo } from "@/components/blocks/separator-demo"
import { SheetDemo } from "@/components/blocks/sheet-demo"
import { SidebarDemo } from "@/components/blocks/sidebar-demo"
import { SkeletonDemo } from "@/components/blocks/skeleton-demo"
import { SliderDemo } from "@/components/blocks/slider-demo"
import { SonnerDemo } from "@/components/blocks/sonner-demo"
import { SpinnerDemo } from "@/components/blocks/spinner-demo"
import { SwitchDemo } from "@/components/blocks/switch-demo"
import { TableDemo } from "@/components/blocks/table-demo"
import { TabsDemo } from "@/components/blocks/tabs-demo"
import { TextareaDemo } from "@/components/blocks/textarea-demo"
import { ToggleDemo } from "@/components/blocks/toggle-demo"
import { ToggleGroupDemo } from "@/components/blocks/toggle-group-demo"
import { TooltipDemo } from "@/components/blocks/tooltip-demo"

import { ShowcaseDetailShell } from "@/components/showcase-detail-shell"
import { getRegistryEntry } from "@/lib/showcase-registry"

import { componentRoutes, getRouteBySlug } from "../routes"

const blockBySlug: Record<string, ComponentType> = {
  // ── Layout & structure ──────────────────────────────────────────────────
  card: CardDemo,
  separator: SeparatorDemo,
  resizable: ResizableDemo,
  "scroll-area": ScrollAreaDemo,
  sidebar: SidebarDemo,
  "aspect-ratio": AspectRatioDemo,
  direction: DirectionDemo,
  // ── Navigation ──────────────────────────────────────────────────────────
  tabs: TabsDemo,
  breadcrumb: BreadcrumbDemo,
  pagination: PaginationDemo,
  menubar: MenubarDemo,
  "navigation-menu": NavigationMenuDemo,
  command: CommandDemo,
  carousel: CarouselDemo,
  // ── Forms & input ───────────────────────────────────────────────────────
  input: InputDemo,
  "input-group": InputGroupDemo,
  "input-otp": InputOTPDemo,
  select: SelectDemo,
  checkbox: CheckboxDemo,
  "radio-group": RadioGroupDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  calendar: CalendarDemo,
  form: FormDemo,
  field: FieldDemo,
  label: LabelDemo,
  textarea: TextareaDemo,
  // ── Actions ─────────────────────────────────────────────────────────────
  button: ButtonDemo,
  "button-group": ButtonGroupDemo,
  toggle: ToggleDemo,
  "toggle-group": ToggleGroupDemo,
  // ── Feedback ────────────────────────────────────────────────────────────
  alert: AlertDemo,
  sonner: SonnerDemo,
  progress: ProgressDemo,
  skeleton: SkeletonDemo,
  spinner: SpinnerDemo,
  empty: EmptyDemo,
  kbd: KbdDemo,
  // ── Overlays ────────────────────────────────────────────────────────────
  dialog: DialogDemo,
  "alert-dialog": AlertDialogDemo,
  sheet: SheetDemo,
  drawer: DrawerDemo,
  popover: PopoverDemo,
  "hover-card": HoverCardDemo,
  tooltip: TooltipDemo,
  "dropdown-menu": DropdownMenuDemo,
  "context-menu": ContextMenuDemo,
  accordion: AccordionDemo,
  collapsible: CollapsibleDemo,
  // ── Data display ────────────────────────────────────────────────────────
  avatar: AvatarDemo,
  badge: BadgeDemo,
  item: ItemDemo,
  table: TableDemo,
  chart: ChartDemo,
}

// Build-time guard — catches forgotten demos before the route can 404 in dev.
const missing = componentRoutes.filter((r) => !blockBySlug[r.slug])
if (missing.length > 0) {
  throw new Error(
    `Missing demo blocks for: ${missing.map((r) => r.slug).join(", ")}`
  )
}

export function generateStaticParams() {
  return componentRoutes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const route = getRouteBySlug(slug)
  return {
    title: route ? `${route.name} — Innate UI` : "Component — Innate UI",
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Block = blockBySlug[slug]
  const route = getRouteBySlug(slug)
  const entry = getRegistryEntry("primitives", slug)
  if (!Block || !route || !entry) notFound()

  return <ShowcaseDetailShell entry={entry} preview={<Block />} />
}
