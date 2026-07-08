import { db } from "@/db"
import { users, snippets } from "@/db/schema"
import { createAdminClient } from "@/lib/supabase/server"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

const ADMIN_EMAIL = "snippetxadmin@numina.org"
const ADMIN_PASSWORD = "Sn1pp3tX@dm1n2026!"
const ADMIN_DISPLAY_NAME = "SNIPPETxADMIN"

const SNIPPET_DATA = [
  // TypeScript (20 snippets)
  { title: "React Hook Form Validation Kit", description: "Reusable form validation schemas and components for React Hook Form + Zod. Includes email, password, credit card, phone number validators.", language: "TypeScript", price: 1200, fileName: "validation-kit.ts", featured: true, tags: ["react", "forms", "validation"] },
  { title: "TypeScript Utility Types Pack", description: "40+ advanced TypeScript utility types for production apps: DeepPartial, DeepRequired, NonNullableFields, UnionToIntersection, Prettify, Brand.", language: "TypeScript", price: 1000, fileName: "utility-types.ts", featured: true, tags: ["typescript", "types", "utilities"] },
  { title: "React Custom Hooks Collection", description: "12 production-ready React hooks: useDebounce, useLocalStorage, useMediaQuery, useIntersectionObserver, useClipboard, useOnlineStatus.", language: "TypeScript", price: 1800, fileName: "react-hooks.ts", featured: false, tags: ["react", "hooks"] },
  { title: "Next.js API Route Helpers", description: "Reusable helpers for Next.js App Router API routes: type-safe request parsers with Zod, standardized error responses, auth wrapper.", language: "TypeScript", price: 1300, fileName: "api-helpers.ts", featured: false, tags: ["nextjs", "api", "helpers"] },
  { title: "Zod Schema Builder", description: "Dynamic Zod schema generator for API responses, form validation, and database models. Supports custom validators and error messages.", language: "TypeScript", price: 900, fileName: "zod-builder.ts", featured: false, tags: ["zod", "validation", "schemas"] },
  { title: "React State Management Kit", description: "Lightweight state management with Zustand + Immer. Includes persistent state, devtools, and subscription patterns.", language: "TypeScript", price: 1100, fileName: "state-management.ts", featured: false, tags: ["react", "state", "zustand"] },
  { title: "TypeScript Error Handling Pack", description: "Result type, custom error classes, error boundaries, and retry utilities for type-safe error handling in TypeScript.", language: "TypeScript", price: 800, fileName: "error-handling.ts", featured: false, tags: ["typescript", "errors", "handling"] },
  { title: "React Performance Optimizer", description: "Memoization hooks, virtualized lists, lazy loading utilities, and bundle analysis helpers for React performance.", language: "TypeScript", price: 1500, fileName: "react-perf.ts", featured: false, tags: ["react", "performance", "optimization"] },
  { title: "TypeScript API Client Generator", description: "Auto-generate type-safe API clients from OpenAPI specs. Includes retry logic, caching, and request/response interceptors.", language: "TypeScript", price: 2000, fileName: "api-client.ts", featured: true, tags: ["typescript", "api", "codegen"] },
  { title: "React Animation Utilities", description: "Framer Motion wrapper hooks for common animations: fade, slide, scale, stagger, and scroll-triggered animations.", language: "TypeScript", price: 1200, fileName: "react-animations.ts", featured: false, tags: ["react", "animation", "framer"] },
  { title: "TypeScript Date Utils", description: "Lightweight date manipulation library with formatting, parsing, relative time, and timezone support. Zero dependencies.", language: "TypeScript", price: 700, fileName: "date-utils.ts", featured: false, tags: ["typescript", "date", "utilities"] },
  { title: "React Form Wizard", description: "Multi-step form wizard component with validation, state persistence, and navigation. Supports conditional steps.", language: "TypeScript", price: 1400, fileName: "form-wizard.tsx", featured: false, tags: ["react", "forms", "wizard"] },
  { title: "TypeScript Debounce/Throttle", description: "Production-ready debounce and throttle functions with cancel, flush, and leading/trailing options.", language: "TypeScript", price: 600, fileName: "debounce-throttle.ts", featured: false, tags: ["typescript", "performance", "utilities"] },
  { title: "React Toast Notifications", description: "Accessible toast notification system with queue management, auto-dismiss, and customizable styles.", language: "TypeScript", price: 1100, fileName: "toast-system.tsx", featured: false, tags: ["react", "notifications", "ui"] },
  { title: "TypeScript Retry Handler", description: "Exponential backoff retry utility with jitter, circuit breaker pattern, and configurable error filters.", language: "TypeScript", price: 800, fileName: "retry-handler.ts", featured: false, tags: ["typescript", "resilience", "retry"] },
  { title: "React Data Table", description: "Sortable, filterable data table component with pagination, selection, and export. Built with TanStack Table.", language: "TypeScript", price: 2200, fileName: "data-table.tsx", featured: true, tags: ["react", "table", "data"] },
  { title: "TypeScript Object Utils", description: "Deep clone, merge, pick, omit, and transform utilities for complex nested objects.", language: "TypeScript", price: 700, fileName: "object-utils.ts", featured: false, tags: ["typescript", "objects", "utilities"] },
  { title: "React Modal Manager", description: "Accessible modal dialog system with focus trap, escape key handling, and animation support.", language: "TypeScript", price: 900, fileName: "modal-manager.tsx", featured: false, tags: ["react", "modal", "ui"] },
  { title: "TypeScript Cache Manager", description: "In-memory cache with TTL, LRU eviction, and serialization. Supports both sync and async operations.", language: "TypeScript", price: 1000, fileName: "cache-manager.ts", featured: false, tags: ["typescript", "cache", "performance"] },
  { title: "React Auth Context", description: "Complete authentication context with login, logout, register, password reset, and session management.", language: "TypeScript", price: 1600, fileName: "auth-context.tsx", featured: false, tags: ["react", "auth", "context"] },

  // JavaScript (20 snippets)
  { title: "Auth Middleware Suite", description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support. Includes rate limiting, refresh token rotation, and RBAC.", language: "JavaScript", price: 1900, fileName: "auth-middleware.js", featured: true, tags: ["auth", "middleware", "jwt"] },
  { title: "SQL Query Builder", description: "Lightweight SQL query builder for Node.js with SELECT, INSERT, UPDATE, DELETE, JOINs, and parameterized queries. Zero dependencies.", language: "JavaScript", price: 800, fileName: "query-builder.js", featured: false, tags: ["sql", "database", "query"] },
  { title: "Express Rate Limiter & Security Pack", description: "Production-ready Express security middleware bundle: rate limiting, CORS hardening, helmet config, SQL injection prevention, XSS filtering.", language: "JavaScript", price: 1400, fileName: "express-security.js", featured: true, tags: ["express", "security", "middleware"] },
  { title: "Node.js File Upload Handler", description: "Production-ready file upload middleware for Express/Multer with: file type validation, size limits, virus scanning integration.", language: "JavaScript", price: 1200, fileName: "file-upload.js", featured: false, tags: ["node", "upload", "files"] },
  { title: "WebSocket Chat Server", description: "Real-time chat server with rooms, typing indicators, message history, and presence tracking. Built with Socket.io.", language: "JavaScript", price: 1800, fileName: "chat-server.js", featured: false, tags: ["websocket", "chat", "realtime"] },
  { title: "Express API Boilerplate", description: "Production-ready Express API starter with middleware chain, error handling, logging, rate limiting, and Swagger docs.", language: "JavaScript", price: 1100, fileName: "express-boilerplate.js", featured: false, tags: ["express", "api", "boilerplate"] },
  { title: "Node.js Queue System", description: "In-memory job queue with retry logic, delayed jobs, priority queues, and concurrency control.", language: "JavaScript", price: 1500, fileName: "queue-system.js", featured: false, tags: ["node", "queue", "jobs"] },
  { title: "Express Validator Pack", description: "Request validation middleware with Joi, custom validators, sanitizers, and error formatting.", language: "JavaScript", price: 900, fileName: "express-validator.js", featured: false, tags: ["express", "validation", "middleware"] },
  { title: "Node.js Logger Utils", description: "Structured logging with Winston, log rotation, request correlation, and custom transports.", language: "JavaScript", price: 800, fileName: "logger-utils.js", featured: false, tags: ["node", "logging", "utils"] },
  { title: "Express Session Manager", description: "Session management with Redis store, CSRF protection, secure cookies, and session fixation prevention.", language: "JavaScript", price: 1000, fileName: "session-manager.js", featured: false, tags: ["express", "session", "redis"] },
  { title: "Node.js Cache Middleware", description: "HTTP cache middleware with ETags, conditional requests, and Redis-backed distributed caching.", language: "JavaScript", price: 1200, fileName: "cache-middleware.js", featured: false, tags: ["node", "cache", "middleware"] },
  { title: "Express Error Handler", description: "Centralized error handling with custom error classes, validation errors, and structured error responses.", language: "JavaScript", price: 700, fileName: "error-handler.js", featured: false, tags: ["express", "errors", "handling"] },
  { title: "Node.js HTTP Client", description: "Axios wrapper with retry logic, request/response interceptors, caching, and timeout handling.", language: "JavaScript", price: 900, fileName: "http-client.js", featured: false, tags: ["node", "http", "client"] },
  { title: "Express Router Factory", description: "Auto-generate Express routes from schema definitions with validation, auth, and pagination.", language: "JavaScript", price: 1300, fileName: "router-factory.js", featured: false, tags: ["express", "router", "codegen"] },
  { title: "Node.js Stream Utils", description: "Stream utilities: pipeline, transform, merge, split, and backpressure handling for Node.js streams.", language: "JavaScript", price: 800, fileName: "stream-utils.js", featured: false, tags: ["node", "streams", "utils"] },
  { title: "Express CORS Manager", description: "Dynamic CORS configuration with origin whitelisting, credentials, and preflight caching.", language: "JavaScript", price: 600, fileName: "cors-manager.js", featured: false, tags: ["express", "cors", "security"] },
  { title: "Node.js Crypto Utils", description: "Encryption, hashing, JWT helpers, and password utilities with bcrypt and argon2 support.", language: "JavaScript", price: 1100, fileName: "crypto-utils.js", featured: false, tags: ["node", "crypto", "security"] },
  { title: "Express Rate Limiter Pro", description: "Advanced rate limiting with sliding window, IP blocking, user-based limits, and Redis backing.", language: "JavaScript", price: 1400, fileName: "rate-limiter-pro.js", featured: false, tags: ["express", "rate-limit", "security"] },
  { title: "Node.js Config Manager", description: "Environment-aware configuration with validation, secrets management, and hot reloading.", language: "JavaScript", price: 700, fileName: "config-manager.js", featured: false, tags: ["node", "config", "env"] },
  { title: "Express Health Checker", description: "Health check endpoints with dependency monitoring, readiness probes, and Prometheus metrics.", language: "JavaScript", price: 900, fileName: "health-checker.js", featured: false, tags: ["express", "health", "monitoring"] },

  // Python (20 snippets)
  { title: "Python Data Pipeline", description: "Production-ready ETL pipeline framework with parallel processing, error handling, logging, and integration with S3, PostgreSQL.", language: "Python", price: 2400, fileName: "data_pipeline.py", featured: true, tags: ["python", "etl", "pipeline"] },
  { title: "Python Async Web Scraper", description: "High-performance async web scraper using httpx and BeautifulSoup. Features: concurrent pagination, rate limiting, retry logic.", language: "Python", price: 1600, fileName: "async_scraper.py", featured: false, tags: ["python", "scraper", "async"] },
  { title: "FastAPI Starter Kit", description: "Production-ready FastAPI application with SQLAlchemy, Alembic migrations, JWT auth, and Docker support.", language: "Python", price: 1800, fileName: "fastapi-starter.py", featured: true, tags: ["python", "fastapi", "api"] },
  { title: "Python ML Pipeline", description: "Machine learning pipeline with scikit-learn, feature engineering, model selection, and experiment tracking.", language: "Python", price: 2800, fileName: "ml_pipeline.py", featured: false, tags: ["python", "ml", "pipeline"] },
  { title: "Django REST Boilerplate", description: "Django REST Framework starter with serializers, viewsets, pagination, filtering, and token auth.", language: "Python", price: 1500, fileName: "django-rest.py", featured: false, tags: ["python", "django", "api"] },
  { title: "Python CLI Framework", description: "Click-based CLI framework with argument parsing, progress bars, colored output, and config file support.", language: "Python", price: 900, fileName: "cli-framework.py", featured: false, tags: ["python", "cli", "tools"] },
  { title: "Python Task Queue", description: "Celery-based task queue with retry logic, rate limiting, priority queues, and monitoring dashboard.", language: "Python", price: 1400, fileName: "task-queue.py", featured: false, tags: ["python", "celery", "queue"] },
  { title: "Python Testing Utils", description: "Pytest fixtures, factories, mocking helpers, and test data generators for comprehensive testing.", language: "Python", price: 1000, fileName: "testing-utils.py", featured: false, tags: ["python", "testing", "pytest"] },
  { title: "Python Cache Manager", description: "Multi-level caching with Redis, memcached, and in-memory LRU. Supports TTL, invalidation, and decorators.", language: "Python", price: 1100, fileName: "cache-manager.py", featured: false, tags: ["python", "cache", "redis"] },
  { title: "Python Logger Utils", description: "Structured logging with correlation IDs, log rotation, and integration with Sentry and Datadog.", language: "Python", price: 800, fileName: "logger-utils.py", featured: false, tags: ["python", "logging", "utils"] },
  { title: "Python Auth Library", description: "JWT authentication, OAuth2 integration, password hashing, and session management for Python apps.", language: "Python", price: 1200, fileName: "auth-library.py", featured: false, tags: ["python", "auth", "jwt"] },
  { title: "Python API Client", description: "Type-safe API client generator with retry logic, caching, and OpenAPI spec support.", language: "Python", price: 1300, fileName: "api-client.py", featured: false, tags: ["python", "api", "client"] },
  { title: "Python Data Validation", description: "Pydantic models with custom validators, serialization, and database integration.", language: "Python", price: 900, fileName: "data-validation.py", featured: false, tags: ["python", "pydantic", "validation"] },
  { title: "Python WebSocket Server", description: "FastAPI WebSocket server with rooms, broadcasting, and connection management.", language: "Python", price: 1100, fileName: "websocket-server.py", featured: false, tags: ["python", "websocket", "fastapi"] },
  { title: "Python Migration Utils", description: "Alembic migration helpers with auto-generation, data migrations, and rollback support.", language: "Python", price: 700, fileName: "migration-utils.py", featured: false, tags: ["python", "alembic", "migrations"] },
  { title: "Python Security Utils", description: "CSRF protection, XSS filtering, input sanitization, and security headers for Python web apps.", language: "Python", price: 1000, fileName: "security-utils.py", featured: false, tags: ["python", "security", "web"] },
  { title: "Python File Handler", description: "File upload, processing, and storage utilities with S3/R2 integration and virus scanning.", language: "Python", price: 1200, fileName: "file-handler.py", featured: false, tags: ["python", "files", "storage"] },
  { title: "Python Queue System", description: "RQ-based job queue with retry, scheduling, priority, and monitoring.", language: "Python", price: 1100, fileName: "queue-system.py", featured: false, tags: ["python", "rq", "queue"] },
  { title: "Python Config Manager", description: "Environment-aware configuration with validation, secrets management, and hot reloading.", language: "Python", price: 800, fileName: "config-manager.py", featured: false, tags: ["python", "config", "env"] },
  { title: "Python Health Checker", description: "Health check endpoints with dependency monitoring and Prometheus metrics.", language: "Python", price: 900, fileName: "health-checker.py", featured: false, tags: ["python", "health", "monitoring"] },

  // Go (15 snippets)
  { title: "Go API Starter", description: "Clean REST API boilerplate in Go with routing, middleware, PostgreSQL integration, structured logging, graceful shutdown.", language: "Go", price: 1500, fileName: "api-starter.go", featured: true, tags: ["go", "api", "rest"] },
  { title: "Go WebSocket Server", description: "High-performance WebSocket server with rooms, broadcasting, and connection management using gorilla/websocket.", language: "Go", price: 1800, fileName: "websocket-server.go", featured: false, tags: ["go", "websocket", "realtime"] },
  { title: "Go Microservice Kit", description: "Microservice starter with gRPC, service discovery, circuit breaker, and distributed tracing.", language: "Go", price: 2200, fileName: "microservice-kit.go", featured: false, tags: ["go", "microservice", "grpc"] },
  { title: "Go CLI Framework", description: "Cobra-based CLI framework with argument parsing, help generation, and config file support.", language: "Go", price: 1100, fileName: "cli-framework.go", featured: false, tags: ["go", "cli", "cobra"] },
  { title: "Go Database Migrator", description: "Database migration tool with up/down/rollback, versioning, and PostgreSQL/MySQL support.", language: "Go", price: 1200, fileName: "db-migrator.go", featured: false, tags: ["go", "database", "migrations"] },
  { title: "Go JWT Auth", description: "JWT authentication middleware with token refresh, RBAC, and session management.", language: "Go", price: 1300, fileName: "jwt-auth.go", featured: false, tags: ["go", "auth", "jwt"] },
  { title: "Go Cache Library", description: "Multi-level caching with Redis, in-memory LRU, and distributed locking.", language: "Go", price: 1000, fileName: "cache-library.go", featured: false, tags: ["go", "cache", "redis"] },
  { title: "Go Logger", description: "Structured logging with Zap, correlation IDs, and log rotation.", language: "Go", price: 800, fileName: "logger.go", featured: false, tags: ["go", "logging", "zap"] },
  { title: "Go HTTP Client", description: "Resilient HTTP client with retry, circuit breaker, and timeout handling.", language: "Go", price: 900, fileName: "http-client.go", featured: false, tags: ["go", "http", "client"] },
  { title: "Go Queue Worker", description: "Background job processing with Redis queues, retry logic, and monitoring.", language: "Go", price: 1400, fileName: "queue-worker.go", featured: false, tags: ["go", "queue", "worker"] },
  { title: "Go Security Utils", description: "CSRF, CORS, rate limiting, and input sanitization middleware for Go web apps.", language: "Go", price: 1100, fileName: "security-utils.go", featured: false, tags: ["go", "security", "middleware"] },
  { title: "Go Config Manager", description: "Environment-aware configuration with validation and hot reloading.", language: "Go", price: 700, fileName: "config-manager.go", featured: false, tags: ["go", "config", "env"] },
  { title: "Go Health Checker", description: "Health check endpoints with dependency monitoring and Prometheus metrics.", language: "Go", price: 800, fileName: "health-checker.go", featured: false, tags: ["go", "health", "monitoring"] },
  { title: "Go Testing Utils", description: "Test helpers, mocks, and fixtures for Go applications.", language: "Go", price: 900, fileName: "testing-utils.go", featured: false, tags: ["go", "testing", "mocks"] },
  { title: "Go Stream Utils", description: "Stream processing utilities with pipeline, fan-out, and backpressure handling.", language: "Go", price: 1000, fileName: "stream-utils.go", featured: false, tags: ["go", "streams", "concurrency"] },

  // Rust (10 snippets)
  { title: "Rust Web Starter", description: "Actix-web boilerplate with middleware, database integration, error handling, and JWT auth.", language: "Rust", price: 1600, fileName: "web-starter.rs", featured: false, tags: ["rust", "web", "actix"] },
  { title: "Rust CLI Framework", description: "Clap-based CLI framework with argument parsing, help generation, and config file support.", language: "Rust", price: 1000, fileName: "cli-framework.rs", featured: false, tags: ["rust", "cli", "clap"] },
  { title: "Rust Error Handling", description: "Thiserror and anyhow patterns with custom error types and error context.", language: "Rust", price: 800, fileName: "error-handling.rs", featured: false, tags: ["rust", "errors", "handling"] },
  { title: "Rust Async Runtime", description: "Tokio-based async runtime with task spawning, channels, and timeout handling.", language: "Rust", price: 1200, fileName: "async-runtime.rs", featured: false, tags: ["rust", "async", "tokio"] },
  { title: "Rust Serialization Pack", description: "Serde helpers for JSON, TOML, YAML, and binary formats with custom serializers.", language: "Rust", price: 900, fileName: "serialization.rs", featured: false, tags: ["rust", "serde", "serialization"] },
  { title: "Rust Database Layer", description: "SQLx-based database layer with connection pooling, migrations, and type-safe queries.", language: "Rust", price: 1400, fileName: "db-layer.rs", featured: false, tags: ["rust", "database", "sqlx"] },
  { title: "Rust HTTP Client", description: "Reqwest-based HTTP client with retry logic, caching, and request/response interceptors.", language: "Rust", price: 1100, fileName: "http-client.rs", featured: false, tags: ["rust", "http", "client"] },
  { title: "Rust Config Manager", description: "Environment-aware configuration with validation and hot reloading.", language: "Rust", price: 800, fileName: "config-manager.rs", featured: false, tags: ["rust", "config", "env"] },
  { title: "Rust Testing Utils", description: "Test helpers, mocks, and fixtures for Rust applications.", language: "Rust", price: 900, fileName: "testing-utils.rs", featured: false, tags: ["rust", "testing", "mocks"] },
  { title: "Rust Security Utils", description: "CSRF, CORS, rate limiting, and input sanitization middleware for Rust web apps.", language: "Rust", price: 1000, fileName: "security-utils.rs", featured: false, tags: ["rust", "security", "middleware"] },

  // CSS (10 snippets)
  { title: "CSS Animation Library", description: "40+ ready-to-use CSS keyframe animations for production UIs: fade, slide, scale, rotate, bounce, shimmer, pulse.", language: "CSS", price: 900, fileName: "animations.css", featured: true, tags: ["css", "animation", "ui"] },
  { title: "CSS Grid Layout System", description: "Responsive grid system with auto-fit, minmax, and named grid areas. Mobile-first approach.", language: "CSS", price: 700, fileName: "grid-system.css", featured: false, tags: ["css", "grid", "layout"] },
  { title: "CSS Dark Mode Kit", description: "Complete dark mode implementation with CSS variables, transitions, and system preference detection.", language: "CSS", price: 800, fileName: "dark-mode.css", featured: false, tags: ["css", "dark-mode", "theme"] },
  { title: "CSS Typography Scale", description: "Responsive typography system with fluid sizing, line heights, and font stack optimization.", language: "CSS", price: 600, fileName: "typography.css", featured: false, tags: ["css", "typography", "design"] },
  { title: "CSS Reset & Normalize", description: "Modern CSS reset with consistent defaults across browsers and accessibility improvements.", language: "CSS", price: 500, fileName: "css-reset.css", featured: false, tags: ["css", "reset", "normalize"] },
  { title: "CSS Component Library", description: "50+ reusable CSS components: buttons, cards, modals, tooltips, accordions, tabs, and more.", language: "CSS", price: 1200, fileName: "components.css", featured: false, tags: ["css", "components", "ui"] },
  { title: "CSS Flexbox Utilities", description: "Flexbox utility classes for common layouts: center, space-between, wrap, and responsive breakpoints.", language: "CSS", price: 600, fileName: "flexbox-utils.css", featured: false, tags: ["css", "flexbox", "layout"] },
  { title: "CSS Form Styles", description: "Accessible form styles with validation states, floating labels, and custom checkboxes/radios.", language: "CSS", price: 700, fileName: "form-styles.css", featured: false, tags: ["css", "forms", "ui"] },
  { title: "CSS Table Styles", description: "Responsive table styles with sorting indicators, zebra striping, and mobile card view.", language: "CSS", price: 600, fileName: "table-styles.css", featured: false, tags: ["css", "tables", "ui"] },
  { title: "CSS Utility Classes", description: "Tailwind-inspired utility classes for spacing, colors, typography, and responsive design.", language: "CSS", price: 800, fileName: "utilities.css", featured: false, tags: ["css", "utilities", "tailwind"] },

  // YAML (5 snippets)
  { title: "GitHub Actions CI/CD", description: "Production-ready GitHub Actions workflows for Node.js, Python, and Go with caching, testing, and deployment.", language: "YAML", price: 1100, fileName: "github-actions.yml", featured: false, tags: ["github", "ci-cd", "actions"] },
  { title: "Docker Compose Stack", description: "Multi-service Docker Compose configuration with PostgreSQL, Redis, Nginx, and monitoring.", language: "YAML", price: 900, fileName: "docker-compose.yml", featured: false, tags: ["docker", "compose", "devops"] },
  { title: "Kubernetes Manifests", description: "Production-ready Kubernetes deployments, services, ingress, and configmaps for microservices.", language: "YAML", price: 1400, fileName: "k8s-manifests.yml", featured: false, tags: ["kubernetes", "k8s", "devops"] },
  { title: "Ansible Playbook Pack", description: "Ansible playbooks for server provisioning, deployment, and configuration management.", language: "YAML", price: 1200, fileName: "ansible-playbooks.yml", featured: false, tags: ["ansible", "automation", "devops"] },
  { title: "Terraform Modules", description: "Terraform modules for AWS/GCP infrastructure: VPC, ECS, RDS, S3, and monitoring.", language: "YAML", price: 1600, fileName: "terraform-modules.yml", featured: false, tags: ["terraform", "infrastructure", "devops"] },
]

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    // 1. Check if SNIPPETxADMIN user exists, create if not
    const adminSupabase = await createAdminClient()
    
    // Try to create the user (will fail if exists, that's ok)
    const { data: existingUsers } = await adminSupabase.auth.admin.listUsers()
    let adminUserId: string
    
    const existingAdmin = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)
    
    if (existingAdmin) {
      adminUserId = existingAdmin.id
    } else {
      const { data, error } = await adminSupabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: ADMIN_DISPLAY_NAME },
      })
      
      if (error) {
        return NextResponse.json({ error: `Failed to create admin user: ${error.message}` }, { status: 500 })
      }
      adminUserId = data.user.id
    }

    // 2. Ensure user exists in our DB
    const [existingDbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, adminUserId))
      .limit(1)

    if (!existingDbUser) {
      await db.insert(users).values({
        id: adminUserId,
        email: ADMIN_EMAIL,
        displayName: ADMIN_DISPLAY_NAME,
      })
    }

    // 3. Create snippets
    const created: { title: string; id: string; featured: boolean }[] = []
    const errors: { title: string; error: string }[] = []

    for (const snippet of SNIPPET_DATA) {
      try {
        const timestamp = Date.now() + Math.random() * 1000
        const key = `snippets/${adminUserId}/${timestamp}-${snippet.fileName}`

        const [newSnippet] = await db.insert(snippets).values({
          sellerId: adminUserId,
          title: snippet.title,
          description: snippet.description,
          language: snippet.language,
          price: snippet.price,
          filePath: key,
          tags: snippet.tags,
          featured: snippet.featured,
        }).returning()

        created.push({ title: newSnippet.title, id: newSnippet.id, featured: newSnippet.featured })
      } catch (err) {
        errors.push({ title: snippet.title, error: err instanceof Error ? err.message : "Unknown error" })
      }
    }

    return NextResponse.json({
      message: `Seed complete — created ${created.length} snippets (${errors.length} errors)`,
      adminUser: { id: adminUserId, email: ADMIN_EMAIL, displayName: ADMIN_DISPLAY_NAME },
      snippets: created,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Seed failed:", error)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
