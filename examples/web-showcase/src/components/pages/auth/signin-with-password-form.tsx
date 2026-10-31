"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button, Checkbox, Input, Label } from "@innate/ui"

export function SigninWithPasswordForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.info("Demo mode — auth not configured")
    } catch {
      toast.error("Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          name="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          value={data.email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Enter your password"
          name="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          value={data.password}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={data.remember}
            onCheckedChange={(checked) =>
              setData({ ...data, remember: checked === true })
            }
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
        <span className="text-primary text-sm">Forgot Password?</span>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
