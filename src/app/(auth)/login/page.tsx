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
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setSubmitError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || "Login failed")
        } catch {
          throw new Error(`Login failed with status ${res.status}: ${text || "No error message provided"}`)
        }
      }

      router.push("/browse")
      router.refresh()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-lg">
            <Code2 className="size-6" />
            NUMINA
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access your account.
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
               autoComplete="current-password"
               aria-invalid={!!errors.password}
               {...register("password")}
             />
           </FormField>
           <div className="flex justify-end">
             <Link href="/forgot-password" className="text-sm font-medium text-foreground hover:underline">
               Forgot password?
             </Link>
           </div>

          {submitError && (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
