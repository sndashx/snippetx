import { Hero } from "@/components/marketing/hero"
import { CapabilitiesSection } from "@/components/marketing/capabilities-section"
import { ResearchSection } from "@/components/marketing/research-section"
import { BenchmarksSection } from "@/components/marketing/benchmarks-section"
import { SafetySection } from "@/components/marketing/safety-section"
import { TeamSection } from "@/components/marketing/team-section"
import { ContactSection } from "@/components/marketing/contact-section"
import { SiteFooter } from "@/components/marketing/site-footer"

export default function Home() {
  return (
    <div className="relative flex flex-col bg-background text-foreground">
      <Hero />
      <CapabilitiesSection />
      <ResearchSection />
      <BenchmarksSection />
      <SafetySection />
      <TeamSection />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}