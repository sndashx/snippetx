"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { snippetSchema, type SnippetInput } from "@/lib/validations/snippet"

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
]

export default function NewSnippetPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileError, setFileError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SnippetInput>({
    resolver: zodResolver(snippetSchema) as Resolver<SnippetInput>,
    defaultValues: { title: "", description: "", language: "", price: 0 },
  })

  async function onValid(values: SnippetInput, event?: FormEvent<HTMLFormElement>) {
    setSubmitError("")
    setFileError("")

    const file = event?.currentTarget
      ? (event.currentTarget.elements.namedItem("file") as HTMLInputElement | null)?.files?.[0] ?? null
      : null

    if (!file) {
      setFileError("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("language", values.language)
    formData.append("price", String(Math.round(values.price * 100)))
    formData.append("file", file)

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create snippet")
      }

      const { id } = await res.json()
      router.push(`/snippets/${id}`)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create snippet")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/sell"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Sell
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Upload Snippet</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in the details below to list your snippet on the marketplace.
      </p>

      <form onSubmit={(event) => void handleSubmit((values) => onValid(values, event))(event)} className="mt-8 space-y-6" noValidate>
        <FormField label="Title" htmlFor="title" error={errors.title?.message} required>
          <Input
            id="title"
            placeholder="e.g. React Hook Form Validation Kit"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Snippet File"
          htmlFor="file"
          error={fileError}
          required
          hint={fileName ? `Selected: ${fileName}` : undefined}
        >
          <Input
            id="file"
            name="file"
            type="file"
            accept=".js,.ts,.tsx,.jsx,.py,.rb,.go,.rs,.java,.c,.cpp,.h,.cs,.php,.sh,.sql,.html,.css,.json,.yaml,.md,.txt"
            aria-invalid={!!fileError}
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name || "")
              if (fileError) setFileError("")
            }}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          required
        >
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe what your snippet does and why it's useful..."
            aria-invalid={!!errors.description}
            {...register("description")}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Price (USD)" htmlFor="price" error={errors.price?.message} required>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="9.99"
              aria-invalid={!!errors.price}
              {...register("price")}
            />
          </FormField>

          <FormField
            label="Language"
            htmlFor="language"
            error={errors.language?.message}
            required
          >
            <select
              id="language"
              aria-invalid={!!errors.language}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
              defaultValue=""
              {...register("language")}
            >
              <option value="" disabled>
                Select language
              </option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {submitError && (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Snippet"}
        </Button>
      </form>
    </div>
  )
}
