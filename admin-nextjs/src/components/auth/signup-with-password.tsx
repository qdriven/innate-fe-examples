"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button, Input, Label } from "@innate/ui"

export default function SignupWithPassword() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
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
      toast.info("Demo mode - auth not configured")
    } catch {
      toast.error("Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          name="name"
          onChange={handleChange}
          value={data.name}
        />
      </div>

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
          placeholder="Create a password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  )
}
