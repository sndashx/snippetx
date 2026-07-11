import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { cn } from "@/lib/utils"

interface Fellow {
  name: string
  role: string
  group: "Mathematics" | "Computation" | "Biology" | "Social Science" | "Operations"
  axis: string
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

  // All avatars sit inside the SN-X palette — copper-and-bone, never neon.
  const a = `hsl(${hue} 60% 58% / 0.85)`
  const b = `hsl(${hueAlt} 35% 28% / 0.9)`
  const c = `hsl(${(hue + 200) % 360} 30% 18% / 0.95)`

  const id = `mono-${hue}`

  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      role="img"
      aria-label={`${name} monogram`}
      className="block size-16 rounded-full"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="60%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="white" stopOpacity={0.16} />
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
        fill="rgba(6, 8, 15, 0.92)"
        letterSpacing="-0.02em"
      >
        {initials}
      </text>
    </svg>
  )
}

const fellows: Fellow[] = [
  {
    name: "Dr. K. Vance",
    role: "Director",
    group: "Mathematics",
    axis: "Foundations of Complexity",
    bio: "Statistical mechanics of disordered systems. Author of the SN-X founding charter.",
  },
  {
    name: "Prof. M. Lindqvist",
    role: "Senior Fellow",
    group: "Mathematics",
    axis: "Foundations of Inference",
    bio: "Causal identification, decision theory, and the philosophy of model-based reasoning.",
  },
  {
    name: "Dr. R. Okafor",
    role: "Senior Fellow",
    group: "Computation",
    axis: "Computation & Information",
    bio: "Geometry of learned representations; phase transitions in representation topology at scale.",
  },
  {
    name: "Dr. T. Nakamura",
    role: "Senior Fellow",
    group: "Biology",
    axis: "Biological Complex Systems",
    bio: "Morphogenesis as inference; chick feather primordia; the embryology of pattern.",
  },
  {
    name: "Dr. L. Mercer",
    role: "Resident Fellow",
    group: "Mathematics",
    axis: "Foundations of Complexity",
    bio: "Avalanche statistics, branching processes, and the topology of critical phenomena.",
  },
  {
    name: "Dr. S. Haddad",
    role: "Resident Fellow",
    group: "Computation",
    axis: "Computation & Information",
    bio: "Algorithmic information theory and the geometry of large-model representations.",
  },
  {
    name: "Dr. Y. Park",
    role: "Resident Fellow",
    group: "Computation",
    axis: "Computation & Information",
    bio: "Sparse architectures and the efficiency frontiers of large neural systems.",
  },
  {
    name: "Dr. A. Bauer",
    role: "Resident Fellow",
    group: "Biology",
    axis: "Biological Complex Systems",
    bio: "Immune learning, somatic hypermutation, and the design of continual-learning agents.",
  },
  {
    name: "Dr. I. Kostov",
    role: "Resident Fellow",
    group: "Social Science",
    axis: "Social & Economic Complexity",
    bio: "Markets as distributed message-passing; price-discovery under message-passing dynamics.",
  },
  {
    name: "Dr. D. Romero",
    role: "Resident Fellow",
    group: "Social Science",
    axis: "Social & Economic Complexity",
    bio: "Cooperation, conventions, and the equilibrium structure of institutions.",
  },
  {
    name: "Dr. P. Singh",
    role: "Resident Fellow",
    group: "Social Science",
    axis: "Social & Economic Complexity",
    bio: "Market microstructure; the latency–volatility frontier in high-frequency data.",
  },
  {
    name: "C. Lindholm",
    role: "Operations Director",
    group: "Operations",
    axis: "—",
    bio: "Runs the residential programme and the publication office. Keeps the corridors open.",
  },
]

export function TeamSection() {
  const groups = Array.from(new Set(fellows.map((m) => m.group)))

  return (
    <section
      id="fellowship"
      aria-labelledby="fellowship-heading"
      className="relative border-t border-border/70 bg-card/20"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Resident fellows"
            title={
              <span id="fellowship-heading">
                Twenty-three people in two buildings.
              </span>
            }
            description="We appoint resident fellows by nomination and by open competition, on five-year terms. Most appointments are deliberately joint — the corridors cross the axes."
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
          {fellows.map((m, i) => (
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
                  <div className="mt-4 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="text-foreground/80">{m.group}</span>
                    <span className="truncate text-right text-accent/80">
                      {m.axis}
                    </span>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}