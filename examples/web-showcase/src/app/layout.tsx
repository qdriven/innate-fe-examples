import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { ThreeColumnShell } from "@/components/three-column-shell"

import "@fontsource-variable/inter"
import "../styles/globals.css"
import { Toaster, TooltipProvider } from "@innate/ui"

export const metadata: Metadata = {
  title: "Innate UI — Component Preview",
  description:
    "Preview surface for every component exported by @innate/ui — variants, sizes, and slot contracts.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <ThreeColumnShell>{children}</ThreeColumnShell>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
