import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

let _db: NodePgDatabase<typeof schema> | null = null

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing. Set it in your environment.")
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    _db = drizzle(pool, { schema })
  }
  return _db
}

// Named export for convenience — lazily initialized
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop)
  },
})
