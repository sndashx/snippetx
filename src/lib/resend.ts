import { Resend } from "resend"

let _resend: Resend | null = null

function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY")
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

// Named export — lazily initialized
export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    return Reflect.get(getResend(), prop)
  },
})

export const FROM_EMAIL = "NUMINA <noreply@sn-x.com>"
