import { useQuery } from '@tanstack/react-query'

export function useSnippets(language?: string) {
  return useQuery({
    queryKey: ['snippets', language],
    queryFn: async () => {
      const url = language ? `/api/snippets?lang=${language}` : '/api/snippets'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch snippets')
      return res.json()
    },
  })
}
