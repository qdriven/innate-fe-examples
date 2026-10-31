"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

import { SigninWithPasswordForm } from "./auth/signin-with-password-form"

export function SignInPageDemo() {
  return (
    <div className="mx-auto flex max-w-md justify-center py-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SigninWithPasswordForm />
          <div className="bg-muted text-muted-foreground mt-4 rounded-md p-3 text-xs">
            <p className="font-medium">Demo only</p>
            <p>No auth backend — copied from admin-nextjs auth UI.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
