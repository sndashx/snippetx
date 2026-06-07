"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Code2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
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

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      })

      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || "Password reset failed")
        } catch {
          throw new Error(`Request failed with status ${res.status}`)
        }
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Password reset failed")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-lg">
            <Code2 className="size-6" />
            SnippetX
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Create new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        {submitSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600 font-medium">
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
