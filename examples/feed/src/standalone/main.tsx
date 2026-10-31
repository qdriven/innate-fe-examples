/**
 * standalone 入口：domain 脱离 webshell 单独运行的最小宿主。
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ThemeProvider } from "@innate/ui"
import { createStandaloneWebDomainRouter } from "@innate/web-domain"
import { BASE_PATH } from "../lib/base-path"
import { webDomain } from "../web-domain"

import "@innate/ui/globals.css"
import "../globals.css"

const router = createStandaloneWebDomainRouter(webDomain, {
  initialEntries: [BASE_PATH],
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
