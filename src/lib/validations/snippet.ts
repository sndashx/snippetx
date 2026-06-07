import { z } from 'zod'

const ACCEPTED_FILE_TYPES = [
  'text/javascript', 'application/javascript', 'text/typescript', 'application/typescript',
  'text/x-python', 'text/x-ruby', 'text/x-go', 'text/x-rust',
  'text/x-java', 'text/x-c', 'text/x-c++', 'text/x-csharp', 'text/x-php',
  'text/x-shellscript', 'application/sql', 'text/html', 'text/css',
  'application/json', 'text/yaml', 'text/markdown', 'text/plain',
]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const snippetSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  language: z.string().min(1, 'Select a language'),
  price: z.coerce.number().min(0, 'Price must be at least 0').max(10000, 'Price too high'),
})

export type SnippetInput = z.infer<typeof snippetSchema>
