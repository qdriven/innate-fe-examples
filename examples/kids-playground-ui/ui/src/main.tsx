import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { InkProvider } from "@innate/ink"
import DesktopView from "./views/desktop-view"
import "./globals.css"

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <InkProvider>
      <DesktopView />
    </InkProvider>
  </StrictMode>
)
