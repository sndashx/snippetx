'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { makeQueryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/components/theme-provider'
import { CursorAccent } from '@/components/marketing/cursor-accent'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <CursorAccent />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
