"use client"

import { useEffect, useState } from "react"
import { MonacoEditor } from "@/components/ui/monaco-editor/monaco-editor"
import { Loader2 } from "lucide-react"

export function SnippetDetailsClient({ 
  id, 
  language, 
  isPurchased 
}: { 
  id: string, 
  language: string, 
  isPurchased: boolean 
}) {
  const [code, setCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/snippets/preview?id=${id}`)
        const data = await res.json()
        if (data.code) setCode(data.code)
      } catch (err) {
        console.error("Failed to fetch preview:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPreview()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!code) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No code preview available.
      </div>
    )
  }

  return <MonacoEditor code={code} language={language} isPurchased={isPurchased} height={500} />
}
