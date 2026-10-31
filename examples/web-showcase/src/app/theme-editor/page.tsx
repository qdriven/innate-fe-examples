"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
  type ThemeVariant,
} from "@innate/ui"

import { useTheme } from "@/components/theme-provider"

const STORAGE_KEY = "showcase-custom-theme-v1"

const DEFAULT_TOKENS: Record<string, string> = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
}

const TOKEN_GROUPS: Array<{ key: string; title: string; tokens: string[] }> = [
  {
    key: "brand",
    title: "Brand Colors",
    tokens: ["primary", "primary-foreground", "accent", "accent-foreground"],
  },
  {
    key: "surface",
    title: "Base Colors",
    tokens: ["background", "foreground", "card", "card-foreground"],
  },
  {
    key: "sidebar",
    title: "Sidebar Colors",
    tokens: ["sidebar", "sidebar-foreground"],
  },
]

function toHexColor(value: string): string | null {
  if (typeof window === "undefined") return null
  const sample = document.createElement("span")
  sample.style.color = value
  if (!sample.style.color) return null
  document.body.appendChild(sample)
  const computed = getComputedStyle(sample).color
  sample.remove()

  const match = computed.match(/\d+/g)
  if (!match || match.length < 3) return null
  const [r, g, b] = match.slice(0, 3).map((n) => Number.parseInt(n, 10))
  if ([r, g, b].some(Number.isNaN)) return null
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

function tokenLabel(token: string) {
  return token
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const THEME_SWATCHES: Array<{
  id: ThemeVariant
  label: string
  chips: [string, string, string, string]
}> = [
  {
    id: "default",
    label: "Default",
    chips: [
      "oklch(1 0 0)",
      "oklch(0.205 0 0)",
      "oklch(0.97 0 0)",
      "oklch(0.985 0 0)",
    ],
  },
  {
    id: "webshell",
    label: "Webshell",
    chips: [
      "oklch(1 0 0)",
      "oklch(0.57 0.25 289)",
      "oklch(0.97 0.01 255)",
      "oklch(0.955 0 0)",
    ],
  },
  {
    id: "shadcn-zinc",
    label: "Shadcn Zinc",
    chips: [
      "hsl(0 0% 100%)",
      "hsl(240 5.9% 10%)",
      "hsl(240 4.8% 95.9%)",
      "hsl(0 0% 100%)",
    ],
  },
  {
    id: "shadcn-slate",
    label: "Shadcn Slate",
    chips: [
      "hsl(0 0% 100%)",
      "hsl(222.2 47.4% 11.2%)",
      "hsl(210 40% 96.1%)",
      "hsl(0 0% 100%)",
    ],
  },
  {
    id: "shadcn-stone",
    label: "Shadcn Stone",
    chips: [
      "hsl(0 0% 100%)",
      "hsl(24 9.8% 10%)",
      "hsl(60 4.8% 95.9%)",
      "hsl(0 0% 100%)",
    ],
  },
  {
    id: "shadcn-gray",
    label: "Shadcn Gray",
    chips: [
      "hsl(0 0% 100%)",
      "hsl(220.9 39.3% 11%)",
      "hsl(220 14.3% 95.9%)",
      "hsl(0 0% 100%)",
    ],
  },
  {
    id: "shadcn-neutral",
    label: "Shadcn Neutral",
    chips: [
      "hsl(0 0% 100%)",
      "hsl(0 0% 9%)",
      "hsl(0 0% 96.1%)",
      "hsl(0 0% 100%)",
    ],
  },
  {
    id: "linear",
    label: "Linear",
    chips: [
      "oklch(0.99 0.003 260)",
      "oklch(0.55 0.18 270)",
      "oklch(0.93 0.02 270)",
      "oklch(0.97 0.005 260)",
    ],
  },
  {
    id: "notion",
    label: "Notion",
    chips: [
      "oklch(0.985 0.002 80)",
      "oklch(0.78 0.16 80)",
      "oklch(0.94 0.005 80)",
      "oklch(0.97 0.002 80)",
    ],
  },
  {
    id: "marshmallow",
    label: "Marshmallow",
    chips: [
      "oklch(0.97 0.01 264.53)",
      "oklch(0.80 0.14 349.25)",
      "oklch(0.83 0.09 248.95)",
      "oklch(1 0 0)",
    ],
  },
  {
    id: "art-deco",
    label: "Art Deco",
    chips: [
      "oklch(0.96 0.03 106.96)",
      "oklch(0.77 0.14 91.05)",
      "oklch(0.89 0.18 95.32)",
      "oklch(0.96 0.03 106.96)",
    ],
  },
]

function applyCustomTheme(tokens: Record<string, string>) {
  const root = document.documentElement
  root.setAttribute("data-theme", "custom")
  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(`--${key}`, value)
  }
}

function subscribeStoredCustomTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener("storage", handleStorage)
  return () => window.removeEventListener("storage", handleStorage)
}

