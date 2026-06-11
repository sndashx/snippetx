"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Code2, GitBranch, Bird, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

export const dynamic = "force-dynamic"

export default function RegisterPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      bio: "",
      website: "",
      github: "",
      twitter: "",
    },
  })

  const showSocialFields = watch("displayName") || watch("bio") || watch("website") || watch("github") || watch("twitter")

  async function onSubmit(values: RegisterInput) {
    setSubmitError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          displayName: values.displayName,
          bio: values.bio,
          website: values.website,
          github: values.github,
          twitter: values.twitter,
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
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
          {/* Required Fields */}
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

          <FormField label="Display Name" htmlFor="displayName" error={errors.displayName?.message} required>
            <Input
              id="displayName"
              type="text"
              placeholder="Your name or handle"
              autoComplete="name"
              aria-invalid={!!errors.displayName}
              {...register("displayName")}
            />
            <p className="mt-1 text-xs text-muted-foreground">How you&apos;ll appear on the marketplace (2-50 chars)</p>
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

          {/* Optional Profile Fields */}
          <div className="border-t border-border/50 pt-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              Optional — Build your seller profile
            </h3>

            <FormField label="Bio" htmlFor="bio" error={errors.bio?.message}>
              <Input
                id="bio"
                type="text"
                placeholder="I build React components and TypeScript tools..."
                autoComplete="off"
                aria-invalid={!!errors.bio}
                {...register("bio")}
              />
              <p className="mt-1 text-xs text-muted-foreground">Brief intro for buyers (max 500 chars)</p>
            </FormField>

            <FormField label="Website" htmlFor="website" error={errors.website?.message}>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-site.com"
                  autoComplete="url"
                  aria-invalid={!!errors.website}
                  className="pl-10"
                  {...register("website")}
                />
              </div>
            </FormField>

            <FormField label="GitHub" htmlFor="github" error={errors.github?.message}>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/yourname"
                  autoComplete="url"
                  aria-invalid={!!errors.github}
                  className="pl-10"
                  {...register("github")}
                />
              </div>
            </FormField>

            <FormField label="X (Twitter)" htmlFor="twitter" error={errors.twitter?.message}>
              <div className="relative">
                <Bird className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://x.com/yourname"
                  autoComplete="url"
                  aria-invalid={!!errors.twitter}
                  className="pl-10"
                  {...register("twitter")}
                />
              </div>
            </FormField>
          </div>

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
