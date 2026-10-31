"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth/auth-client"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@innate/ui"
import { toast } from "sonner"
import Link from "next/link"
import { dashboardPath } from "@/lib/dashboard-path"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("admin@innate.dev")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const callbackURL = searchParams.get("callbackUrl") || dashboardPath()
      const result = await signIn.email({
        email,
        password,
        rememberMe: true,
      })

      if (!result.data) {
        throw new Error(result.error?.message || "Sign in failed")
      }

      router.push(callbackURL)
      router.refresh()
      toast.success("Signed in successfully (demo mode)")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@innate.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
          <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium">Demo credentials:</p>
            <p>Email: admin@innate.dev</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  )
}
