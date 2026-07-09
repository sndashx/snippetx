/**
 * Tiny, dependency-free markdown renderer for research bodies.
 *
 * Supports the subset of markdown used by `src/content/research.ts`:
 *   - ATX headings: ##, ###
 *   - paragraphs (blank-line separated)
 *   - unordered lists (- item)
 *   - fenced code blocks (```)
 *   - inline code (`code`)
 *   - bold (**text**)
 *   - links ([label](href))
 *   - simple GFM tables (header row, separator row, body rows)
 *
 * Output is an array of React nodes ready to drop into JSX. It is intentionally
 * permissive: anything we don't recognise is rendered as a plain paragraph so
 * untrusted-ish content never throws.
 */
import type { ReactNode } from "react"

interface Block {
  kind: "h2" | "h3" | "p" | "ul" | "ol" | "code" | "table"
  text?: string
  items?: string[]
  lang?: string
  table?: { headers: string[]; rows: string[][] }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderInline(raw: string): ReactNode[] {
  const out: ReactNode[] = []
  // Tokenise: code spans, links, bold. Order matters — try code first.
  const re = /(`[^`\n]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*\n]+\*\*)/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) out.push(raw.slice(last, m.index))
    const token = m[0]
    if (token.startsWith("`")) {
      out.push(
        <code
          key={`c-${key++}`}
          className="rounded bg-card/70 px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (lm) {
        const [, label, href] = lm
        out.push(
          <a
            key={`l-${key++}`}
            href={href}
            className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
            {...(/^https?:\/\//.test(href) ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          >
            {label}
          </a>,
        )
      } else {
        out.push(token)
      }
    } else if (token.startsWith("**")) {
      out.push(
        <strong key={`b-${key++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    }
    last = m.index + token.length
  }
  if (last < raw.length) out.push(raw.slice(last))
  return out
}

function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Fenced code
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push({ kind: "code", text: buf.join("\n"), lang })
      continue
    }

    // Headings
    const h = /^(#{2,3})\s+(.*)$/.exec(line)
    if (h) {
      blocks.push({ kind: h[1].length === 2 ? "h2" : "h3", text: h[2].trim() })
      i++
      continue
    }

    // Tables (very small GFM subset)
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])
    ) {
      const splitRow = (r: string) =>
        r
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim())
      const headers = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push({ kind: "table", table: { headers, rows } })
      continue
    }

    // Unordered list
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, ""))
        i++
      }
      blocks.push({ kind: "ul", items })
      continue
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""))
        i++
      }
      blocks.push({ kind: "ol", items })
      continue
    }

    // Blank line
    if (line.trim() === "") {
      i++
      continue
    }

    // Paragraph (consume contiguous non-blank lines)
    const buf: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{2,3})\s+/.test(lines[i]) &&
      !/^\s*-\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    blocks.push({ kind: "p", text: buf.join(" ") })
  }
  return blocks
}

export function renderMarkdown(src: string): ReactNode {
  const blocks = parseMarkdown(src)
  return blocks.map((b, idx) => {
    switch (b.kind) {
      case "h2":
        return (
          <h2
            key={idx}
            className="mt-12 text-display-md text-balance text-foreground first:mt-0"
          >
            {renderInline(b.text!)}
          </h2>
        )
      case "h3":
        return (
          <h3 key={idx} className="mt-8 text-balance text-xl font-medium tracking-tight text-foreground">
            {renderInline(b.text!)}
          </h3>
        )
      case "p":
        return (
          <p
            key={idx}
            className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground"
          >
            {renderInline(b.text!)}
          </p>
        )
      case "ul":
        return (
          <ul key={idx} className="mt-5 flex flex-col gap-2 pl-5 text-pretty text-base text-muted-foreground">
            {b.items!.map((it, j) => (
              <li key={j} className="relative pl-2 marker:text-accent">
                <span
                  aria-hidden
                  className="absolute -left-4 top-2.5 size-1 rounded-full bg-accent"
                />
                {renderInline(it)}
              </li>
            ))}
          </ul>
        )
      case "ol":
        return (
          <ol key={idx} className="mt-5 flex list-decimal flex-col gap-2 pl-6 text-pretty text-base text-muted-foreground">
            {b.items!.map((it, j) => (
              <li key={j}>{renderInline(it)}</li>
            ))}
          </ol>
        )
      case "code":
        return (
          <pre
            key={idx}
            className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/60 p-5 text-sm leading-relaxed"
          >
            <code
              className="font-mono text-foreground/90"
              dangerouslySetInnerHTML={{ __html: escapeHtml(b.text!) }}
            />
          </pre>
        )
      case "table":
        return (
          <div key={idx} className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="bg-card/60">
                <tr>
                  {b.table!.headers.map((h, j) => (
                    <th
                      key={j}
                      className="border-b border-border px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.table!.rows.map((row, r) => (
                  <tr key={r} className="border-b border-border/60 last:border-b-0">
                    {row.map((cell, c) => (
                      <td key={c} className="px-4 py-3 text-pretty text-foreground/85">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
    }
  })
}