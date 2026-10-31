"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button, Checkbox, Input, Label } from "@innate/ui"

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Demo mode - show toast instead of actual auth
      toast.info("Demo mode - auth not configured")
    } catch {
      toast.error("Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          name="email"
          onChange={handleChange}
          value={data.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={data.remember}
            onCheckedChange={(checked) =>
              setData({
                ...data,
                remember: checked as boolean,
              })
            }
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>

        <a href="#" className="text-sm text-primary hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
