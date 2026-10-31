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
  { value: "all-facilities", label: "全部设施" },
  { value: "east-campus", label: "华东制造中心" },
  { value: "south-campus", label: "华南制造中心" },
  { value: "north-campus", label: "华北物流中心" },
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
