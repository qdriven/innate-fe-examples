"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
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
      <CardContent className="flex flex-col gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SelectDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Placeholder"
        description="Default state — SelectValue renders the placeholder until an item is picked."
      >
        <div className="space-y-2">
          <Label htmlFor="select-demo-framework">Framework</Label>
          <Select>
            <SelectTrigger
              id="select-demo-framework"
              className="w-full max-w-xs"
            >
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="tanstack">TanStack Start</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section
        title="Disabled"
        description="Disabled trigger prevents opening and grays out the field."
      >
        <div className="space-y-2">
          <Label htmlFor="select-demo-disabled">Region</Label>
          <Select disabled>
            <SelectTrigger
              id="select-demo-disabled"
              className="w-full max-w-xs"
            >
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section
        title="Grouped items"
        description="SelectGroup with SelectLabel groups related items; SelectSeparator divides sections."
      >
        <div className="space-y-2">
          <Label htmlFor="select-demo-grouped">Favorite food</Label>
          <Select>
            <SelectTrigger id="select-demo-grouped" className="w-full max-w-xs">
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot">Carrot</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
                <SelectItem value="spinach">Spinach</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;select-trigger | select-content | select-item |
          select-value | select-group | select-label | select-separator&quot;
        </code>
        ; underlying primitive is Base UI Select.
      </p>
    </div>
  )
}

export default SelectDemo
