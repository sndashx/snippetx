"use client"

import React, { useState } from "react"
import { Copy, Check, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CodePreviewProps {
  code: string
  language: string
  isPurchased: boolean
}

export function CodePreview({ code, language, isPurchased }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!isPurchased) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // For non-buyers, we only show the first 10 lines and blur the rest
  const displayCode = isPurchased 
    ? code 
    : code.split("\n").slice(0, 10).join("\n") + "\n\n// ... rest of the code is locked"

  return (
    <div className="relative rounded-2xl border border-border bg-zinc-950 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/50" />
            <div className="size-3 rounded-full bg-yellow-500/50" />
            <div className="size-3 rounded-full bg-green-500/50" />
          </div>
          <span className="ml-2 text-xs font-mono text-zinc-500">{language}</span>
        </div>
        {isPurchased && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs text-zinc-400 hover:text-white transition-colors"
            onClick={handleCopy}
          >
            {copied ? <Check className="size-3 mr-1 text-green-500" /> : <Copy className="size-3 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
      
      <div className="relative p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <pre className="text-zinc-300">
          <code>{displayCode}</code>
        </pre>
        
        {!isPurchased && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-border shadow-2xl pointer-events-auto"
            >
              <div className="p-3 rounded-full bg-primary/20 text-primary">
                <Lock className="size-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Unlock Full Source</p>
                <p className="text-xs text-zinc-400">Purchase this snippet to access the full code.</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
