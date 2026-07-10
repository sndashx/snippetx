"use client"

import * as React from "react"

const ACCENT = "var(--brand-2, var(--accent))"

/**
 * <CursorAccent />
 *
 * Subtle pointer-follow accent: a tiny accent ring that smoothly tracks the
 * cursor across the whole window, and a slightly larger soft halo that
 * scales up over interactive elements (links, buttons, [data-cursor="link"]
 * or [data-cursor="button"] targets).
 *
 * Design constraints:
 *  - Pointer-fine + hover-capable only (skipped on touch / coarse / no-hover).
 *  - Disabled under prefers-reduced-motion.
 *  - Never hides the native cursor — it follows it.
 *  - Hides when hovering editable inputs/textareas so text caret stays accurate.
 *  - Zero per-frame React renders: positions are written via CSS variables
 *    to two fixed-position elements on rAF-coalesced pointermove.
 */
export function CursorAccent() {
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mqCoarse = window.matchMedia("(pointer: coarse)")
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mqHoverNone = window.matchMedia("(hover: none)")
    if (mqCoarse.matches || mqReduce.matches || mqHoverNone.matches) {
      return
    }

    const root = document.createElement("div")
    root.setAttribute("data-cursor-accent", "")
    root.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483647;"
    root.innerHTML = `
      <div data-cursor-ring style="position:absolute;left:0;top:0;width:18px;height:18px;margin-left:-9px;margin-top:-9px;border:1.5px solid ${ACCENT};border-radius:9999px;opacity:0;will-change:transform;transition:opacity .25s ease, transform .15s var(--ease-out-expo, ease-out), width .2s var(--ease-out-expo, ease-out), height .2s var(--ease-out-expo, ease-out), margin .2s var(--ease-out-expo, ease-out), border-color .2s ease;"></div>
      <div data-cursor-halo style="position:absolute;left:0;top:0;width:44px;height:44px;margin-left:-22px;margin-top:-22px;background:radial-gradient(circle at center, color-mix(in oklch, ${ACCENT} 45%, transparent), transparent 70%);border-radius:9999px;opacity:0;will-change:transform;transition:opacity .25s ease, transform .25s var(--ease-out-expo, ease-out), width .25s var(--ease-out-expo, ease-out), height .25s var(--ease-out-expo, ease-out), margin .25s var(--ease-out-expo, ease-out);"></div>
    `
    document.body.appendChild(root)

    const ring = root.querySelector<HTMLDivElement>(
      '[data-cursor-ring]',
    ) as HTMLDivElement | null
    const halo = root.querySelector<HTMLDivElement>(
      '[data-cursor-halo]',
    ) as HTMLDivElement | null
    if (!ring || !halo) {
      root.remove()
      return
    }

    let raf = 0
    let nx = 0
    let ny = 0
    let x = 0
    let y = 0
    let visible = false
    let leavingWindow = false
    let interactive = false
    let hideForEditable = false

    const flush = () => {
      raf = 0
      // ease toward target
      x += (nx - x) * 0.35
      y += (ny - y) * 0.35
      ring.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      halo.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      // Keep tweening while visibly moving or while not at rest
      if (
        visible &&
        (!leavingWindow || Math.abs(nx - x) > 0.1 || Math.abs(ny - y) > 0.1)
      ) {
        raf = requestAnimationFrame(flush)
      }
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(flush)
    }

    const showRing = () => {
      if (!visible) {
        visible = true
        ring.style.opacity = "1"
        halo.style.opacity = "1"
        wake()
      }
    }

    const hideRing = () => {
      visible = false
      ring.style.opacity = "0"
      halo.style.opacity = "0"
    }

    const setInteractive = (on: boolean) => {
      if (interactive === on) return
      interactive = on
      if (on) {
        // Enlarge ring + halo for emphasis
        ring.style.width = "32px"
        ring.style.height = "32px"
        ring.style.marginLeft = "-16px"
        ring.style.marginTop = "-16px"
        ring.style.borderColor = ACCENT
        halo.style.width = "72px"
        halo.style.height = "72px"
        halo.style.marginLeft = "-36px"
        halo.style.marginTop = "-36px"
      } else {
        ring.style.width = "18px"
        ring.style.height = "18px"
        ring.style.marginLeft = "-9px"
        ring.style.marginTop = "-9px"
        ring.style.borderColor = ACCENT
        halo.style.width = "44px"
        halo.style.height = "44px"
        halo.style.marginLeft = "-22px"
        halo.style.marginTop = "-22px"
      }
    }

    const setHideForEditable = (on: boolean) => {
      hideForEditable = on
      ring.style.opacity = on ? "0" : visible ? "1" : "0"
      halo.style.opacity = on ? "0" : visible ? "1" : "0"
    }

    const onMove = (e: PointerEvent) => {
      leavingWindow = false
      nx = e.clientX
      ny = e.clientY
      const t = e.target as HTMLElement | null
      if (!t) {
        showRing()
        wake()
        return
      }
      const tag = t.tagName
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        t.isContentEditable
      ) {
        setHideForEditable(true)
      } else {
        setHideForEditable(false)
      }

      // Detect interactive targets.
      const interactiveEl = t.closest<HTMLElement>(
        'a, button, [role="button"], [data-cursor="link"], [data-cursor="button"], label, summary, [tabindex]:not([tabindex="-1"])',
      )
      setInteractive(Boolean(interactiveEl))

      showRing()
      wake()
    }

    const onLeave = () => {
      leavingWindow = true
      hideRing()
    }

    const onEnter = () => {
      leavingWindow = false
    }

    const onDown = () => {
      ring.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(0.78)`
      halo.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(0.85)`
    }
    const onUp = () => {
      // Reset transform; next flush will overwrite anyway, so just wake.
      wake()
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerout", onLeave, { passive: true })
    window.addEventListener("pointerleave", onLeave, { passive: true })
    window.addEventListener("pointerenter", onEnter, { passive: true })
    window.addEventListener("blur", onLeave)
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })

    // Re-evaluate if the user toggles reduced-motion mid-session.
    const onChange = () => {
      if (
        mqCoarse.matches ||
        mqReduce.matches ||
        mqHoverNone.matches
      ) {
        root.remove()
      }
    }
    mqCoarse.addEventListener("change", onChange)
    mqReduce.addEventListener("change", onChange)
    mqHoverNone.addEventListener("change", onChange)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerout", onLeave)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointerenter", onEnter)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      mqCoarse.removeEventListener("change", onChange)
      mqReduce.removeEventListener("change", onChange)
      mqHoverNone.removeEventListener("change", onChange)
      root.remove()
    }
  }, [])

  return null
}
