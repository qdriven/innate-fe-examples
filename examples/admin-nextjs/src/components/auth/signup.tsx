"use client"

import Link from "next/link"
import { Suspense } from "react"
import GoogleSigninButton from "./google-signin-button"
import SignupWithPassword from "./signup-with-password"

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleSigninButton text="Sign up" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-border" />
        <div className="block w-full min-w-fit bg-background px-3 text-center font-medium">
          Or sign up with email
        </div>
        <span className="block h-px w-full bg-border" />
      </div>

      <div>
        <SignupWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </Suspense>
  )
}
