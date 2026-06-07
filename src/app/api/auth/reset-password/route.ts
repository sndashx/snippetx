import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = schema.parse(body)

    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
