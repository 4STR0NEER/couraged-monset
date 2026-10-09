import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FlaskConical, RotateCcw, X } from 'lucide-react'
import { useApp } from '../state.jsx'
import { EASE_OUT } from './ui.jsx'

// Discreet presenter controls. Each screen passes its own controls as children; Reset is always there.
export default function DemoMenu({ children }) {
  const { reset } = useApp()
  const [open, setOpen] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="press flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ash ring-1 ring-paper/10 backdrop-blur-sm"
      >
        {open ? <X className="size-3.5" aria-hidden="true" /> : <FlaskConical className="size-3.5" aria-hidden="true" />}
        Demo
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Demo controls"
            className="absolute top-full right-0 mt-2 w-72 origin-top-right rounded-xl bg-ink-2 p-3 text-paper shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] ring-1 ring-paper/10"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
          >
            <div className="space-y-3">{children}</div>
            <button
              type="button"
              onClick={() => {
                reset()
                setOpen(false)
              }}
              className="press mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-paper/15 px-3 py-2 text-sm font-semibold text-ash hover:text-paper"
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Reset demo data
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const DemoLabel = ({ children }) => <p className="px-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ash">{children}</p>
