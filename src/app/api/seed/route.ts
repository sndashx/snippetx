import { db } from "@/db"
import { users, profiles, snippets, orders, reviews, wishlists, versions } from "@/db/schema"
import { createAdminClient } from "@/lib/supabase/server"
import { uploadSnippet } from "@/lib/r2"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

const PLATFORM_EMAIL = "site@sn-x.com"
const PLATFORM_PASSWORD = "platform-sn-x-2026"
const PLATFORM_DISPLAY_NAME = "Sn-x.com"

const SEED_SNIPPETS = [
  {
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod. Includes email, password, credit card, phone number validators.",
    language: "TypeScript",
    price: 1200,
    fileName: "validation-kit.ts",
    content: 'import { z } from "zod"\n\nexport const emailSchema = z.string().min(1, "Email is required").email("Invalid email").transform((v) => v.toLowerCase().trim())\n\nexport const passwordSchema = z.string().min(8, "Must be at least 8 characters").max(128).regex(/[A-Z]/, "Need uppercase").regex(/[a-z]/, "Need lowercase").regex(/[0-9]/, "Need a number")\n\nexport const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Required") })\nexport type LoginInput = z.infer<typeof loginSchema>',
  },
  {
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support. Includes rate limiting, refresh token rotation, and RBAC.",
    language: "JavaScript",
    price: 1900,
    fileName: "auth-middleware.js",
    content: 'const jwt = require("jsonwebtoken")\n\nfunction generateTokens(payload, secret, refreshSecret) {\n  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" })\n  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" })\n  return { accessToken, refreshToken }\n}\n\nfunction authenticate(secret) {\n  return (req, res, next) => {\n    const header = req.headers.authorization\n    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" })\n    try { req.user = jwt.verify(header.split(" ")[1], secret); next() }\n    catch { return res.status(401).json({ error: "Invalid token" }) }\n  }\n}\n\nmodule.exports = { generateTokens, authenticate }',
  },
  {
    title: "Tailwind Component Library",
    description: "60+ responsive UI components built with Tailwind CSS v4 and shadcn/ui. Fully accessible, dark mode ready, with customizable design tokens.",
    language: "TypeScript",
    price: 2900,
    fileName: "component-library.tsx",
    content: 'import * as React from "react"\nimport { cva, type VariantProps } from "class-variance-authority"\n\nconst buttonVariants = cva("inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {\n  variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", outline: "border border-input bg-background hover:bg-muted" }, size: { default: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" } },\n  defaultVariants: { variant: "default", size: "default" },\n})\n\nexport { buttonVariants }',
  },
  {
    title: "Python Data Pipeline",
    description: "Production-ready ETL pipeline framework with parallel processing, error handling, logging, and integration with S3, PostgreSQL, and REST APIs.",
    language: "Python",
    price: 2400,
    fileName: "data_pipeline.py",
    content: 'import json, logging\nfrom typing import Any, Callable, Generator\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\nfrom dataclasses import dataclass, field\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\n@dataclass\nclass PipelineContext:\n    config: dict[str, Any] = field(default_factory=dict)\n    metrics: dict[str, int] = field(default_factory=lambda: {"extracted": 0, "transformed": 0, "loaded": 0})\n    errors: list[str] = field(default_factory=list)',
  },
  {
    title: "Go API Starter",
    description: "Clean REST API boilerplate in Go with routing, middleware, PostgreSQL integration, structured logging, graceful shutdown, and Docker support.",
    language: "Go",
    price: 1500,
    fileName: "api-starter.go",
    content: 'package main\n\nimport (\n    "context"\n    "encoding/json"\n    "log"\n    "net/http"\n    "os"\n    "os/signal"\n    "syscall"\n    "time"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})\n    })\n    srv := &http.Server{Addr: ":8080", Handler: mux}\n    go srv.ListenAndServe()\n    quit := make(chan os.Signal, 1)\n    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)\n    <-quit\n    srv.Shutdown(context.Background())\n}',
  },
  {
    title: "SQL Query Builder",
    description: "Lightweight SQL query builder for Node.js with SELECT, INSERT, UPDATE, DELETE, JOINs, and parameterized queries. Zero dependencies, under 200 lines.",
    language: "JavaScript",
    price: 800,
    fileName: "query-builder.js",
    content: 'class QueryBuilder {\n  constructor(table) { this.table = table; this._select = []; this._where = []; this._params = [] }\n  select(...cols) { this._select = cols.length ? cols : ["*"]; return this }\n  where(col, op, val) { if (val === undefined) { val = op; op = "=" }; this._where.push({ col, op, param: "$" + (this._params.length + 1) }); this._params.push(val); return this }\n  toSelect() {\n    let sql = "SELECT " + (this._select.length ? this._select.join(", ") : "*") + \' FROM "\' + this.table + \'"\'\n    if (this._where.length) sql += " WHERE " + this._where.map(w => \'"\' + this.table + \'"."\' + w.col + \'" \' + w.op + " " + w.param).join(" AND ")\n    return { sql, params: this._params }\n  }\n}\nfunction query(table) { return new QueryBuilder(table) }\nmodule.exports = { query, QueryBuilder }',
  },
  {
    title: "React Custom Hooks Collection",
    description: "12 production-ready React hooks: useDebounce, useLocalStorage, useMediaQuery, useIntersectionObserver, useClipboard, useOnlineStatus, useTimeout, useInterval, usePrevious, useClickOutside, useLockedBody, useCopyToClipboard. Each hook is fully typed and tested.",
    language: "TypeScript",
    price: 1800,
    fileName: "react-hooks.ts",
    content: 'import { useState, useEffect, useCallback, useRef } from "react"\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n  return debounced\n}\n\nexport function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {\n  const [stored, setStored] = useState<T>(() => {\n    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue }\n    catch { return initialValue }\n  })\n  const setValue = (value: T) => {\n    setStored(value)\n    localStorage.setItem(key, JSON.stringify(value))\n  }\n  return [stored, setValue]\n}\n\nexport function useMediaQuery(query: string): boolean {\n  const [matches, setMatches] = useState(false)\n  useEffect(() => {\n    const mql = window.matchMedia(query)\n    setMatches(mql.matches)\n    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)\n    mql.addEventListener("change", handler)\n    return () => mql.removeEventListener("change", handler)\n  }, [query])\n  return matches\n}\n\nexport function useIntersectionObserver(ref: React.RefObject<Element>, options?: IntersectionObserverInit): boolean {\n  const [isIntersecting, setIsIntersecting] = useState(false)\n  useEffect(() => {\n    if (!ref.current) return\n    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), options)\n    observer.observe(ref.current)\n    return () => observer.disconnect()\n  }, [ref, options])\n  return isIntersecting\n}\n\nexport function useClipboard(): [boolean, (text: string) => Promise<void>] {\n  const [copied, setCopied] = useState(false)\n  const copy = useCallback(async (text: string) => {\n    await navigator.clipboard.writeText(text)\n    setCopied(true)\n    setTimeout(() => setCopied(false), 2000)\n  }, [])\n  return [copied, copy]\n}\n\nexport function useOnlineStatus(): boolean {\n  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)\n  useEffect(() => {\n    const handler = () => setOnline(navigator.onLine)\n    window.addEventListener("online", handler)\n    window.addEventListener("offline", handler)\n    return () => { window.removeEventListener("online", handler); window.removeEventListener("offline", handler) }\n  }, [])\n  return online\n}\n\nexport function usePrevious<T>(value: T): T | undefined {\n  const ref = useRef<T>()\n  useEffect(() => { ref.current = value })\n  return ref.current\n}\n\nexport function useClickOutside(ref: React.RefObject<Element>, handler: () => void) {\n  useEffect(() => {\n    const listener = (e: MouseEvent | TouchEvent) => {\n      if (!ref.current || ref.current.contains(e.target as Node)) return\n      handler()\n    }\n    document.addEventListener("mousedown", listener)\n    document.addEventListener("touchstart", listener)\n    return () => { document.removeEventListener("mousedown", listener); document.removeEventListener("touchstart", listener) }\n  }, [ref, handler])\n}',
  },
  {
    title: "Express Rate Limiter & Security Pack",
    description: "Production-ready Express security middleware bundle: rate limiting (token bucket), CORS hardening, helmet config, request size limiting, SQL injection prevention, XSS filtering, and CSRF protection. Drop-in security for any Express app.",
    language: "JavaScript",
    price: 1400,
    fileName: "express-security.js",
    content: 'const rateLimit = require("express-rate-limit")\n\nfunction createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {\n  return rateLimit({\n    windowMs,\n    max,\n    standardHeaders: true,\n    legacyHeaders: false,\n    message: { error: "Too many requests, please try again later." },\n  })\n}\n\nfunction securityMiddleware(app) {\n  app.set("trust proxy", 1)\n  app.use(createRateLimiter())\n  app.use((req, res, next) => {\n    res.removeHeader("X-Powered-By")\n    res.setHeader("X-Content-Type-Options", "nosniff")\n    res.setHeader("X-Frame-Options", "DENY")\n    res.setHeader("X-XSS-Protection", "1; mode=block")\n    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")\n    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()")\n    next()\n  })\n  app.use(express.json({ limit: "10kb" }))\n  app.use(express.urlencoded({ extended: false, limit: "10kb" }))\n}\n\nfunction sanitizeInput(input) {\n  if (typeof input !== "string") return input\n  return input.replace(/[<>"\'\\\\]/g, (char) => ({\n    "<": "&lt;", ">": "&gt;", \'"\': "&quot;",\n    "\'": "&#x27;", "\\\\": "&#x5C;",\n  }[char] || char))\n}\n\nfunction sqlInjectionCheck(req, res, next) {\n  const patterns = /[\\s]?(OR|AND|UNION|SELECT|DROP|DELETE|INSERT|UPDATE|--|;|\\/\\*|\\*\\/|\\bEXEC\\b|\\bXP_\\b)/i\n  const check = (obj) => {\n    for (const key in obj) {\n      if (typeof obj[key] === "string" && patterns.test(obj[key])) {\n        return true\n      }\n      if (typeof obj[key] === "object" && obj[key] !== null) {\n        if (check(obj[key])) return true\n      }\n    }\n    return false\n  }\n  if (check(req.body) || check(req.query) || check(req.params)) {\n    return res.status(400).json({ error: "Invalid input detected" })\n  }\n  next()\n}\n\nmodule.exports = { securityMiddleware, sanitizeInput, sqlInjectionCheck, createRateLimiter }',
  },
  {
    title: "Python Async Web Scraper",
    description: "High-performance async web scraper using httpx and BeautifulSoup. Features: concurrent pagination, rate limiting, retry logic with exponential backoff, rotating user agents, proxy support, caching layer, and structured data extraction with Pydantic models.",
    language: "Python",
    price: 1600,
    fileName: "async_scraper.py",
    content: 'import asyncio\nimport hashlib\nimport json\nimport logging\nfrom dataclasses import dataclass, field\nfrom random import choice, uniform\nfrom typing import Optional\n\nimport httpx\nfrom bs4 import BeautifulSoup\n\nlogger = logging.getLogger(__name__)\n\nUSER_AGENTS = [\n    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",\n    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/17.2",\n    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/119.0.0.0",\n]\n\n@dataclass\nclass ScraperConfig:\n    max_concurrency: int = 5\n    max_retries: int = 3\n    base_delay: float = 1.0\n    max_delay: float = 30.0\n    cache_ttl: int = 3600\n    proxy: Optional[str] = None\n\nclass AsyncScraper:\n    def __init__(self, config: ScraperConfig):\n        self.config = config\n        self._cache: dict[str, tuple[float, str]] = {}\n        self._semaphore = asyncio.Semaphore(config.max_concurrency)\n\n    def _get_headers(self) -> dict:\n        return {"User-Agent": choice(USER_AGENTS), "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.5"}\n\n    def _cache_key(self, url: str) -> str:\n        return hashlib.sha256(url.encode()).hexdigest()\n\n    def _get_cached(self, url: str) -> Optional[str]:\n        key = self._cache_key(url)\n        if key in self._cache:\n            ts, data = self._cache[key]\n            if asyncio.get_event_loop().time() - ts < self.config.cache_ttl:\n                return data\n            del self._cache[key]\n        return None\n\n    async def fetch(self, url: str) -> Optional[str]:\n        cached = self._get_cached(url)\n        if cached:\n            return cached\n        async with self._semaphore:\n            for attempt in range(self.config.max_retries):\n                try:\n                    async with httpx.AsyncClient(proxy=self.config.proxy, timeout=30.0) as client:\n                        resp = await client.get(url, headers=self._get_headers(), follow_redirects=True)\n                        resp.raise_for_status()\n                        text = resp.text\n                        key = self._cache_key(url)\n                        self._cache[key] = (asyncio.get_event_loop().time(), text)\n                        return text\n                except (httpx.HTTPError, httpx.TimeoutException) as e:\n                    if attempt == self.config.max_retries - 1:\n                        logger.error(f"Failed to fetch {url} after {self.config.max_retries} attempts: {e}")\n                        return None\n                    delay = min(self.config.base_delay * (2 ** attempt) + uniform(0, 1), self.config.max_delay)\n                    await asyncio.sleep(delay)\n\n    async def fetch_many(self, urls: list[str]) -> list[Optional[str]]:\n        tasks = [self.fetch(url) for url in urls]\n        return await asyncio.gather(*tasks)\n\n    def parse(self, html: str, selector: str) -> list[str]:\n        soup = BeautifulSoup(html, "html.parser")\n        return [el.get_text(strip=True) for el in soup.select(selector)]',
  },
  {
    title: "TypeScript Utility Types Pack",
    description: "40+ advanced TypeScript utility types for production apps: DeepPartial, DeepRequired, NonNullableFields, UnionToIntersection, Prettify, Brand, ISOStringDate, PickByValue, Entries, PathInto, PathValue, AtLeastOne, and more. Save hours of type gymnastics.",
    language: "TypeScript",
    price: 1000,
    fileName: "utility-types.ts",
    content: 'export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T\n\nexport type DeepRequired<T> = T extends object ? { [P in keyof T]-?: DeepRequired<T[P]> } : T\n\nexport type NonNullableFields<T> = { [P in keyof T]: NonNullable<T[P]> }\n\nexport type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never\n\nexport type Prettify<T> = { [K in keyof T]: T[K] } & {}\n\ntype Brand<T, B> = T & { __brand: B }\nexport type Email = Brand<string, "Email">\nexport type UUID = Brand<string, "UUID">\nexport type URL = Brand<string, "URL">\nexport type PhoneNumber = Brand<string, "PhoneNumber">\n\nexport type ISOStringDate = Brand<string, "ISOStringDate">\n\nexport type PickByValue<T, V> = { [P in keyof T as T[P] extends V ? P : never]: T[P] }\n\nexport type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]\n\nexport type PathInto<T> = T extends object ? { [K in keyof T]-?: K extends string ? `${K}` | `${K}.${PathInto<T[K]>}` : never }[keyof T] : never\n\nexport type PathValue<T, P extends string> = P extends `${infer K}.${infer R}` ? K extends keyof T ? PathValue<T[K], R> : never : P extends keyof T ? T[P] : never\n\nexport type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]\n\nexport type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never\n\nexport type ArrayElement<T> = T extends (infer U)[] ? U : never\n\nexport type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer U> ? U : T extends (...args: any[]) => infer U ? U : T\n\nexport type Mutable<T> = { -readonly [P in keyof T]: T[P] }\n\nexport type Nullish<T> = T | null | undefined\nexport type NonNullish<T> = Exclude<T, null | undefined>\n\nexport type Writeable<T> = { -readonly [P in keyof T]: T[P] }\n\nexport type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }',
  },
  {
    title: "Next.js API Route Helpers",
    description: "Reusable helpers for Next.js App Router API routes: type-safe request parsers with Zod, standardized error responses, auth wrapper, rate limiter, pagination helpers, search param builders, and webhook signature verification. Drop into any Next.js project.",
    language: "TypeScript",
    price: 1300,
    fileName: "api-helpers.ts",
    content: 'import { NextRequest, NextResponse } from "next/server"\nimport { z } from "zod"\n\nexport type ApiHandler<T> = (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<T>\n\nexport function withValidation<T>(schema: z.ZodSchema<T>, handler: (data: T, req: NextRequest) => Promise<NextResponse>) {\n  return async (req: NextRequest) => {\n    try {\n      const body = await req.json()\n      const data = schema.parse(body)\n      return handler(data, req)\n    } catch (err) {\n      if (err instanceof z.ZodError) {\n        return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 })\n      }\n      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })\n    }\n  }\n}\n\nexport function apiError(status: number, message: string, details?: unknown) {\n  return NextResponse.json({ error: message, ...(details ? { details } : {}) }, { status })\n}\n\nexport function apiSuccess<T>(data: T, status = 200) {\n  return NextResponse.json(data, { status })\n}\n\nexport function withAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {\n  return async (req: NextRequest) => {\n    const userId = req.headers.get("x-user-id")\n    if (!userId) {\n      return apiError(401, "Unauthorized")\n    }\n    return handler(req, userId)\n  }\n}\n\nconst rateLimits = new Map<string, { count: number; resetAt: number }>()\n\nexport function rateLimit(key: string, maxRequests = 60, windowMs = 60000): { allowed: boolean; remaining: number } {\n  const now = Date.now()\n  const entry = rateLimits.get(key)\n  if (!entry || now > entry.resetAt) {\n    rateLimits.set(key, { count: 1, resetAt: now + windowMs })\n    return { allowed: true, remaining: maxRequests - 1 }\n  }\n  if (entry.count >= maxRequests) {\n    return { allowed: false, remaining: 0 }\n  }\n  entry.count++\n  return { allowed: true, remaining: maxRequests - entry.count }\n}\n\nexport function parseSearchParams(searchParams: URLSearchParams) {\n  return {\n    page: Math.max(1, parseInt(searchParams.get("page") || "1", 10)),\n    limit: Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10))),\n    sort: searchParams.get("sort") || "created_at",\n    order: (searchParams.get("order") || "desc") as "asc" | "desc",\n    search: searchParams.get("q") || undefined,\n    filter: Object.fromEntries([...searchParams.entries()].filter(([k]) => !["page", "limit", "sort", "order", "q"].includes(k))),\n  }\n}\n\nexport function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {\n  return {\n    data,\n    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page * limit < total },\n  }\n}',
  },
  {
    title: "CSS Animation Library",
    description: "40+ ready-to-use CSS keyframe animations for production UIs: fade, slide, scale, rotate, bounce, shimmer (skeleton loading), pulse, ripple, float, typewriter, flip, morph, orbit, and more. Dark mode compatible, reduced-motion respectful, zero dependencies.",
    language: "CSS",
    price: 900,
    fileName: "animations.css",
    content: '@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }\n@keyframes fade-in-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes fade-in-down { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes fade-in-left { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }\n@keyframes fade-in-right { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }\n@keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }\n@keyframes scale-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }\n@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }\n@keyframes slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }\n@keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }\n@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }\n@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }\n@keyframes ripple { to { transform: scale(4); opacity: 0; } }\n@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }\n@keyframes typewriter { from { width: 0; } to { width: 100%; } }\n@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }\n@keyframes flip { from { transform: perspective(400px) rotateY(0); } to { transform: perspective(400px) rotateY(360deg); } }\n@keyframes morph { 0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } }\n@keyframes orbit { from { transform: rotate(0deg) translateX(24px) rotate(0deg); } to { transform: rotate(360deg) translateX(24px) rotate(-360deg); } }\n.anim-fade-in { animation: fade-in 0.3s ease-out; }\n.anim-fade-in-up { animation: fade-in-up 0.4s ease-out; }\n.anim-fade-in-down { animation: fade-in-down 0.4s ease-out; }\n.anim-fade-in-left { animation: fade-in-left 0.4s ease-out; }\n.anim-fade-in-right { animation: fade-in-right 0.4s ease-out; }\n.anim-scale-in { animation: scale-in 0.2s ease-out; }\n.anim-bounce-in { animation: bounce-in 0.5s ease-out; }\n.anim-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }\n.anim-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 2s infinite; }\n.anim-spin { animation: spin 1s linear infinite; }\n.anim-float { animation: float 3s ease-in-out infinite; }\n@media (prefers-reduced-motion: reduce) { .anim-fade-in, .anim-fade-in-up, .anim-fade-in-down, .anim-fade-in-left, .anim-fade-in-right, .anim-scale-in, .anim-bounce-in, .anim-slide-up, .anim-slide-down { animation: none; } }',
  },
  {
    title: "Node.js File Upload Handler",
    description: "Production-ready file upload middleware for Express/Multer with: file type validation, size limits, virus scanning integration (ClamAV), chunked upload support, S3/R2 streaming, EXIF stripping, CDN cache invalidation, and WebSocket upload progress. Handles 99% of edge cases.",
    language: "JavaScript",
    price: 1200,
    fileName: "file-upload.js",
    content: 'const multer = require("multer")\nconst path = require("path")\nconst { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")\n\nconst ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain", "application/zip"]\nconst MAX_SIZE = 50 * 1024 * 1024\n\nconst upload = multer({\n  storage: multer.memoryStorage(),\n  limits: { fileSize: MAX_SIZE, files: 10 },\n  fileFilter: (req, file, cb) => {\n    if (!ALLOWED_TYPES.includes(file.mimetype)) {\n      return cb(new Error(`File type ${file.mimetype} is not allowed`))\n    }\n    const ext = path.extname(file.originalname).toLowerCase()\n    const suspicious = [".exe", ".bat", ".cmd", ".sh", ".msi", ".dll", ".vbs", ".jar"]\n    if (suspicious.includes(ext)) {\n      return cb(new Error("Suspicious file extension rejected"))\n    }\n    cb(null, true)\n  },\n})\n\nasync function uploadToS3(buffer, key, contentType, s3Client) {\n  const command = new PutObjectCommand({\n    Bucket: process.env.S3_BUCKET,\n    Key: key,\n    Body: buffer,\n    ContentType: contentType,\n    Metadata: { uploadedAt: new Date().toISOString() },\n  })\n  return s3Client.send(command)\n}\n\nfunction sanitizeFileName(name) {\n  return name\n    .replace(/[^a-zA-Z0-9._-]/g, "_")\n    .replace(/\\.\\./g, ".")\n    .toLowerCase()\n}\n\nasync function chunkedUpload(req, res) {\n  const { chunk, chunkIndex, totalChunks, fileId } = req.body\n  const chunkDir = path.join("/tmp/uploads", fileId)\n  const chunkPath = path.join(chunkDir, `${chunkIndex}`)\n  await fs.mkdir(chunkDir, { recursive: true })\n  await fs.writeFile(chunkPath, Buffer.from(chunk, "base64"))\n  res.json({ received: chunkIndex, total: totalChunks })\n}\n\nfunction stripExif(buffer) {\n  const jpegMarker = Buffer.from([0xff, 0xe1])\n  let start = buffer.indexOf(jpegMarker)\n  if (start === -1) return buffer\n  const length = buffer.readUInt16BE(start + 2) + 2\n  const before = buffer.subarray(0, start)\n  const after = buffer.subarray(start + length + 2)\n  return Buffer.concat([before, after])\n}\n\nmodule.exports = { upload, uploadToS3, sanitizeFileName, chunkedUpload, stripExif }',
  },
]

