"use client"

import Link from "next/link"
import { SlidersHorizontalIcon } from "lucide-react"
import { DropdownMenuItem, ThemeSelector } from "@innate/ui"

/**
 * web-showcase 专属 wrapper：在共享 ThemeSelector 上补两项 app-only 内容 ——
 * `custom` variant（由 /theme-editor 写入内联变量）与 Theme Editor 入口。
 * 其余 app / webshell 直接用 `@innate/ui` 的 ThemeSelector。
 */
export function ThemeSelectorWithEditor() {
  return (
    <ThemeSelector extraVariants={[{ value: "custom", label: "Custom" }]}>
      <DropdownMenuItem render={<Link href="/theme-editor" />}>
        <SlidersHorizontalIcon data-icon />
        Theme Editor
      </DropdownMenuItem>
    </ThemeSelector>
  )
}
