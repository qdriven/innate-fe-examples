import * as React from "react"

interface FacilityOption {
  value: string
  label: string
}

interface FacilityScopeContextValue {
  facility: string
  setFacility: (nextFacility: string) => void
  facilities: Array<FacilityOption>
}

const defaultFacilities: Array<FacilityOption> = [
  { value: "all-facilities", label: "全部组织单元" },
  { value: "unit-a", label: "组织单元 A" },
  { value: "unit-b", label: "组织单元 B" },
  { value: "unit-c", label: "组织单元 C" },
]

const FacilityScopeContext =
  React.createContext<FacilityScopeContextValue | null>(null)

export function FacilityScopeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [facility, setFacility] = React.useState(defaultFacilities[0].value)

  const value = React.useMemo<FacilityScopeContextValue>(
    () => ({
      facility,
      setFacility,
      facilities: defaultFacilities,
    }),
    [facility]
  )

  return (
    <FacilityScopeContext.Provider value={value}>
      {children}
    </FacilityScopeContext.Provider>
  )
}

export function useFacilityScope() {
  const context = React.useContext(FacilityScopeContext)
  if (!context) {
    throw new Error(
      "useFacilityScope must be used within FacilityScopeProvider."
    )
  }
  return context
}
