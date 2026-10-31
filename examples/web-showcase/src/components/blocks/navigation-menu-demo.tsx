"use client"

import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

export function NavigationMenuDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Top nav with mega-menu"
        description="Hover or focus a trigger to reveal a rich content panel."
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
                  {[
                    { title: "Button", desc: "Action primitive" },
                    { title: "Dialog", desc: "Modal overlay" },
                    { title: "Chart", desc: "Data visualization" },
                    { title: "Table", desc: "Data grid" },
                  ].map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        render={
                          <Link
                            href="#"
                            className="block rounded-md p-2 hover:bg-muted/50"
                          />
                        }
                      >
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="text-muted-foreground text-xs">
                          {item.desc}
                        </p>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-4">
                  {["Docs", "Changelog", "Roadmap", "Support"].map((label) => (
                    <li key={label}>
                      <NavigationMenuLink
                        render={
                          <Link
                            href="#"
                            className="block rounded-md p-2 hover:bg-muted/50"
                          />
                        }
                      >
                        <div className="text-sm font-medium">{label}</div>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="#" className="text-sm" />}
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;navigation-menu | navigation-menu-list |
          navigation-menu-item | navigation-menu-trigger |
          navigation-menu-content | navigation-menu-link&quot;
        </code>
        ; mega-menu pattern — full-width panels with arbitrary content.
      </p>
    </div>
  )
}

export default NavigationMenuDemo
