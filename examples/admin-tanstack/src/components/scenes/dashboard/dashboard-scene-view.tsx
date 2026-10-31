import { DashboardChat } from "../../dashboard/dashboard-chat"
import { DashboardExercise } from "../../dashboard/dashboard-exercise"
import { DashboardPaymentMethod } from "../../dashboard/dashboard-payment-method"
import { DashboardPayments } from "../../dashboard/dashboard-payments"
import { DashboardRevenue } from "../../dashboard/dashboard-revenue"
import { DashboardSubscriptions } from "../../dashboard/dashboard-subscriptions"
import { DashboardTeamMembers } from "../../dashboard/dashboard-team-members"

export function DashboardSceneView() {
  return (
    <>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-3">
        <DashboardTeamMembers />
        <DashboardSubscriptions />
        <DashboardRevenue />
      </div>
      <div className="grid grid-cols-1 items-stretch gap-[var(--spacing-section)] md:grid-cols-3">
        <div className="flex flex-col">
          <DashboardChat className="flex-1" />
        </div>
        <div className="flex flex-col md:col-span-2">
          <DashboardExercise className="flex-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-[var(--spacing-section)] md:grid-cols-3">
        <div className="flex flex-col md:col-span-2">
          <DashboardPayments className="flex-1" />
        </div>
        <DashboardPaymentMethod />
      </div>
    </>
  )
}
