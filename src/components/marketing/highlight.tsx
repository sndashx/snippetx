import type { ReactNode } from "react"

const TS_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "let",
  "var",
  "function",
  "return",
  "async",
  "await",
  "new",
  "if",
  "else",
  "for",
  "while",
  "interface",
  "type",
  "extends",
  "implements",
  "public",
  "private",
  "protected",
  "static",
  "as",
  "default",
])

const TS_LITERALS = new Set(["true", "false", "null", "undefined"])

/**
 * A tiny, dependency-free highlighter for `ts`/`tsx`/`js`/`json`.
 * Produces a flat array of tokens (text + className) ready to render.
 * Tokeniser is regex-driven and intentionally conservative — it never
 * rewrites or invents code, just tints it. No HTML escaping is performed;
 * callers should render with `dangerouslySetInnerHTML` or via React nodes.
 */
type Token = { text: string; cls?: string }
type Lang = "ts" | "tsx" | "js" | "json" | "bash" | "text"

function tokenise(code: string, lang: Lang): Token[] {
  if (lang === "text") return [{ text: code }]

  // Shared token regex. Order matters: comments > strings > numbers > keywords > punctuation.
  const tokenRe =
    /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][A-Za-z0-9_$]*\b)|([{}()\[\];,.<>=+\-*/!?:&|])/g

  const isKeyword = (w: string) =>
    lang === "json" ? false : TS_KEYWORDS.has(w) || TS_LITERALS.has(w)

  const tokens: Token[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = tokenRe.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index) })
    const [
      whole,
      lineComment,
      blockComment,
      tplString,
      dqString,
      sqString,
      number,
      ident,
      punct,
    ] = m

    if (lineComment || blockComment) {
      tokens.push({ text: whole, cls: "tok-comment" })
    } else if (tplString) {
      tokens.push({ text: whole, cls: "tok-string" })
    } else if (dqString || sqString) {
      tokens.push({ text: whole, cls: "tok-string" })
    } else if (number) {
      tokens.push({ text: whole, cls: "tok-number" })
    } else if (ident) {
      if (isKeyword(ident)) {
        tokens.push({ text: ident, cls: "tok-keyword" })
      } else if (lang === "json") {
        // Bare identifiers in JSON are illegal; tint them as error-ish anyway.
        tokens.push({ text: ident, cls: "tok-ident" })
      } else if (/^[A-Z]/.test(ident)) {
        tokens.push({ text: ident, cls: "tok-type" })
      } else {
        tokens.push({ text: ident, cls: "tok-ident" })
      }
    } else if (punct) {
      tokens.push({ text: whole, cls: "tok-punct" })
    } else {
      tokens.push({ text: whole })
    }
    last = m.index + whole.length
  }
  if (last < code.length) tokens.push({ text: code.slice(last) })
  return tokens
}

export interface CodeBlockProps {
  code: string
  lang?: Lang
  filename?: string
}

/** Escape HTML — used so we can safely inject highlighted tokens. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function CodeBlock({ code, lang = "text", filename }: CodeBlockProps) {
  const tokens = tokenise(code, lang)
  const html = tokens
    .map((t) => (t.cls ? `<span class="${t.cls}">${escapeHtml(t.text)}</span>` : escapeHtml(t.text)))
    .join("")
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card/50">
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {filename}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {lang}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code
          className="font-mono text-foreground/90"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  )
}

/**
 * Inline helper to render highlighted tokens as React nodes (used inside
 * existing <pre><code> blocks when we want full control).
 */
export function renderHighlighted(code: string, lang: Lang): ReactNode[] {
  return tokenise(code, lang).map((t, i) =>
    t.cls ? (
      <span key={i} className={t.cls}>
        {t.text}
      </span>
    ) : (
      <span key={i}>{t.text}</span>
    ),
  )
}