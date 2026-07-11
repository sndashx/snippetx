import type { Metadata } from "next"
import { buildMetadata } from "@/lib/brand"
import { Hero } from "@/components/marketing/hero"
import { CapabilitiesSection } from "@/components/marketing/capabilities-section"
import { ResearchSection } from "@/components/marketing/research-section"
import { BenchmarksSection } from "@/components/marketing/benchmarks-section"
import { SafetySection } from "@/components/marketing/safety-section"
import { TeamSection } from "@/components/marketing/team-section"
import { ContactSection } from "@/components/marketing/contact-section"

export const metadata: Metadata = buildMetadata({
  title: "The mathematics of emergence",
  description:
    "SN-X Research Institution for Complex Science — a private research institution studying how simple rules give rise to rich behaviour in cells, societies, minds, and machines.",
  path: "/",
})

export default function Home() {
  return (
    <div className="relative flex flex-col bg-background text-foreground">
      <Hero />
      <CapabilitiesSection />
      <ResearchSection />
      <SafetySection />
      <TeamSection />
      <BenchmarksSection />
      <ContactSection />
    </div>
  )
}