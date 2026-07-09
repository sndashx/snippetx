import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { cn } from "@/lib/utils"

interface Member {
  name: string
  role: string
  group: "Research" | "Engineering" | "Safety" | "Operations"
  bio: string
}

/**
 * Deterministic seed → hue rotation.
 * The same name always renders the same gradient.
 */
function seedFromName(name: string): number {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 360
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")

  const hue = seedFromName(name)
  const hueAlt = (hue + 38) % 360

  // hsl() of the lab's accent + an analogous muted hue, so every avatar sits
  // inside the brand palette without an icon library.
  const a = `hsl(${hue} 90% 60% / 0.85)`
  const b = `hsl(${hueAlt} 50% 35% / 0.9)`
  const c = `hsl(${(hue + 200) % 360} 40% 22% / 0.95)`

  const id = `mono-${hue}`

  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      role="img"
      aria-label={`${name} avatar`}
      className="block size-16 rounded-full"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="60%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="white" stopOpacity={0.18} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${id})`} />
      <circle cx="32" cy="32" r="32" fill={`url(#${id}-glow)`} />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display), ui-serif, Georgia, serif"
        fontSize="22"
        fontWeight={400}
        fill="rgba(7, 7, 8, 0.92)"
        letterSpacing="-0.02em"
      >
        {initials}
      </text>
    </svg>
  )
}

const members: Member[] = [
  {
    name: "Dr. Aisha Vance",
    role: "Co-founder, CEO",
    group: "Operations",
    bio: "Previously led frontier-model alignment at a major research lab. Background in theoretical CS and category theory.",
  },
  {
    name: "Marcus Lindqvist",
    role: "Co-founder, CTO",
    group: "Engineering",
    bio: "Built the inference stack that powers three of the largest production agents in the world. Believes in small teams and ugly prototypes.",
  },
  {
    name: "Dr. Kara Vance",
    role: "Head of Research",
    group: "Research",
    bio: "Reasoning, planning, and self-consistency. Author of four papers on agentic evaluation.",
  },
  {
    name: "Renée Okafor",
    role: "Principal Research Scientist",
    group: "Research",
    bio: "Sparse architectures and efficient inference. Maintains the open-source minimax-eval suite.",
  },
  {
    name: "Yuto Park",
    role: "Staff Engineer, Inference",
    group: "Engineering",
    bio: "Distributed systems, KV-cache wizardry, and the person to blame when latency regresses.",
  },
  {
    name: "Dr. Tomoko Nakamura",
    role: "Alignment Lead",
    group: "Safety",
    bio: "Reward modelling, distribution shift, and the boring infrastructure that keeps agents honest.",
  },
  {
    name: "Diego Romero",
    role: "Research Engineer",
    group: "Research",
    bio: "Tool-use, agent traces, and the open agenttrace tracing toolkit.",
  },
  {
    name: "Priya Singh",
    role: "Head of Safety Operations",
    group: "Safety",
    bio: "Runs the red-team and incident response programs. Previously at a major incident-response consultancy.",
  },
  {
    name: "Lena Mercer",
    role: "Research Scientist",
    group: "Research",
    bio: "Multimodal evaluation and document understanding. Once trained a model to read Roman inscriptions.",
  },
  {
    name: "Hadi Kostov",
    role: "Engineering Lead, Tools",
    group: "Engineering",
    bio: "Schema design, tool contracts, and the relentless refusal to ship a flaky integration.",
  },
]

export function TeamSection() {
  const groups = Array.from(new Set(members.map((m) => m.group)))

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative border-t border-border/70 bg-card/20"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Team"
            title={<span id="team-heading">A small lab with a long horizon.</span>}
            description="We're researchers, engineers, and operators who think frontier AI deserves a careful, public-facing research culture. Here are some of the people behind minimax M3."
          />
        </Reveal>

        <Reveal delay={50}>
          <ul
            role="list"
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            {groups.map((g, i) => (
              <li
                key={g}
                className={cn(
                  "rounded-full border border-border bg-background/40 px-2.5 py-0.5",
                  i === 0 && "border-accent/40 text-foreground",
                )}
              >
                {g}
              </li>
            ))}
          </ul>
        </Reveal>

        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {members.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={Math.min(i * 40, 320)}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 transition-colors duration-500 ease-out-expo hover:border-accent/35">
                  <div className="flex items-start gap-4">
                    <Monogram name={m.name} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
                        {m.name}
                      </h3>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {m.bio}
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="text-foreground/80">{m.group}</span>
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}