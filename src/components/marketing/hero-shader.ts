/**
 * Vertex shader for the hero centerpiece.
 * A full-screen triangle — single draw, no vertex transforms needed.
 */
export const VERTEX_SHADER = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

/**
 * Fragment shader — a slow, flowing volumetric nebula driven by stacked
 * domain-warped value noise, tinted with the brand accent (#c8ff00).
 *
 * Reads uniforms:
 *   u_time      — seconds since start
 *   u_resolution — (width_px, height_px)
 *   u_aspect    — width / height
 *   u_accent    — linear RGB of the accent (vec3 in 0..1)
 *   u_ink       — linear RGB of the ink background (vec3 in 0..1)
 *   u_intensity — overall strength multiplier (0..1)
 *
 * The effect is intentionally subtle, painterly, and slow.
 * No textures, no branches — designed to run cheap on integrated GPUs at 30fps.
 */
export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_aspect;
uniform vec3  u_accent;
uniform vec3  u_ink;
uniform float u_intensity;

// --- hash & value noise (Inigo Quilez style) ---
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

// domain-warped fbm — gives a flowing, nebula-like quality
float warp(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.07),
                fbm(p + vec2(5.2, 1.3) - t * 0.05));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.04),
                fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.06));
  return fbm(p + 4.0 * r);
}

void main() {
  // Centered, aspect-corrected coords in roughly [-1, 1] vertically.
  vec2 uv = v_uv * 2.0 - 1.0;
  uv.x *= u_aspect;

  // Slow drift.
  float t = u_time * 0.06;

  // Two layered warps at slightly different scales for depth.
  float n1 = warp(uv * 1.1 + vec2(0.0, t), t);
  float n2 = warp(uv * 0.55 - vec2(t, 0.0), t * 0.8 + 7.13);

  // Compose a soft volumetric field — emphasize the upper-center like a
  // scientist's dream: a calm focal "lens flare nebula".
  float n  = mix(n1, n2, 0.55);

  // Radial bias so the brightest region sits near the focal area, like a
  // cinematic spotlight on the headline.
  vec2 c = vec2(0.0, 0.25);
  float r = length(uv - c);
  float radial = exp(-r * r * 0.85);

  // Combine
  float field = n * 0.55 + radial * 0.9;
  field = smoothstep(0.25, 1.05, field);

  // Soft horizontal scanline sheen — extremely subtle.
  float sheen = 0.04 * sin(v_uv.y * u_resolution.y * 0.6);

  // Color: ink base, lifted toward accent where the field is strongest.
  vec3 col = u_ink;
  col = mix(col, u_ink * 1.12, 1.0 - field * 0.85);
  col += u_accent * (field * 0.18 + radial * 0.12 + sheen) * u_intensity;

  // Editorial vignette
  float vig = smoothstep(1.35, 0.35, length(uv) * 0.95);
  col *= mix(0.55, 1.0, vig);

  outColor = vec4(col, 1.0);
}
`

/** Convert a hex like "#c8ff00" to a [0..1] RGB tuple (sRGB → linear skipped; shader uses linear-ish inputs). */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const v = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  )
  return [
    ((v >> 16) & 0xff) / 255,
    ((v >> 8) & 0xff) / 255,
    (v & 0xff) / 255,
  ]
}
