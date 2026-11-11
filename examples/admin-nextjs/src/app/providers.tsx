"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@innate/ui"
import { shellMessages } from "@/lib/shell-messages"

export function Providers({ children }: { children: React.ReactNode }) {
  // LocaleProvider 必须包住 ThemeSelector：其内部 useLocale 无 Provider 会 throw
  return (
    <ThemeProvider>
      <LocaleProvider messages={shellMessages}>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
