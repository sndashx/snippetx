"use client"

import React, { useEffect, useState } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { Search, X, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const COMMANDS = [
  { label: "Browse Snippets", value: "/browse", icon: Search },
  { label: "Sell a Snippet", value: "/sell/new", icon: Terminal },
  { label: "My Profile", value: "/profile", icon: Terminal },
  { label: "Login", value: "/login", icon: Terminal },
  { label: "Register", value: "/register", icon: Terminal },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl glass"
          onClick={(e) => e.stopPropagation()}
        >
          <Command>
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 size-4 text-muted-foreground" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex-1 py-3 text-sm outline-none bg-transparent"
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                <span className="hidden sm:inline">ESC</span>
                <span>to close</span>
              </div>
            </div>
            <Command.List className="p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              <Command.Group heading="Navigation">
                {COMMANDS.map((cmd) => (
                  <Command.Item
                    key={cmd.value}
                    onSelect={() => {
                      router.push(cmd.value)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <cmd.icon className="size-4 text-muted-foreground" />
                    <span>{cmd.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
