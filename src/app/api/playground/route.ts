import type { NextRequest } from "next/server"
import { modelFlagship } from "@/lib/brand"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * STUB — playground streaming endpoint.
 *
 * This handler pretends to be a chat-completions endpoint and emits a chunked
 * text stream so the /playground UI can demonstrate incremental rendering.
 *
 * Replace with a real provider call (e.g. fetch to api.minimax.dev) when the
 * API is live. Keep the streaming contract: emit Server-Sent Events with
 * `{ "delta": "..." }` payloads terminated by `{ "done": true }`.
 */

interface PlaygroundBody {
  prompt?: string
  model?: string
  temperature?: number
}

const SAMPLE = [
  "Here's a placeholder response from ",
  `${modelFlagship.name}. `,
  "This endpoint is a stub — ",
  "wire it to the real chat-completions API when it ships. ",
  "In the meantime, you can experiment with the UI: ",
  "stream tokens, switch models, and tweak the temperature. ",
  "Once the real backend is connected, the same client code will work — ",
  "only the response source changes.\n\n",
  "If you have feedback on the playground UX, ",
  "we'd love to hear it.",
]

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
  let body: PlaygroundBody = {}
  try {
    body = (await req.json()) as PlaygroundBody
  } catch {
    // Empty / malformed body — fall back to defaults.
  }

  const prompt = (body.prompt ?? "").toString().slice(0, 4_000)
  const model = (body.model ?? modelFlagship.name).toString().slice(0, 80)
  const temperature = Number.isFinite(body.temperature)
    ? Math.max(0, Math.min(2, Number(body.temperature)))
    : 0.7

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Header event so the UI can show the active model.
      controller.enqueue(
        encoder.encode(
          `event: meta\ndata: ${JSON.stringify({ model, temperature })}\n\n`,
        ),
      )

      // Acknowledge the prompt (useful for "thinking" indicator copy).
      controller.enqueue(
        encoder.encode(
          `event: prompt\ndata: ${JSON.stringify({ length: prompt.length })}\n\n`,
        ),
      )

      for (const chunk of SAMPLE) {
        await delay(45 + Math.floor(Math.random() * 90))
        controller.enqueue(
          encoder.encode(
            `event: token\ndata: ${JSON.stringify({ delta: chunk })}\n\n`,
          ),
        )
      }

      controller.enqueue(
        encoder.encode(`event: done\ndata: ${JSON.stringify({ done: true })}\n\n`),
      )
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "X-Playground-Stub": "true",
    },
  })
}