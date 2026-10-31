import { redirect } from "next/navigation"

import { dashboardPath } from "@/lib/dashboard-path"

export default function RootPage() {
  redirect(dashboardPath())
}