function getStoredCustomTheme() {
  return window.localStorage.getItem(STORAGE_KEY)
}

function parseStoredCustomTheme(raw: string | null) {
  if (!raw) return DEFAULT_TOKENS
  try {
    return { ...DEFAULT_TOKENS, ...(JSON.parse(raw) as Record<string, string>) }
  } catch {
    return DEFAULT_TOKENS
  }
}

export default function ThemeEditorPage() {
  const { variant, setVariant } = useTheme()
  const storedCustomTheme = useSyncExternalStore(
    subscribeStoredCustomTheme,
    getStoredCustomTheme,
    () => null
  )
  const savedTokens = useMemo(
    () => parseStoredCustomTheme(storedCustomTheme),
    [storedCustomTheme]
  )
  const [draftTokens, setDraftTokens] = useState<Record<string, string> | null>(
    null
  )
  const tokens = draftTokens ?? savedTokens

  useEffect(() => {
    if (variant !== "custom") return
    applyCustomTheme(tokens)
  }, [tokens, variant])

  const entries = useMemo(() => Object.entries(tokens), [tokens])

  const updateToken = (key: string, value: string) => {
    setDraftTokens((current) => ({ ...(current ?? tokens), [key]: value }))
  }

  const handleSelectTheme = (theme: ThemeVariant) => {
    setVariant(theme)
    if (theme !== "custom") {
      const root = document.documentElement
      for (const key of Object.keys(DEFAULT_TOKENS)) {
        root.style.removeProperty(`--${key}`)
      }
    } else {
      applyCustomTheme(tokens)
    }
  }

  const handleApply = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    setVariant("custom")
    applyCustomTheme(tokens)
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setDraftTokens(DEFAULT_TOKENS)
    setVariant("default")
    const root = document.documentElement
    for (const key of Object.keys(DEFAULT_TOKENS)) {
      root.style.removeProperty(`--${key}`)
    }
  }

  return (
    <main className="w-full px-4 py-8 lg:px-6">
      <header className="mb-6">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Showcase Theme Tools
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Theme Editor
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          Edit token values and save a custom theme preset for this browser.
          Theme mode (light/dark/system) still works with your custom token set.
        </p>
      </header>

      <section className="mb-6 rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold">Theme presets</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Pick a theme by preview swatches. Current:{" "}
          <span className="font-medium">{variant}</span>
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_SWATCHES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelectTheme(theme.id)}
              className="rounded-lg border p-3 text-left transition-colors hover:bg-muted/40 data-[active=true]:border-primary data-[active=true]:bg-primary/5"
              data-active={variant === theme.id}
            >
              <p className="text-sm font-medium">{theme.label}</p>
              <div className="mt-2 flex gap-1">
                {theme.chips.map((chip, idx) => (
                  <span
                    key={`${theme.id}-${idx}`}
                    className="h-6 flex-1 rounded"
                    style={{ backgroundColor: chip }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold">Token editor (Studio style)</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Click swatch to pick color, or edit OKLCH/HEX text directly.
        </p>

        <Accordion
          defaultValue={["brand", "surface", "sidebar"]}
          className="mt-3 space-y-3"
        >
          {TOKEN_GROUPS.map((group) => (
            <AccordionItem
              key={group.key}
              value={group.key}
              className="rounded-lg border px-3"
            >
              <AccordionTrigger className="cursor-pointer py-3 text-sm font-medium">
                {group.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-3">
                {group.tokens.map((tokenKey) => {
                  const value = tokens[tokenKey] ?? ""
                  const hex = toHexColor(value)
                  return (
                    <div
                      key={tokenKey}
                      className="space-y-2 rounded-md border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {tokenLabel(tokenKey)}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {hex ?? "invalid"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="relative h-9 w-11 overflow-hidden rounded border"
                          style={{ backgroundColor: hex ?? "transparent" }}
                        >
                          <input
                            type="color"
                            aria-label={`${tokenKey} color picker`}
                            value={hex ?? "#000000"}
                            onChange={(e) =>
                              updateToken(tokenKey, e.target.value)
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </div>
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateToken(tokenKey, e.target.value)
                          }
                          placeholder="oklch(...) or #RRGGBB"
                          className="flex-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold">Raw token map</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Full set currently tracked in custom preset.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {entries.map(([key, value]) => (
            <label key={key} className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                {key}
              </span>
              <Input
                value={value}
                onChange={(e) => updateToken(key, e.target.value)}
                placeholder="oklch(...)"
                className="font-mono text-xs"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="mt-5 flex items-center gap-2">
        <Button onClick={handleApply}>Apply as Custom Theme</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
      </div>
    </main>
  )
}
