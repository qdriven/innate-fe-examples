"use client"

import { BellIcon, CheckIcon, MoreHorizontalIcon } from "lucide-react"

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
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

export function CardDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Anatomy"
        description="All eight slots: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter."
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <MoreHorizontalIcon data-icon />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              CardContent renders inside the card body and follows the
              container&apos;s padding.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Mark all read
            </Button>
            <Button size="sm">
              <CheckIcon data-icon /> Accept all
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section
        title="Login form"
        description="A real-world example using Card as a login form surface."
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-demo-email">Email</Label>
                <Input
                  id="card-demo-email"
                  type="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-demo-password">Password</Label>
                <Input
                  id="card-demo-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <BellIcon data-icon /> Sign in
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;card | card-header | card-title | card-description |
          card-action | card-content | card-footer&quot;
        </code>
        ; supports{" "}
        <code className="font-mono">data-size=&quot;default | sm&quot;</code> to
        tighten spacing.
      </p>
    </div>
  )
}

export default CardDemo
