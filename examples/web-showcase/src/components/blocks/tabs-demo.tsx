"use client"

import { BellIcon, UserIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@innate/ui"

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

export function TabsDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Horizontal"
        description="Default orientation; TabsList hosts triggers, TabsContent renders the active panel."
      >
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Overview panel — quick summary of recent activity.
            </p>
          </TabsContent>
          <TabsContent value="analytics" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Analytics panel — visits, conversions, and trends.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Settings panel — preferences and account options.
            </p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        title="With icons"
        description="Combine data-icon triggers with text labels."
      >
        <Tabs defaultValue="account" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="account">
              <UserIcon data-icon /> Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellIcon data-icon /> Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Manage your name, email, and password.
            </p>
          </TabsContent>
          <TabsContent value="notifications" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Configure when and how you receive alerts.
            </p>
          </TabsContent>
        </Tabs>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;tabs | tabs-list | tabs-trigger | tabs-content&quot;
        </code>
        ; supports <code className="font-mono">data-orientation</code> for
        layout switching.
      </p>
    </div>
  )
}

export default TabsDemo
