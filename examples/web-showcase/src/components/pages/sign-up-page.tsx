"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

import { GoogleSigninButton } from "./auth/google-signin-button"
import { SignupWithPasswordForm } from "./auth/signup-with-password-form"

export function SignUpPageDemo() {
  return (
    <div className="mx-auto flex max-w-md justify-center py-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>Sign up with Google or email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleSigninButton text="Sign up" />
          <div className="flex items-center justify-center">
            <span className="block h-px w-full bg-border" />
            <div className="bg-card block w-full min-w-fit px-3 text-center text-sm font-medium">
              Or sign up with email
            </div>
            <span className="block h-px w-full bg-border" />
          </div>
          <SignupWithPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
