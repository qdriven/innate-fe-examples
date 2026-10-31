import { createAuthClient } from "better-auth/react"
import { useMemo } from "react"

const REAL_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_REAL_AUTH === "1"

const authClient = createAuthClient()

type MockResult = {
  data: { ok: true }
  error: null
}

const mockResult: MockResult = {
  data: { ok: true },
  error: null,
}

const demoSession = {
  user: {
    id: "demo-user",
    name: "Demo Admin",
    email: "admin@innate.dev",
  },
  session: {
    id: "demo-session",
  },
}

const mockSignIn = {
  email: async () => mockResult,
}
const mockSignUp = {
  email: async () => mockResult,
}

const mockSignOut = async () => ({ data: { success: true }, error: null })

function useMockSession() {
  return useMemo(
    () => ({
      data: demoSession,
      isPending: false,
      error: null,
    }),
    []
  )
}

export const signIn = REAL_AUTH_ENABLED ? authClient.signIn : mockSignIn
export const signUp = REAL_AUTH_ENABLED ? authClient.signUp : mockSignUp
export const signOut = REAL_AUTH_ENABLED ? authClient.signOut : mockSignOut
export const useSession = REAL_AUTH_ENABLED
  ? authClient.useSession
  : useMockSession