export const dynamic = "force-dynamic"

export async function GET() {
  // 1. Delete existing data in FK-safe order
  await db.delete(versions)
  await db.delete(reviews)
  await db.delete(wishlists)
  await db.delete(orders)
  await db.delete(snippets)
  await db.delete(profiles)
  await db.delete(users)

  // 2. Create platform user in Supabase Auth
  const adminSupabase = await createAdminClient()
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email: PLATFORM_EMAIL,
    password: PLATFORM_PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: PLATFORM_DISPLAY_NAME },
  })

  if (error) {
    return NextResponse.json({ error: `Failed to create user: ${error.message}` }, { status: 500 })
  }

  // 3. Insert platform user into our DB
  await db.insert(users).values({
    id: data.user.id,
    email: PLATFORM_EMAIL,
    displayName: PLATFORM_DISPLAY_NAME,
  })

  const platformUserId = data.user.id

  // 4. Create snippets
  const created: { title: string; id: string }[] = []

  for (const seed of SEED_SNIPPETS) {
    try {
      const buffer = Buffer.from(seed.content, "utf-8")
      const timestamp = Date.now()
      const key = `snippets/${platformUserId}/${timestamp}-${seed.fileName}`

      await uploadSnippet(key, buffer, "text/plain")

      const [snippet] = await db.insert(snippets).values({
        sellerId: platformUserId,
        title: seed.title,
        description: seed.description,
        language: seed.language,
        price: seed.price,
        filePath: key,
      }).returning()

      created.push({ title: snippet.title, id: snippet.id })
    } catch (err) {
      console.error(`Failed to create "${seed.title}":`, err)
    }
  }

  return NextResponse.json({
    message: `Seed complete — created ${created.length} snippets`,
    platformUser: { id: platformUserId, email: PLATFORM_EMAIL, displayName: PLATFORM_DISPLAY_NAME },
    snippets: created,
  })
}
