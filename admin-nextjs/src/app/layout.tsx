import type { Metadata } from "next"
import { Providers } from "./providers"
import { TooltipProvider } from "@innate/ui"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "Next.js Admin Demo",
  description: "A demo admin dashboard built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
