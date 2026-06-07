"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: RegisterInput) {
    setSubmitError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || "Registration failed")
        } catch {
          throw new Error(`Registration failed with status ${res.status}: ${text || "No error message provided"}`)
        }
      }

      router.push("/browse")
      router.refresh()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed")
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
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join SnippetX to buy or sell code snippets.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>

          <FormField
            label="Confirm Password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
            required
          >
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
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
