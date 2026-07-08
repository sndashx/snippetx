"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Code2, AlertCircle, CheckCircle2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [sessionReady, setSessionReady] = useState<boolean | null>(null) // null = loading, true = ready, false = failed
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  // On mount: parse the hash fragment and set the recovery session
  useEffect(() => {
    async function initRecoverySession() {
      // Supabase redirects to our page with a hash fragment:
      // #access_token=xxx&refresh_token=yyy&expires_in=3600&token_type=bearer&type=recovery
      const hash = window.location.hash.substring(1) // remove leading '#'
      if (!hash) {
        setSessionReady(false)
        return
      }

      const params = new URLSearchParams(hash)
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")
      const type = params.get("type")

      if (type !== "recovery" || !accessToken) {
        setSessionReady(false)
        return
      }

      // Set the session so updateUser() can use it
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || accessToken,
      })

      if (error) {
        console.error("Failed to set recovery session:", error.message)
        setSessionReady(false)
        return
      }

      // Clean the hash from the URL
      window.history.replaceState(null, "", window.location.pathname)
      setSessionReady(true)
    }

    initRecoverySession()
  }, [supabase])

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitError("")

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (error) {
      setSubmitError(error.message)
      return
    }

    setSubmitSuccess(true)
    // Sign out all other sessions and redirect
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  // Loading state
  if (sessionReady === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <Code2 className="size-8 mx-auto animate-pulse text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid / missing token
  if (!sessionReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight text-lg justify-center"
          >
            <Code2 className="size-6" />
            NUMINA
          </Link>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <AlertCircle className="size-10 mx-auto mb-4 text-destructive" />
            <h1 className="text-xl font-bold">Invalid or expired reset link</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is invalid or has expired. Request a new one.
            </p>
            <Button className="mt-6 w-full" render={<Link href="/forgot-password" />}>
              Request New Link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <CheckCircle2 className="size-12 mx-auto text-green-500" />
          <h1 className="text-xl font-bold">Password updated!</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  // Password form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-lg">
            <Code2 className="size-6" />
            NUMINA
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Create new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="New Password" htmlFor="password" error={errors.password?.message} required>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <FormField label="Confirm New Password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>

          {submitError && (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Updating password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
