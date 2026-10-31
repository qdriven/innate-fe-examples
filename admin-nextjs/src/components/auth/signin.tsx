"use client"

import Link from "next/link"
import { Suspense } from "react"
import GoogleSigninButton from "./google-signin-button"
import SigninWithPassword from "./signin-with-password"

export default function Signin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-border" />
        <div className="block w-full min-w-fit bg-background px-3 text-center font-medium">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-border" />
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don't have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </Suspense>
  )
}
