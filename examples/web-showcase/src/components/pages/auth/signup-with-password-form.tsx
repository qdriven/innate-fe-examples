"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button, Input, Label } from "@innate/ui"

export function SignupWithPasswordForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.info("Demo mode — auth not configured")
    } catch {
      toast.error("Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Enter your name"
          name="name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
          value={data.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          name="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          value={data.email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          name="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          value={data.password}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  )
}
