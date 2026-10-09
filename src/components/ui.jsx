import { useEffect, useRef } from 'react'
import { animate, useMotionValue, useMotionValueEvent } from 'motion/react'
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import { initials } from '../data/mock.js'

export const EASE_OUT = [0.23, 1, 0.32, 1]
export const EASE_IN_OUT = [0.77, 0, 0.175, 1]

// Initials tiles cycle through brand-derived tints, picked by a stable hash of the name.
const TINTS = ['bg-gold text-ink', 'bg-crimson text-paper', 'bg-ink-2 text-gold', 'bg-[#E9DFC4] text-ink', 'bg-[#5C1020] text-paper']
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)

// className sets size and initials text size, e.g. "size-12 text-lg".
export function Avatar({ member, className = 'size-12 text-lg', rounded = 'rounded-full' }) {
  if (member.photo)
    return <img src={member.photo} alt="" style={{ objectPosition: member.photoPos }} className={`${className} ${rounded} shrink-0 object-cover`} />
  return (
    <span aria-hidden="true" className={`${className} ${rounded} ${TINTS[Math.abs(hash(member.name)) % TINTS.length]} grid shrink-0 place-items-center font-display font-extrabold leading-none`}>
      {initials(member.name)}
    </span>
  )
}

export const STATUS = {
  active: { label: 'Active', Icon: CircleCheck, solid: 'bg-active text-paper', soft: 'bg-active/12 text-active' },
  expiring: { label: 'Expiring soon', Icon: CircleAlert, solid: 'bg-expiring text-ink', soft: 'bg-expiring/20 text-[#7A5A00]' },
  expired: { label: 'Expired', Icon: CircleX, solid: 'bg-expired text-paper', soft: 'bg-expired/12 text-expired' },
}

// Never colour-only: icon + word on every badge.
export function StatusBadge({ status, solid, className = '' }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] ${solid ? s.solid : s.soft} ${className}`}>
      <s.Icon className="size-3.5" aria-hidden="true" />
      {s.label}
    </span>
  )
}

// Animates from the previous value to the new one; interruptible because it rides one motion value.
export function CountUp({ value, format = (v) => Math.round(v), duration = 0.6 }) {
  const ref = useRef(null)
  const mv = useMotionValue(value)
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: EASE_OUT })
    return () => c.stop()
  }, [mv, value, duration])
  useMotionValueEvent(mv, 'change', (v) => ref.current && (ref.current.textContent = format(v)))
  return <span ref={ref}>{format(value)}</span>
}

export const fmtDate = (t, opts = { weekday: 'short', month: 'short', day: 'numeric' }) => new Date(t).toLocaleDateString('en-PH', opts)
export const fmtTime = (t) => new Date(t).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })
