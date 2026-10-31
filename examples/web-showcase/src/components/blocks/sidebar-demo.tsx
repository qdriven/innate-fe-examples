"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  cn,
} from "@innate/ui"
import { HomeIcon, SettingsIcon, UsersIcon } from "lucide-react"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-xl border bg-card p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-3">{children}</CardContent>
    </Card>
  )
}

const items = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UsersIcon, label: "Team" },
  { icon: SettingsIcon, label: "Settings" },
]

export function SidebarDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-6">
      <Section
        title="Inline mini-shell"
        description="A 2-column app shell — a real SidebarProvider + Sidebar + Inset."
      >
        <div className="sidebar-demo-frame relative h-72 overflow-hidden rounded-md border bg-background">
          <SidebarProvider
            open={open}
            onOpenChange={setOpen}
            className="!min-h-0 h-full"
            style={
              {
                "--sidebar-width": "12rem",
                "--sidebar-width-icon": "3rem",
              } as React.CSSProperties
            }
          >
            <Sidebar collapsible="icon" variant="sidebar">
              <SidebarHeader>
                <span className="px-1 text-sm font-semibold">Mini app</span>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Main</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton isActive={item.active}>
                            <item.icon />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset
              className={cn(
                "transition-[padding] duration-200 ease-linear",
                open ? "pl-[12rem]" : "pl-[3rem]"
              )}
            >
              <header className="flex h-10 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <span className="text-muted-foreground text-xs">
                  Inset content
                </span>
              </header>
              <div className="p-3 text-sm">
                Click the trigger to collapse the sidebar to icon-only mode.
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;sidebar | sidebar-provider | sidebar-header |
          sidebar-content | sidebar-group | sidebar-group-label |
          sidebar-group-content | sidebar-menu | sidebar-menu-item |
          sidebar-menu-button | sidebar-inset | sidebar-trigger&quot;
        </code>
        ; full Shadcn UI sidebar API — collapsible, mobile-sheet fallback,
        cookie-persisted state.
      </p>
    </div>
  )
}

export default SidebarDemo
