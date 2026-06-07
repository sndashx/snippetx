import { useQuery } from '@tanstack/react-query'

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    },
  })
}
