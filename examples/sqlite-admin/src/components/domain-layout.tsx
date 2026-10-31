import { Outlet } from "@tanstack/react-router"
import { Toaster } from "@innate/ui"

export function DomainLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  )
}
