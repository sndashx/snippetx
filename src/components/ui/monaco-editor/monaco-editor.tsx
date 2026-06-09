"use client"

import React, { useEffect, useRef, useState } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import { Copy, Check, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const languageMap: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  rust: "rust",
  go: "go",
  java: "java",
  cpp: "cpp",
  c: "c",
  cs: "csharp",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  scala: "scala",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  sql: "sql",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  fish: "shell",
  powershell: "powershell",
  dockerfile: "dockerfile",
  toml: "toml",
  xml: "xml",
  graphql: "graphql",
  prisma: "prisma",
}

export function MonacoEditor({ 
  code, 
  language, 
  isPurchased,
  height = 400,
  readOnly = true,
}: { 
  code: string
  language: string
  isPurchased: boolean
  height?: number
  readOnly?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    setIsEditorReady(true)
    
    editor.updateOptions({
      readOnly,
      fontSize: 13,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true },
    })

    if (!isPurchased) {
      editor.updateOptions({
        cursorStyle: "line-thin",
        mouseWheelZoom: false,
        contextmenu: false,
      })
    }
  }

  const handleCopy = async () => {
    if (!isPurchased || !editorRef.current) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBlurContent = () => {
    if (!isPurchased && editorRef.current) {
      editorRef.current.focus()
    }
  }

  const monacoLanguage = languageMap[language.toLowerCase()] || "plaintext"

  return (
    <div className="relative rounded-2xl border border-border bg-zinc-950 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/50" />
            <div className="size-3 rounded-full bg-yellow-500/50" />
            <div className="size-3 rounded-full bg-green-500/50" />
          </div>
          <span className="ml-2 text-xs font-mono text-zinc-500 capitalize">{language}</span>
        </div>
        {isPurchased && isEditorReady && (
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
      
      <div className="relative" style={{ height }}>
        {!isEditorReady ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Editor
              height="100%"
              language={monacoLanguage}
              theme="vs-dark"
              value={code}
              onMount={handleEditorMount}
              options={{
                readOnly,
                fontSize: 13,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
              }}
            />
            
            {!isPurchased && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none"
                onClick={handleBlurContent}
              >
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
          </>
        )}
      </div>
    </div>
  )
}