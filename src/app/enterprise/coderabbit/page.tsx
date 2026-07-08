"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, DollarSign, Shield, Zap, ArrowRight, Search, Sparkles, Terminal, Cpu, Rocket, CheckCircle, GitBranch, GitMerge, FileText, Clock, Users, TrendingUp, Star, Crown, CrownIcon } from "lucide-react"
import { motion } from "framer-motion"
import { IntegrationBanner, IntegrationBadge } from "@/components/integration-banner"

export default function EnterpriseCodeRabbitPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl transition-opacity hover:opacity-80">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground neon-glow">
              <Code2 className="size-5" />
            </div>
            <span>NUMINA</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 sm:flex">
              <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse
              </Link>
              <Link href="/sell" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sell
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" className="rounded-full px-5 font-medium transition-all hover:neon-glow" render={<Link href="/login" />}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-48 sm:pb-32">
          {/* Background Glows */}
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-1/2 -right-24 size-96 rounded-full bg-primary/10 blur-[120px]" />
          
          <div className="mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-500 backdrop-blur-sm"
            >
              <Crown className="size-3" />
              <span>Enterprise Solution</span>
              <Star className="size-3 fill-current" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
            >
              CodeRabbit
              <span className="block bg-gradient-to-b from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Enterprise
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              The complete enterprise-grade PR & Release Note automation platform.
              Production-ready workflows that scale across your entire organization.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-full transition-all hover:neon-glow" render={<Link href="/browse" />}>
                View All Features
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold rounded-full backdrop-blur-sm transition-all hover:bg-muted" render={<Link href="/sell/new" />}>
                <DollarSign className="mr-2 size-4" />
                Purchase Now - $29
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Enterprise-Grade PR & Release Note Automation</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Everything you need for professional PR documentation and release management at scale.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GitBranch className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">PR Analysis</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Comprehensive PR analysis with security and performance impact assessment. Auto-generates structured summaries with required sections.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 border border-primary/20">
                  <span className="text-[10px] font-bold text-primary">AI-POWERED</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                  <FileText className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">Release Notes</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Automated release note generation using conventional commits. Smart grouping by type, scope, and impact level.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-500">ENTERPRISE</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-500/20 text-green-500">
                  <GitMerge className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">Quality Gates</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Automated quality gate validation with PR scoring, required labels, and merge blocking for compliance.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 border border-green-500/20">
                  <span className="text-[10px] font-bold text-green-500">COMPLIANT</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500">
                  <Clock className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">Workflow Automation</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  End-to-end workflow automation from PR creation to release notes. Auto-comment, notifications, and team collaboration.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-1 border border-purple-500/20">
                  <span className="text-[10px] font-bold text-purple-500">AUTOMATED</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
                  <Users className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">Team Collaboration</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Seamless team collaboration with role-based access, shared workflows, and centralized documentation.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-1 border border-blue-500/20">
                  <span className="text-[10px] font-bold text-blue-500">COLLABORATIVE</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/10 glass"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
                  <TrendingUp className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight">Analytics & Insights</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Comprehensive analytics and insights into PR patterns, release cycles, and team productivity.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 border border-red-500/20">
                  <span className="text-[10px] font-bold text-red-500">ANALYTICS</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Integration Service Section */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-500">
                <Zap className="size-3" />
                <span>Enterprise Integration</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Complete PR & Release Note Solution
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                From PR creation to release notes, everything you need for enterprise-scale development documentation.
              </p>
            </div>
            
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: Terminal,
                    title: "You Buy",
                    desc: "Purchase the Enterprise CodeRabbit solution. One-time payment of $29 for unlimited PR & release note automation.",
                    highlight: false,
                  },
                  {
                    icon: Rocket,
                    title: "We Deploy",
                    desc: "Our team configures your workflow, sets up the automation, and provides comprehensive documentation and training.",
                    highlight: true,
                  },
                  {
                    icon: Zap,
                    title: "You Scale",
                    desc: "Your team benefits from enterprise-grade PR documentation and release management at scale. No more manual work.",
                    highlight: false,
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className={`group relative rounded-2xl border p-8 transition-all ${
                      step.highlight
                        ? "border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-card hover:border-amber-500/50"
                        : "border-border bg-card hover:border-primary/30"
                    } glass`}
                  >
                    <div
                      className={`mb-4 flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                        step.highlight
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <step.icon className="size-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold tracking-tight">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    {step.highlight && (
                      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 border border-amber-500/20">
                        <span className="text-[10px] font-bold text-amber-500">ENTERPRISE SOLUTION</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
                  render={<Link href="/sell/new" />}
                >
                  <Crown className="mr-2 size-4" />
                  Purchase Enterprise Solution - $29
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Technical Specifications</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Built with enterprise-grade architecture and security.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-8 glass"
              >
                <h3 className="mb-6 text-xl font-bold tracking-tight">Core Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">PR Analysis</span>
                      <p className="text-sm text-muted-foreground">Comprehensive analysis with security & performance impact assessment</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Release Notes</span>
                      <p className="text-sm text-muted-foreground">Automated generation using conventional commits</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Quality Gates</span>
                      <p className="text-sm text-muted-foreground">PR scoring and compliance validation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Workflow Automation</span>
                      <p className="text-sm text-muted-foreground">End-to-end automation from PR to release</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Team Collaboration</span>
                      <p className="text-sm text-muted-foreground">Shared workflows and centralized documentation</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 glass"
              >
                <h3 className="mb-6 text-xl font-bold tracking-tight">Integration Details</h3>
                <ul className="space-y-4">\n                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">GitHub Actions</span>
                      <p className="text-sm text-muted-foreground">Native GitHub integration with PR and push triggers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Conventional Commits</span>
                      <p className="text-sm text-muted-foreground">Standardized commit message format</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Quality Gates</span>
                      <p className="text-sm text-muted-foreground">Automated validation and compliance checks</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Analytics Dashboard</span>
                      <p className="text-sm text-muted-foreground">Real-time insights and metrics</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-semibold">Enterprise Security</span>
                      <p className="text-sm text-muted-foreground">SOC 2 compliant with enterprise-grade security</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-4" />
            <span>NUMINA</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="hidden sm:inline opacity-50">|</span>
            <span>&copy; {new Date().getFullYear()} Numina Research, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
